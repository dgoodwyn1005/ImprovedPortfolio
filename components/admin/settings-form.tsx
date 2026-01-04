"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, Palette, ImageIcon, Upload } from "lucide-react"

interface SettingsFormProps {
  settings: Record<string, string>
}

const settingGroups = [
  {
    title: "Hero Section",
    description: "The main headline area of your portfolio",
    fields: [
      { key: "hero_title", label: "Title", type: "input" },
      { key: "hero_subtitle", label: "Subtitle", type: "input" },
      { key: "hero_description", label: "Description", type: "textarea" },
      { key: "hero_background_image", label: "Background Image URL", type: "image" }, // Added image field
    ],
  },
  {
    title: "About Section",
    description: "Tell your story",
    fields: [
      { key: "about_paragraph_1", label: "Paragraph 1", type: "textarea" },
      { key: "about_paragraph_2", label: "Paragraph 2", type: "textarea" },
      { key: "about_paragraph_3", label: "Paragraph 3", type: "textarea" },
      { key: "about_profile_image", label: "Profile Image URL", type: "image" }, // Added image field
    ],
  },
  {
    title: "Branding",
    icon: ImageIcon,
    description: "Logo and branding assets",
    fields: [
      { key: "site_logo", label: "Site Logo URL", type: "image" },
      { key: "site_favicon", label: "Favicon URL", type: "image" },
    ],
  },
  {
    title: "Music Section",
    description: "Description for your music services",
    fields: [{ key: "music_description", label: "Music Description", type: "textarea" }],
  },
  {
    title: "Basketball Section",
    description: "Description for your basketball training",
    fields: [{ key: "basketball_description", label: "Basketball Description", type: "textarea" }],
  },
  {
    title: "Contact Section",
    description: "Contact page heading",
    fields: [{ key: "contact_heading", label: "Contact Heading", type: "input" }],
  },
  {
    title: "Brand Colors",
    icon: Palette,
    description: "Customize the color scheme of your portfolio",
    fields: [
      { key: "primary_color", label: "Primary Color", type: "color" },
      { key: "secondary_color", label: "Secondary Color", type: "color" },
      { key: "accent_color", label: "Accent Color", type: "color" },
    ],
  },
]

export function SettingsForm({ settings }: SettingsFormProps) {
  const [formData, setFormData] = useState(settings)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({}) // Track upload states
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingFields((prev) => ({ ...prev, [key]: true }))

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      handleChange(key, data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploadingFields((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      // Update each setting
      for (const [key, value] of Object.entries(formData)) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })

        if (error) throw error
      }

      setMessage({ type: "success", text: "Settings saved successfully!" })
      router.refresh()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save settings" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {settingGroups.map((group) => {
        const GroupIcon = group.icon
        return (
          <Card key={group.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {GroupIcon && <GroupIcon className="h-5 w-5 text-primary" />}
                <CardTitle>{group.title}</CardTitle>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === "color" ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        id={field.key}
                        type="color"
                        value={formData[field.key] || "#14b8a6"}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData[field.key] || "#14b8a6"}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder="#14b8a6"
                      />
                    </div>
                  ) : field.type === "image" ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={formData[field.key] || ""}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder="Enter image URL or upload"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingFields[field.key]}
                          onClick={() => document.getElementById(`upload-${field.key}`)?.click()}
                        >
                          {uploadingFields[field.key] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                        <input
                          id={`upload-${field.key}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(field.key, file)
                          }}
                        />
                      </div>
                      {formData[field.key] && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={formData[field.key] || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        Save Settings
      </Button>
    </form>
  )
}
