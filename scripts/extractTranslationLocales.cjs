const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const sourcePath = path.join(__dirname, "..", "src", "hooks", "useTranslation.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true);
let translationsStatement;
let translationsInitializer;

for (const statement of sourceFile.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.name.text === "translations" && declaration.initializer) {
      translationsStatement = statement;
      translationsInitializer = declaration.initializer;
    }
  }
}

if (!translationsStatement || !translationsInitializer) {
  throw new Error("Could not find the translations dictionary in useTranslation.ts");
}

const initializerText = ts.createPrinter().printNode(ts.EmitHint.Expression, translationsInitializer, sourceFile);
const translations = vm.runInNewContext(`(${initializerText})`);
const localesDirectory = path.join(__dirname, "..", "src", "i18n", "locales");
fs.mkdirSync(localesDirectory, { recursive: true });

for (const [locale, messages] of Object.entries(translations)) {
  fs.writeFileSync(path.join(localesDirectory, `${locale}.json`), `${JSON.stringify(messages, null, 2)}\n`, "utf8");
}

const resourceImports = Object.keys(translations)
  .map((locale) => `import ${locale} from "./locales/${locale}.json";`)
  .join("\n");
const resourceModule = `${resourceImports}\n\nexport const translations: Record<string, Record<string, string>> = {\n${Object.keys(translations).map((locale) => `  ${locale},`).join("\n")}\n};\n`;
fs.writeFileSync(path.join(__dirname, "..", "src", "i18n", "resources.ts"), resourceModule, "utf8");

const importStatement = 'import { translations } from "@/i18n/resources";';
const rewritten = `${source.slice(0, translationsStatement.getFullStart())}${importStatement}\n\n${source.slice(translationsStatement.end)}`;
fs.writeFileSync(sourcePath, rewritten, "utf8");

console.log(`Extracted ${Object.keys(translations).length} locales and ${Object.keys(translations.en ?? {}).length} English keys.`);
