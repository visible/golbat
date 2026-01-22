import type { Metadata, Viewport } from "next"
import type React from "react"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "next-themes"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "golbat",
    template: "%s | golbat",
  },
  description: "inspect link previews across platforms",
  metadataBase: new URL("https://golb.at"),
  alternates: {
    canonical: "https://golb.at",
  },
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
    description: "inspect link previews across platforms",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "golbat",
    description: "inspect link previews across platforms",
    images: ["/og.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://golb.at/#website",
      "url": "https://golb.at",
      "name": "golbat",
      "description": "inspect link previews across platforms",
      "publisher": { "@id": "https://golb.at/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://golb.at/#organization",
      "name": "visible",
      "url": "https://github.com/visible",
    },
    {
      "@type": "WebApplication",
      "@id": "https://golb.at/#app",
      "name": "golbat",
      "url": "https://golb.at",
      "description": "A free, open-source metadata inspector for developers. Preview how your links appear on social platforms before sharing.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "Live previews for 7 platforms",
        "Metadata quality score",
        "AI-powered analysis",
        "Copy as HTML/JSON",
        "Image dimension validation",
        "Keyboard shortcuts",
        "URL history",
        "Dark mode",
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
