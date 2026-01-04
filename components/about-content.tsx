"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface Stat {
  id: string
  label: string
  value: string
}

interface AboutContentProps {
  profileImage?: string
  aboutIntro?: string
  aboutDescription?: string
  resumeUrl?: string
  stats: Stat[]
}

export function AboutContent({ profileImage, aboutIntro, aboutDescription, resumeUrl, stats }: AboutContentProps) {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">About</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-start">
            {profileImage && (
              <div className="md:col-span-5 mb-8">
                <div className="max-w-xs mx-auto">
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Deshawn Goodwyn"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}

            <div className="md:col-span-3 space-y-6">
              <p className="text-lg text-foreground leading-relaxed">{aboutIntro || "Welcome to my portfolio."}</p>
              <p className="text-muted-foreground leading-relaxed">{aboutDescription || ""}</p>
            </div>

            <div className="md:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  {stats.map((stat) => (
                    <div key={stat.id} className="flex justify-between">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="text-foreground font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
                {resumeUrl && (
                  <Button asChild className="w-full mt-4 bg-transparent" variant="outline">
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      View Portfolio PDF
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
