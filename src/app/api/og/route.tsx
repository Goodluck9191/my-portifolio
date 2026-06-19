import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? "Goodluck Johnson";
    const subtitle =
      searchParams.get("subtitle") ?? "Full-Stack Developer & System Architect";

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
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
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
            <span
              style={{
                fontSize: "28px",
                color: "#6C63FF",
                fontFamily: "system-ui",
                fontWeight: 500,
                textAlign: "center",
                opacity: 0.9,
              }}
            >
              {subtitle}
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
                color: "#6C63FF",
                fontFamily: "system-ui",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              goodluckjohnson.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("OG image generation error:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
