"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, GripVertical, Upload } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  image_url: string | null
  live_url: string | null
  github_url: string | null
  display_order: number
  is_visible: boolean
}

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: "",
    image_url: "",
    live_url: "",
    github_url: "",
    is_visible: true,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech: "",
      image_url: "",
      live_url: "",
      github_url: "",
      is_visible: true,
    })
    setEditingProject(null)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      image_url: project.image_url || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      is_visible: project.is_visible,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const techArray = formData.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update({
            title: formData.title,
            description: formData.description,
            tech: techArray,
            image_url: formData.image_url || null,
            live_url: formData.live_url || null,
            github_url: formData.github_url || null,
            is_visible: formData.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProject.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("projects").insert({
          title: formData.title,
          description: formData.description,
          tech: techArray,
          image_url: formData.image_url || null,
          live_url: formData.live_url || null,
          github_url: formData.github_url || null,
          is_visible: formData.is_visible,
          display_order: projects.length + 1,
        })

        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()

      // Refetch projects
      const { data } = await supabase.from("projects").select("*").order("display_order")
      if (data) setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    const supabase = createClient()
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (!error) {
      setProjects(projects.filter((p) => p.id !== id))
      router.refresh()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      setFormData({ ...formData, image_url: data.url })
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setIsUploadingImage(false)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>Fill in the project details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech">Technologies (comma-separated)</Label>
              <Input
                id="tech"
                value={formData.tech}
                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                placeholder="Next.js, TypeScript, Tailwind"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Project Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Enter URL or upload image"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingImage}
                    onClick={() => document.getElementById("project-image-upload")?.click()}
                  >
                    {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                  <input
                    id="project-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                {formData.image_url && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Project preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="live_url">Live URL</Label>
                <Input
                  id="live_url"
                  value={formData.live_url}
                  onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
              />
              <Label htmlFor="is_visible">Visible on site</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProject ? "Update Project" : "Add Project"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className={!project.is_visible ? "opacity-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <div>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {projects.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No projects yet. Add your first project above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
