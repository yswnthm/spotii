"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { Music, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          alt="Background image"
          src="/back2.jpg"
          fill
          priority
          className="object-cover blur-[2px] opacity-70"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row">
        {/* Left Side - Visual */}
        <div className="relative hidden md:flex w-1/2 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

          <div className="relative z-20 p-12 text-white space-y-6 max-w-lg backdrop-blur-sm bg-black/20 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Your personal AI DJ is waiting.
            </h1>
            <p className="text-lg text-white/80">
              Join thousands of music lovers creating the perfect playlists for every moment with Spotii.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          <div className="absolute top-8 left-8 z-30">
            <Link href="/" className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="w-full max-w-sm space-y-8 backdrop-blur-md bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
              <p className="text-sm text-white/70">
                Sign in to your account to continue
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full h-12 bg-gradient-to-r from-[#1ED760] to-[#1DB954] hover:from-[#1DB954] hover:to-[#1ED760] text-black font-bold text-base transition-all duration-300 shadow-lg shadow-[#1ED760]/20 hover:shadow-[#1ED760]/40 hover:scale-[1.02]"
                onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
              >
                <Music className="w-5 h-5 mr-2" />
                Sign in with Spotify
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/30 px-2 text-white/60 backdrop-blur-sm">
                    Secure access
                  </span>
                </div>
              </div>

              <p className="text-xs text-center text-white/60 px-8">
                By clicking continue, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
