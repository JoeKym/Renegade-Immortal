import { describe, it, expect } from "vitest";
import { extractVideoEmbedFromHtml, normalizeEmbedUrl } from "@/lib/videoSourceParsers";

describe("LuciferDonghua extraction", () => {
  it("extracts a supported iframe embed from luciferdonghua markup", () => {
    const html = `
      <html>
        <body>
          <iframe src="https://www.dailymotion.com/embed/video/x123abc?autoplay=1"></iframe>
        </body>
      </html>
    `;

    expect(extractVideoEmbedFromHtml(html, "luciferdonghua")).toBe(
      "https://www.dailymotion.com/embed/video/x123abc?autoplay=1"
    );
  });

  it("normalizes protocol-relative embed urls", () => {
    expect(normalizeEmbedUrl("//www.dailymotion.com/embed/video/x123abc")).toBe(
      "https://www.dailymotion.com/embed/video/x123abc"
    );
  });
});
