"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const router = useRouter()

  const examplePrompts = [
    "Late night coding session with lo-fi beats",
    "Energetic Bollywood workout mix",
    "Romantic Telugu songs for a rainy evening",
    "Chill indie vibes for studying",
    "High energy EDM for dancing",
    "Soulful Malayalam melodies for relaxation"
  ]

  // Auto-rotate examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExampleIndex((prev) => (prev + 1) % examplePrompts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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
              <div className="max-w-md mx-auto w-full">
                <form onSubmit={handleSubmit} className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                  <div className="relative flex-1">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      placeholder="Describe your vibe..."
                      className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent h-10 text-white placeholder:text-white/40"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="rounded-md bg-white/90 text-black hover:bg-white" disabled={!prompt || isLoading}>
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                </form>
              </div>

              <div className="pt-4 text-sm text-white/80 flex items-center justify-center gap-2">
                <span>Try example:</span>
                <div className="relative h-6 overflow-hidden inline-block min-w-[280px]">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={example}
                      onClick={() => {
                        router.push(`/dashboard/create?prompt=${encodeURIComponent(example)}`)
                      }}
                      className="absolute left-0 underline hover:text-white transition-all duration-500 ease-in-out whitespace-nowrap"
                      style={{
                        opacity: currentExampleIndex === index ? 1 : 0,
                        transform: currentExampleIndex === index
                          ? 'translateY(0)'
                          : currentExampleIndex > index || (currentExampleIndex === 0 && index === examplePrompts.length - 1)
                            ? 'translateY(-100%)'
                            : 'translateY(100%)',
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
