import type { Metadata } from "next"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "next-themes"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "golbat",
    template: "%s | golbat",
  },
  description: "Inspect link previews across platforms",
  metadataBase: new URL("https://golb.at"),
  manifest: "/manifest.json",
  keywords: ["link preview", "og tags", "meta tags", "seo", "social media"],
  authors: [{ name: "visible" }],
  creator: "visible",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    siteName: "golbat",
    title: "golbat",
    description: "Inspect link previews across platforms",
  },
  twitter: {
    card: "summary_large_image",
    title: "golbat",
    description: "Inspect link previews across platforms",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
