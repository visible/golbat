import { ImageResponse } from "next/og"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        borderRadius: "6px",
        fontSize: 16,
        color: "#e5e5e5",
      }}
    >
      ཐི༏ཋྀ
    </div>,
    {
      ...size,
    },
  )
}
