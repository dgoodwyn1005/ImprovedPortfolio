"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageIcon, Check } from "lucide-react"

interface ImageFile {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImagePicker({ value, onChange, label = "Select Image" }: ImagePickerProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen])

  const loadImages = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/images")
      const data = await res.json()
      setImages(data.files || [])
    } catch (error) {
      console.error("Failed to load images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (url: string) => {
    onChange(url)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full bg-transparent">
          <ImageIcon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No images available. Upload images first in the Image Gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => handleSelect(image.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:border-primary ${
                    value === image.url ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                  {value === image.url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-primary-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <p className="text-xs text-white truncate">{image.filename}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
