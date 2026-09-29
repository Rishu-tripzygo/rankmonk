import { ImageResponse } from "next/og";
import { OgMark } from "@/components/BrandImage";
import { site } from "@/config/site";

export const dynamic = "force-static";

// Default Open Graph / Twitter image (1200×630). Override with OG_IMAGE / TWITTER_IMAGE.
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#14151A", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OgMark size={64} />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em" }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.04em", maxWidth: 980 }}>Be the name customers find first.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#C9CBD3" }}>Local SEO and AI search visibility for businesses, brands and agencies.</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#FF8A5C" }}>Google Maps · Google Search · Apple Maps · Bing · ChatGPT · Gemini</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
