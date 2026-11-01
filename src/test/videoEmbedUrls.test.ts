import { describe, expect, it } from "vitest";
import {
  findAllowedIframeUrl,
  isAllowedEmbedUrl,
} from "../../supabase/functions/fetch-video-source/videoEmbedUrls";

describe("video source iframe extraction", () => {
  it("rejects WordPress self-embed frames rather than treating them as video players", () => {
    expect(isAllowedEmbedUrl(
      "https://luciferdonghua.in/renegade-immortal-xian-ni-episode-164-lucifer-donghua/embed/#?secret=abc",
    )).toBe(false);
  });

  it("continues past the WordPress wrapper iframe to find the actual video host", () => {
    const html = `
      <iframe src="https://luciferdonghua.in/episode-164/embed/#?secret=abc"></iframe>
      <iframe src="https://www.dailymotion.com/embed/video/x123abc"></iframe>
    `;

    expect(findAllowedIframeUrl(html)).toBe("https://www.dailymotion.com/embed/video/x123abc");
  });

  it("does not allow generic path words to masquerade as an embed host", () => {
    expect(isAllowedEmbedUrl("https://luciferdonghua.in/episode-164/embed/")).toBe(false);
    expect(isAllowedEmbedUrl("https://unrelated.example/video/player/episode-164")).toBe(false);
  });
});
