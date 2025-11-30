"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[826px] px-4">
      <div className="flex w-full flex-row items-center justify-between gap-3 rounded-full border border-white/20 px-3 py-2.5 backdrop-blur-lg bg-white/10 transition-colors duration-1000 md:gap-4 md:px-3.5 md:py-3">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity ml-2.5 md:ml-3">
          <span className="text-lg md:text-xl text-white font-bold">
            <span className="font-[var(--font-playfair)] italic font-normal">Spot</span>
            <span className="font-sans">ii</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/#about" className="text-sm text-white/70 hover:text-white transition-colors">
            About
          </Link>
          <Link href="https://x.com/yswnth" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
            Twitter/X
          </Link>
          <Link href="https://github.com/yswnthm" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
            Github
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-white/70 hover:text-white hover:bg-white/10 rounded-full">
              Sign in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full px-4">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
