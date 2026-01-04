"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, BarChart3 } from "lucide-react"

interface Stat {
  id: string
  label: string
  value: string
  display_order: number
}

export function StatsManager({ initialStats }: { initialStats: Stat[] }) {
  const [stats, setStats] = useState(initialStats)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<Stat | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    label: "",
    value: "",
  })

  const resetForm = () => {
    setFormData({ label: "", value: "" })
    setEditingStat(null)
  }

  const openEditDialog = (stat: Stat) => {
    setEditingStat(stat)
    setFormData({ label: stat.label, value: stat.value })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (editingStat) {
        const { error } = await supabase
          .from("quick_stats")
          .update({
            label: formData.label,
            value: formData.value,
          })
          .eq("id", editingStat.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("quick_stats").insert({
          label: formData.label,
          value: formData.value,
          display_order: stats.length + 1,
        })

        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()

      const { data } = await supabase.from("quick_stats").select("*").order("display_order")
      if (data) setStats(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) return

    const supabase = createClient()
    const { error } = await supabase.from("quick_stats").delete().eq("id", id)

    if (!error) {
      setStats(stats.filter((s) => s.id !== id))
      router.refresh()
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
            Add Stat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStat ? "Edit Stat" : "Add New Stat"}</DialogTitle>
            <DialogDescription>Add a quick stat to your about section.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="GPA"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="4.56"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingStat ? "Update Stat" : "Add Stat"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid sm:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <CardTitle className="text-lg">{stat.value}</CardTitle>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(stat)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(stat.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {stats.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="py-8 text-center text-muted-foreground">
              No stats yet. Add your first stat above.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
