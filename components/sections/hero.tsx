"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function HeroSection() {
  const [backgroundImage, setBackgroundImage] = useState("/basketball-player-silhouette-dramatic-lighting-dar.jpg")

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("site_settings").select("key, value")

      const settings = data?.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as Record<string, string>)

      if (settings?.hero_background_image) {
        setBackgroundImage(settings.hero_background_image)
      }
    }

    loadSettings()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage || "/placeholder.svg"}
          alt="Deshawn Goodwyn"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            Deshawn Goodwyn
          </h1>
          <p className="text-primary text-sm sm:text-base font-medium tracking-widest uppercase mb-6">
            D2 Basketball Starter · Wyntech Founder · Gospel Pianist · Full-Stack Developer
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            Former Virginia HS 3-point record holder (107 + 105 threes) → 4.56 GPA → Now building web apps and playing
            keys.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ArrowDown className="h-5 w-5" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
