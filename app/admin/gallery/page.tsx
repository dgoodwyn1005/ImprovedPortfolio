import { PhotoGalleryManager } from "@/components/admin/photo-gallery-manager"

export default function GalleryAdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Photo Gallery</h1>
        <p className="text-muted-foreground mt-1">Upload photos of yourself to display on your homepage</p>
      </div>

      <PhotoGalleryManager />
    </div>
  )
}
