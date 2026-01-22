"use client"

import { nocache } from "@/lib/cache"

interface PlatformPreviewProps {
  metadata: any
  url: string
}

export default function TwitterPreview({
  metadata,
  url,
}: PlatformPreviewProps) {
  const title =
    metadata.twitterTitle || metadata.ogTitle || metadata.title || url
  const description =
    metadata.twitterDescription ||
    metadata.ogDescription ||
    metadata.description ||
    ""
  const image = metadata.twitterImage || metadata.ogImage || ""
  const domain = url.replace(/^https?:\/\//, "").split("/")[0]

  const cardType =
    metadata.twitterCard === "summary_large_image" || image
      ? "summary_large_image"
      : "summary"

  if (cardType === "summary_large_image") {
    return (
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 dark:border-[#2f3336] dark:bg-[#16181c] dark:text-[#e7e9ea]">
        {image && (
          <div className="relative">
            <img
              src={nocache(image)}
              alt={title}
              className="aspect-[120/63] w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
            <div className="absolute bottom-3 left-3 max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-black bg-opacity-75 px-2 text-base text-white">
              {title}
            </div>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 dark:border-[#2f3336] dark:bg-[#16181c] dark:text-[#e7e9ea]">
        <div className="flex h-[131px]">
          {image ? (
            <div className="shrink-0 border-r border-gray-200 dark:border-[#2f3336]">
              <img
                src={nocache(image)}
                alt={title}
                className="h-full w-[130px] object-cover bg-white dark:bg-[#16181c]"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          ) : metadata.favicon ? (
            <div className="flex shrink-0 items-center justify-center w-[130px] border-r border-gray-200 bg-gray-50 dark:border-[#2f3336] dark:bg-[#16181c]">
              <img
                src={nocache(metadata.favicon)}
                alt={title}
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                  const container = e.currentTarget.parentElement
                  if (container) {
                    const svg = document.createElementNS(
                      "http://www.w3.org/2000/svg",
                      "svg",
                    )
                    svg.setAttribute("viewBox", "0 0 24 24")
                    svg.setAttribute("aria-hidden", "true")
                    svg.setAttribute(
                      "class",
                      "h-8 text-gray-400 dark:text-[#71767b]",
                    )
                    svg.innerHTML =
                      '<g><path d="M1.998 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.12 2.5 2.5v13c0 1.38-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.276 0-.5.22-.5.5v13c0 .28.224.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zM6 7h6v6H6V7zm2 2v2h2V9H8zm10 0h-4V7h4v2zm0 4h-4v-2h4v2zm-.002 4h-12v-2h12v2z" fill="currentColor"></path></g>'
                    container.appendChild(svg)
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex shrink-0 items-center justify-center w-[130px] border-r border-gray-200 bg-gray-50 dark:border-[#2f3336] dark:bg-[#16181c]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-8 text-gray-400 dark:text-[#71767b]"
              >
                <g>
                  <path
                    d="M1.998 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.12 2.5 2.5v13c0 1.38-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.276 0-.5.22-.5.5v13c0 .28.224.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zM6 7h6v6H6V7zm2 2v2h2V9H8zm10 0h-4V7h4v2zm0 4h-4v-2h4v2zm-.002 4h-12v-2h12v2z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center gap-0.5 p-3">
            <div className="text-xs text-gray-500 dark:text-[#71767b]">
              {domain}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-2 text-base font-medium text-gray-900 dark:text-[#e7e9ea]">
              {title}
            </div>
            <div className="line-clamp-2 text-xs text-gray-500 dark:text-[#71767b]">
              {description}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
