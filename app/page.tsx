import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"


import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import Image from "next/image"

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          alt="Background image"
          src="/back2.webp"
          fill
          priority
          className="object-cover blur-[2px] opacity-70"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Optional overlay for readability */}
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
        <Navbar />
        <Hero />
        <About />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
