"use client"

import { useState } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How does Spotii generate playlists?",
      answer:
        "Spotii uses advanced AI algorithms to analyze your music preferences, mood, and activity type to create perfectly curated playlists tailored to your taste.",
    },
    {
      question: "Can I integrate Spotii with Spotify?",
      answer:
        "Yes! Spotii integrates directly with your Spotify account. You can save generated playlists directly to your library with one click.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Start with our free plan and get 5 playlists per month. Upgrade to Pro anytime for unlimited playlists and advanced features.",
    },
  ]

  return (
    <section className="py-32 px-4 h-screen min-h-screen snap-start flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Frequently Asked <span className="font-[var(--font-playfair)] italic font-normal text-white/80">Questions</span>
          </h2>
          <p className="text-white/60 text-lg">answers to common questions about Spotii</p>
        </div>
        <div className="space-y-0 divide-y divide-white/10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
              >
                <h3 className="font-medium text-white/90 group-hover:text-white transition-colors text-lg">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-white/50 group-hover:text-white transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="text-white/60 leading-relaxed pr-8">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
