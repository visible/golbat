import { ImageResponse } from "next/og"
import { readFile } from "fs/promises"
import { join } from "path"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default async function AppleIcon() {
  const fontData = await readFile(
    join(process.cwd(), "app/fonts/tibetan.ttf")
  )

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        borderRadius: "32px",
        fontSize: 80,
        fontFamily: "Tibetan",
        color: "#e5e5e5",
      }}
    >
      ཐི༏ཋྀ
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Tibetan",
          data: fontData,
          style: "normal",
        },
      ],
    },
  )
}
