import type React from "react"
// <CHANGE> Updated metadata for Spotii and dark theme
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/providers"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spotii - AI Playlist Generator",
  description: "Generate perfect playlists powered by AI. Create personalized Spotify playlists in seconds.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Spotii - AI Playlist Generator",
    description: "Generate perfect playlists powered by AI. Create personalized Spotify playlists in seconds.",
    images: ["/favicon.png"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Spotii - AI Playlist Generator",
    description: "Generate perfect playlists powered by AI. Create personalized Spotify playlists in seconds.",
    images: ["/favicon.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
