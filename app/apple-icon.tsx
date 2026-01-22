import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  const baseDots = [
    { x: 6, y: 4, o: 0.5 },
    { x: 26, y: 4, o: 0.5 },
    { x: 8, y: 6, o: 0.7 },
    { x: 24, y: 6, o: 0.7 },
    { x: 4, y: 8, o: 0.6 },
    { x: 10, y: 8, o: 1 },
    { x: 22, y: 8, o: 1 },
    { x: 28, y: 8, o: 0.6 },
    { x: 3, y: 11, o: 0.8 },
    { x: 7, y: 11, o: 1 },
    { x: 11, y: 11, o: 0.9 },
    { x: 21, y: 11, o: 0.9 },
    { x: 25, y: 11, o: 1 },
    { x: 29, y: 11, o: 0.8 },
    { x: 4, y: 14, o: 1 },
    { x: 8, y: 14, o: 0.8 },
    { x: 12, y: 14, o: 1 },
    { x: 16, y: 14, o: 1 },
    { x: 20, y: 14, o: 1 },
    { x: 24, y: 14, o: 0.8 },
    { x: 28, y: 14, o: 1 },
    { x: 14, y: 12, o: 0.6 },
    { x: 18, y: 12, o: 0.6 },
    { x: 16, y: 16, o: 1 },
    { x: 6, y: 17, o: 0.9 },
    { x: 10, y: 17, o: 0.7 },
    { x: 22, y: 17, o: 0.7 },
    { x: 26, y: 17, o: 0.9 },
    { x: 16, y: 18, o: 1 },
    { x: 8, y: 20, o: 1 },
    { x: 12, y: 20, o: 0.6 },
    { x: 20, y: 20, o: 0.6 },
    { x: 24, y: 20, o: 1 },
    { x: 16, y: 20, o: 0.8 },
    { x: 10, y: 23, o: 0.8 },
    { x: 16, y: 22, o: 1 },
    { x: 22, y: 23, o: 0.8 },
    { x: 12, y: 25, o: 0.5 },
    { x: 16, y: 24, o: 0.7 },
    { x: 20, y: 25, o: 0.5 },
    { x: 14, y: 27, o: 0.4 },
    { x: 18, y: 27, o: 0.4 },
  ]

  const scale = 5.2
  const offset = 8
  const dots = baseDots.map((d) => ({
    x: offset + d.x * scale,
    y: offset + d.y * scale,
    o: d.o,
  }))

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f7f4",
        borderRadius: "32px",
        position: "relative",
      }}
    >
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x - 6,
            top: dot.y - 6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#1a1a1a",
            opacity: dot.o,
          }}
        />
      ))}
    </div>,
    {
      ...size,
    },
  )
}
