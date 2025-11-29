"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 h-screen min-h-screen snap-start flex flex-col justify-center items-center">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-10">
          Ready to create your <br />
          <span className="font-[var(--font-playfair)] italic font-normal text-white/80">perfect playlist</span>?
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-6">
          Join thousands of music lovers discovering new sounds with Spotii. Start creating amazing playlists today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-5 h-9 text-sm font-medium transition-colors">
            Start Creating <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <a href="https://github.com/yswnthm/spotii" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full px-5 h-9 text-sm font-medium transition-colors">
              Github
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
