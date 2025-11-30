"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    // Simulate navigation or action
    setTimeout(() => {
      router.push(`/dashboard/create?prompt=${encodeURIComponent(prompt)}`)
    }, 500)
  }

  return (
    <section className="relative mx-auto h-screen min-h-screen w-full snap-start flex flex-col justify-center">


      <div className="relative flex min-h-[100dvh] w-full px-5 md:px-[50px] pt-20">
        <div className="flex w-full items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="z-10 flex w-full max-w-[826px] flex-col items-center justify-center gap-8 md:gap-[50px]">
              {/* Logo and Description */}
              <div className="flex w-full flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center gap-3 md:gap-8">
                  <div className="flex flex-col items-center gap-3 md:gap-8">
                    <h1 className="text-5xl md:text-7xl font-bold text-white">
                      <span className="font-[var(--font-playfair)] italic font-normal">Spot</span>
                      <span className="font-sans">ii</span>
                    </h1>
                  </div>
                  <p className="text-base md:text-2xl px-5 md:px-10 font-normal text-white tracking-normal opacity-80 max-w-2xl">
                    Turn your vibe into a stunning playlist. Powered by AI, zero effort required.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="max-w-md mx-auto relative group w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <form onSubmit={handleSubmit} className="relative flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                  <div className="relative flex-1">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      placeholder="Describe your vibe..."
                      className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10 text-white placeholder:text-white/50"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="rounded-3xl bg-white text-black hover:bg-white/90" disabled={!prompt || isLoading}>
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                </form>
              </div>

              <div className="pt-4 text-sm text-white/80">
                <span className="mr-2">Try example:</span>
                <button
                  onClick={() => setPrompt("Late night coding session with lo-fi beats")}
                  className="underline hover:text-white transition-colors"
                >
                  "Late night coding session"
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
