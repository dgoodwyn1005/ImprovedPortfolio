"use client"

import { useEffect } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendlyEmbedProps {
  url: string
  buttonText?: string
  inline?: boolean
  className?: string
}

export function CalendlyEmbed({
  url,
  buttonText = "Schedule a Call",
  inline = false,
  className = "",
}: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openCalendly = () => {
    if (typeof window !== "undefined" && (window as any).Calendly) {
      ;(window as any).Calendly.initPopupWidget({ url })
    } else {
      // Fallback: open in new tab
      window.open(url, "_blank")
    }
  }

  if (inline) {
    return (
      <div
        className={`calendly-inline-widget ${className}`}
        data-url={url}
        style={{ minWidth: "320px", height: "630px" }}
      />
    )
  }

  return (
    <Button onClick={openCalendly} variant="outline" className={className}>
      <Calendar className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  )
}
