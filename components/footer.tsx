"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative min-h-screen h-screen border-t border-white/10 bg-black snap-start flex flex-col justify-center">
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-wrap justify-between items-start gap-10 md:gap-[40px]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <span className="text-2xl md:text-3xl text-foreground font-bold">
                <span className="font-[var(--font-playfair)] italic font-normal">Spot</span>
                <span className="font-sans">ii</span>
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-10 md:gap-[40px]">
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-foreground">Product</h2>
              <div className="flex flex-col gap-3">

                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Roadmap
                  </h3>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-foreground">Resources</h2>
              <div className="flex flex-col gap-3">
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Blog
                  </h3>
                </Link>
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Support
                  </h3>
                </Link>
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Documentation
                  </h3>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-base font-semibold text-foreground">Company</h2>
              <div className="flex flex-col gap-3">
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    About
                  </h3>
                </Link>
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Contact
                  </h3>
                </Link>
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Privacy
                  </h3>
                </Link>
                <Link href="#" className="group">
                  <h3 className="text-sm text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 transition-transform">
                    Terms
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
