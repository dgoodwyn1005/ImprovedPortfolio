"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, Mail, Github, Linkedin, Instagram, Twitter, Youtube, Globe } from "lucide-react"

const iconOptions = [
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Github", label: "GitHub", icon: Github },
  { value: "Linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Twitter", label: "Twitter/X", icon: Twitter },
  { value: "Youtube", label: "YouTube", icon: Youtube },
  { value: "Globe", label: "Website", icon: Globe },
]

interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
  display_order: number
  is_visible: boolean
}

export function SocialLinksManager({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState(initialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    icon: "Globe",
    is_visible: true,
  })

  const resetForm = () => {
    setFormData({ name: "", url: "", icon: "Globe", is_visible: true })
    setEditingLink(null)
  }

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link)
    setFormData({
      name: link.name,
      url: link.url,
      icon: link.icon,
      is_visible: link.is_visible,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (editingLink) {
        const { error } = await supabase
          .from("social_links")
          .update({
            name: formData.name,
            url: formData.url,
            icon: formData.icon,
            is_visible: formData.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingLink.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("social_links").insert({
          name: formData.name,
          url: formData.url,
          icon: formData.icon,
          is_visible: formData.is_visible,
          display_order: links.length + 1,
        })

        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()

      const { data } = await supabase.from("social_links").select("*").order("display_order")
      if (data) setLinks(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    const supabase = createClient()
    const { error } = await supabase.from("social_links").delete().eq("id", id)

    if (!error) {
      setLinks(links.filter((l) => l.id !== id))
      router.refresh()
    }
  }

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find((o) => o.value === iconName)
    return option ? option.icon : Globe
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
            Add Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit Link" : "Add New Link"}</DialogTitle>
            <DialogDescription>Configure your social media link.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="LinkedIn"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {editingLink ? "Update Link" : "Add Link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {links.map((link) => {
          const IconComponent = getIconComponent(link.icon)
          return (
            <Card key={link.id} className={!link.is_visible ? "opacity-50" : ""}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{link.name}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">{link.url}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )
        })}
        {links.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No social links yet. Add your first link above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
