import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const updated = "November 1, 2026";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <PageHero title="Privacy Policy" subtitle={`Last updated: ${updated}`} />

      <div className="py-12 px-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto gradient-card border border-border rounded-xl p-6 md:p-9 space-y-7 font-body text-foreground/85 text-sm leading-relaxed"
        >
          <p className="text-muted-foreground">
            This policy explains what information Renegade Immortal may process when you browse the
            site, create an account, or participate in community features. It is a plain-language
            summary, not legal advice.
          </p>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">1. Information processed</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account and profile information:</strong> if you register, the site uses
                account details such as your email address and the profile information you choose
                to provide, including a display name, avatar, and bio.
              </li>
              <li>
                <strong>Community activity:</strong> content and information you submit through
                posts, comments, messages, groups, reports, and feedback features may be stored and
                shown to the people those features are designed to reach.
              </li>
              <li>
                <strong>Basic usage data:</strong> page visits are recorded with the route, a
                session identifier, browser user-agent, and referrer when available. Search and
                other feature-specific usage may also be recorded to operate and improve the site.
              </li>
              <li>
                <strong>Browser storage:</strong> the site uses local or session storage for
                settings and functionality such as language preference, tracker data, and session
                identifiers. Authentication providers may also use browser storage or cookies to
                maintain sign-in state.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">2. How information is used</h2>
            <p>
              Information is used to provide accounts, profiles, messaging and community tools;
              remember preferences; maintain release and reading trackers; respond to support,
              copyright, and safety requests; prevent abuse; and understand site usage. Public
              profile details and content are visible according to the relevant feature and its
              settings.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">3. Service providers and links</h2>
            <p>
              The site relies on third-party services for hosting, authentication, database and
              storage functionality, and external media metadata. Donghua playback may link to or
              embed third-party video pages. When you visit an external service or play its content,
              that provider may receive information under its own policies. Review the provider’s
              terms and privacy notice before using it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">4. Sharing and retention</h2>
            <p>
              We do not sell personal information. Information may be processed by service
              providers that help operate the site, disclosed when reasonably necessary to address
              security or legal requests, or made visible through the community features you use.
              Information is retained for as long as needed to provide the feature, maintain site
              records, address safety matters, or meet applicable obligations. Exact retention
              periods may depend on the service and record.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">5. Your choices</h2>
            <p>
              You can edit profile details through account settings and clear browser storage using
              your browser controls. You may contact us to ask about account or personal
              information, including deletion requests. Some information may need to be retained
              where required for security, moderation, or legal reasons. Clearing browser storage
              may sign you out or reset locally saved preferences and tracker information.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">6. Children and safety</h2>
            <p>
              The site is not designed to knowingly collect personal information from children who
              are not permitted to use online services under the laws that apply to them. Contact us
              if you believe a child has provided personal information so we can review the
              request.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-foreground mb-2">7. Changes and contact</h2>
            <p>
              This policy may change as site features or service providers change. The latest
              version and its effective date will be posted here. For privacy questions, use the{" "}
              <Link to="/contact" className="text-primary hover:underline">contact page</Link> or
              email{" "}
              <a href="mailto:mail.jkyme@gmail.com" className="text-primary hover:underline">
                mail.jkyme@gmail.com
              </a>.
            </p>
          </section>
        </motion.article>
      </div>
    </Layout>
  );
}
