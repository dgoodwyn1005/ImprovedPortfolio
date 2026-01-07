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
  aboutParagraph1?: string
  aboutParagraph2?: string
  aboutParagraph3?: string
  resumeUrl?: string
  stats: Stat[]
}

export function AboutContent({
  profileImage,
  aboutParagraph1,
  aboutParagraph2,
  aboutParagraph3,
  resumeUrl,
  stats,
}: AboutContentProps) {
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
                    alt="Profile"
                    className="w-full rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              </div>
            )}

            <div className="md:col-span-3 space-y-6">
              {aboutParagraph1 && <p className="text-lg text-foreground leading-relaxed">{aboutParagraph1}</p>}
              {aboutParagraph2 && <p className="text-muted-foreground leading-relaxed">{aboutParagraph2}</p>}
              {aboutParagraph3 && <p className="text-muted-foreground leading-relaxed">{aboutParagraph3}</p>}
              {!aboutParagraph1 && !aboutParagraph2 && !aboutParagraph3 && (
                <p className="text-lg text-foreground leading-relaxed">
                  Welcome to my portfolio. Edit this text in the Admin Settings.
                </p>
              )}
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
