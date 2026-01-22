import type { Metadata } from "next"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "next-themes"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ཐི༏ཋྀ",
    template: "%s | ཐི༏ཋྀ",
  },
  description: "inspect link previews across platforms",
  metadataBase: new URL("https://golb.at"),
  alternates: {
    canonical: "https://golb.at",
  },
  manifest: "/manifest.json",
  keywords: ["link preview", "og tags", "meta tags", "seo", "social media"],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
    title: "ཐི༏ཋྀ",
    description: "inspect link previews across platforms",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ཐི༏ཋྀ",
    description: "inspect link previews across platforms",
    images: ["/og.png"],
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
