"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SchedulingButtonProps {
  url: string
  buttonText?: string
  className?: string
}

export function SchedulingButton({ url, buttonText = "Schedule a Call", className = "" }: SchedulingButtonProps) {
  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Button onClick={handleClick} variant="outline" className={className}>
      <Calendar className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  )
}
