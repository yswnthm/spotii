"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { Music, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Side - Visual */}
      <div className="relative hidden md:flex w-1/2 bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-50" />

        <div className="relative z-20 p-12 text-white space-y-6 max-w-lg">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-8">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Your personal AI DJ is waiting.
          </h1>
          <p className="text-lg text-white/70">
            Join thousands of music lovers creating the perfect playlists for every moment with Spotii.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full h-12 bg-[#1ED760] hover:bg-[#1ED760]/90 text-black font-bold text-base"
              onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
            >
              <Music className="w-5 h-5 mr-2" />
              Sign in with Spotify
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Secure access
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground px-8">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
