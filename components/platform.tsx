"use client"

import DiscordPreview from "./previews/discord"
import FacebookPreview from "./previews/facebook"
import LinkedInPreview from "./previews/linkedin"
import SlackPreview from "./previews/slack"
import TelegramPreview from "./previews/telegram"
import TwitterPreview from "./previews/twitter"
import WhatsAppPreview from "./previews/whatsapp"

interface PlatformPreviewProps {
  platform: string
  metadata: any
  url: string
}

export default function Platform({
  platform,
  metadata,
  url,
}: PlatformPreviewProps) {
  return (
    <div className="preview-container">
      {platform === "telegram" ? (
        <TelegramPreview metadata={metadata} url={url} />
      ) : platform === "discord" ? (
        <DiscordPreview metadata={metadata} url={url} />
      ) : platform === "whatsapp" ? (
        <WhatsAppPreview metadata={metadata} url={url} />
      ) : platform === "slack" ? (
        <SlackPreview metadata={metadata} url={url} />
      ) : platform === "facebook" ? (
        <FacebookPreview metadata={metadata} url={url} />
      ) : platform === "twitter" ? (
        <TwitterPreview metadata={metadata} url={url} />
      ) : platform === "linkedin" ? (
        <LinkedInPreview metadata={metadata} url={url} />
      ) : null}

      <style jsx global>{`
        .preview-container > div {
          background-color: white;
          color: black;
        }
        .preview-container .text-gray-500,
        .preview-container .text-gray-600,
        .preview-container .text-gray-400 {
          color: #6b7280;
        }
        .preview-container .border-gray-200 {
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  )
}
