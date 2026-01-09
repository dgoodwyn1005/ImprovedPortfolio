"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, GripVertical, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import { ImagePicker } from "./image-picker"

interface Photo {
  id: string
  image_url: string
  caption: string | null
  display_order: number
  is_visible: boolean
}

export function PhotoGalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ image_url: "", caption: "" })
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchPhotos()
  }, [])

  async function fetchPhotos() {
    const { data } = await supabase.from("photo_gallery").select("*").order("display_order", { ascending: true })

    if (data) setPhotos(data)
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setNewPhoto({ ...newPhoto, image_url: data.url })
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
    setUploading(false)
  }

  async function addPhoto() {
    if (!newPhoto.image_url) return

    setSaving(true)
    const { data, error } = await supabase
      .from("photo_gallery")
      .insert({
        image_url: newPhoto.image_url,
        caption: newPhoto.caption || null,
        display_order: photos.length,
        is_visible: true,
      })
      .select()
      .single()

    if (!error && data) {
      setPhotos([...photos, data])
      setNewPhoto({ image_url: "", caption: "" })
    }
    setSaving(false)
  }

  async function updatePhoto(id: string, updates: Partial<Photo>) {
    const { error } = await supabase.from("photo_gallery").update(updates).eq("id", id)

    if (!error) {
      setPhotos(photos.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    }
  }

  async function deletePhoto(id: string) {
    const { error } = await supabase.from("photo_gallery").delete().eq("id", id)

    if (!error) {
      setPhotos(photos.filter((p) => p.id !== id))
    }
  }

  async function movePhoto(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= photos.length) return

    const newPhotos = [...photos]
    const [moved] = newPhotos.splice(index, 1)
    newPhotos.splice(newIndex, 0, moved)

    // Update display_order for all affected photos
    const updates = newPhotos.map((photo, i) => ({
      ...photo,
      display_order: i,
    }))

    setPhotos(updates)

    // Save to database
    for (const photo of updates) {
      await supabase.from("photo_gallery").update({ display_order: photo.display_order }).eq("id", photo.id)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Add New Photo */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Photo
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Photo</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newPhoto.image_url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowImagePicker(true)}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Label
                    htmlFor="photo-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload New"}
                  </Label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <Label>Caption (optional)</Label>
                <Input
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  placeholder="Add a caption..."
                  className="mt-1"
                />
              </div>

              <Button onClick={addPhoto} disabled={!newPhoto.image_url || saving} className="w-full">
                {saving ? "Adding..." : "Add Photo"}
              </Button>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center">
              {newPhoto.image_url ? (
                <div className="relative w-full max-w-[200px] aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={newPhoto.image_url || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/abstract-colorful-photo.png"
                    }}
                  />
                </div>
              ) : (
                <div className="w-full max-w-[200px] aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Photos ({photos.length})</h3>

        {photos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No photos yet. Add your first photo above!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {photos.map((photo, index) => (
              <Card key={photo.id} className={!photo.is_visible ? "opacity-50" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    {/* Drag Handle / Reorder */}
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => movePhoto(index, "up")}
                        disabled={index === 0}
                      >
                        <GripVertical className="w-4 h-4 rotate-90" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => movePhoto(index, "down")}
                        disabled={index === photos.length - 1}
                      >
                        <GripVertical className="w-4 h-4 -rotate-90" />
                      </Button>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.caption || "Photo"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/abstract-colorful-photo.png"
                        }}
                      />
                    </div>

                    {/* Caption */}
                    <div className="flex-1 min-w-0">
                      <Input
                        value={photo.caption || ""}
                        onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
                        placeholder="Add caption..."
                        className="mb-2"
                      />
                      <p className="text-xs text-muted-foreground truncate">{photo.image_url}</p>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`visible-${photo.id}`} className="text-sm">
                        Visible
                      </Label>
                      <Switch
                        id={`visible-${photo.id}`}
                        checked={photo.is_visible}
                        onCheckedChange={(checked) => updatePhoto(photo.id, { is_visible: checked })}
                      />
                    </div>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ImagePicker
        open={showImagePicker}
        onOpenChange={setShowImagePicker}
        onSelect={(url) => {
          setNewPhoto({ ...newPhoto, image_url: url })
          setShowImagePicker(false)
        }}
      />
    </div>
  )
}
