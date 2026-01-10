"use client"

import { motion } from "framer-motion"
import { Github, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SchedulingButton } from "@/components/scheduling-button"

const iconMap: Record<string, any> = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Youtube,
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
}

interface ContactContentProps {
  settings: Record<string, string>
  socialLinks: SocialLink[]
}

export function ContactContent({ settings, socialLinks }: ContactContentProps) {
  const schedulingUrl = settings.scheduling_url || settings.calendly_url
  const schedulingButtonText = settings.scheduling_button_text || "Schedule a Call"

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">Contact</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-2">{settings.contact_heading || "Let's Connect"}</h3>
            <p className="text-xl text-muted-foreground mb-6">
              {settings.contact_description || "Let's connect and create something great together."}
            </p>

            <div className="flex flex-wrap justify-center gap-4 items-center">
              {schedulingUrl && <SchedulingButton url={schedulingUrl} buttonText={schedulingButtonText} />}
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-2">
                  {socialLinks.map((link) => {
                    const Icon = iconMap[link.icon] || Mail
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                        aria-label={link.platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
            <ContactForm submissionType="contact" buttonText="Send Message" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
