import { Suspense } from "react"
import { ImageManager } from "@/components/admin/image-manager"

export default function ImagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Image Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage images for your portfolio. Use these images throughout your site.
        </p>
      </div>

      <Suspense fallback={<div>Loading images...</div>}>
        <ImageManager />
      </Suspense>
    </div>
  )
}
