import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "golbat - inspect link previews"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#444",
            letterSpacing: "0.2em",
          }}
        >
          +_+
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: "#e5e5e5",
            letterSpacing: "-0.02em",
          }}
        >
          golbat
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#666",
            marginTop: 8,
          }}
        >
          inspect link previews
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
