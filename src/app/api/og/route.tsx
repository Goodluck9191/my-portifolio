import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? "Goodluck Johnson";
    const subtitle =
      searchParams.get("category") ?? "Full-Stack Developer & System Architect";

    const gradientId = "og-gradient";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #08080E 0%, #16162A 50%, #0F0F1A 100%)",
            padding: "60px 80px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "60px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 512 512">
              <rect width="512" height="512" rx="80" fill="#0F0F1A"/>
              <text x="256" y="296" font-family="system-ui" font-size="220" font-weight="800" fill="#6C63FF" text-anchor="middle" dominant-baseline="central" letter-spacing="-8">GP</text>
            </svg>
            <span
              style={{
                fontSize: "20px",
                color: "#EEEEFF",
                fontFamily: "system-ui",
                fontWeight: 600,
              }}
            >
              Goodluck Prosper
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              maxWidth: "900px",
            }}
          >
            <span
              style={{
                fontSize: subtitle ? "20px" : "0",
                color: "#6C63FF",
                fontFamily: "system-ui",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                opacity: 0.9,
                marginBottom: "8px",
              }}
            >
              {subtitle}
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "system-ui",
                letterSpacing: "-0.02em",
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              {title}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#7A7A9A",
                fontFamily: "system-ui",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              goodluckprosper.vercel.app
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, immutable",
        },
      }
    );
  } catch (err) {
    console.error("OG image generation error:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
