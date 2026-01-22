import { ImageResponse } from "next/og"
import { readFile } from "fs/promises"
import { join } from "path"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default async function Icon() {
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
        borderRadius: "6px",
        fontSize: 16,
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
