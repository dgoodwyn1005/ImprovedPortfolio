"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, Loader2, Music, Trophy, X, ShoppingCart } from "lucide-react"

interface Pricing {
  id: string
  service_type: string
  title: string
  price: string
  description: string | null
  booking_url: string | null
  stripe_price_id: string | null
  is_available: boolean
  stock_quantity: number | null
  sold_count: number
  features: string[]
}

export function PricingManager({ initialPricing }: { initialPricing: Pricing[] }) {
  const [pricing, setPricing] = useState(initialPricing)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ id: string; type: "success" | "error"; text: string } | null>(null)
  const [newFeature, setNewFeature] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const handleUpdate = async (item: Pricing) => {
    setIsLoading(item.id)
    setMessage(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("pricing")
        .update({
          title: item.title,
          price: item.price,
          description: item.description,
          booking_url: item.booking_url,
          stripe_price_id: item.stripe_price_id,
          is_available: item.is_available,
          stock_quantity: item.stock_quantity,
          features: item.features,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id)

      if (error) throw error

      setMessage({ id: item.id, type: "success", text: "Saved!" })
      router.refresh()
    } catch (err) {
      setMessage({ id: item.id, type: "error", text: err instanceof Error ? err.message : "Failed to save" })
    } finally {
      setIsLoading(null)
    }
  }

  const updateItem = (id: string, field: keyof Pricing, value: any) => {
    setPricing(pricing.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const addFeature = (id: string) => {
    const feature = newFeature[id]?.trim()
    if (feature) {
      updateItem(id, "features", [...(pricing.find((p) => p.id === id)?.features || []), feature])
      setNewFeature({ ...newFeature, [id]: "" })
    }
  }

  const removeFeature = (id: string, index: number) => {
    const item = pricing.find((p) => p.id === id)
    if (item) {
      updateItem(
        id,
        "features",
        item.features.filter((_, i) => i !== index),
      )
    }
  }

  const getIcon = (type: string) => {
    return type === "music" ? Music : Trophy
  }

  return (
    <div className="grid gap-6">
      {pricing.map((item) => {
        const Icon = getIcon(item.service_type)
        const hasStock = item.stock_quantity !== null
        const stockRemaining = hasStock ? (item.stock_quantity || 0) - item.sold_count : null

        return (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="capitalize">{item.service_type} Services</CardTitle>
                    <div className="flex gap-2 mt-1">
                      {!item.is_available && <Badge variant="destructive">Unavailable</Badge>}
                      {hasStock && stockRemaining !== null && (
                        <Badge variant={stockRemaining > 5 ? "default" : "destructive"}>
                          {stockRemaining} remaining
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {item.stripe_price_id && (
                  <Badge variant="outline" className="gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    Stripe Enabled
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                    placeholder="1-on-1 Training"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    placeholder="$75/hour or Starting at $500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature[item.id] || ""}
                    onChange={(e) => setNewFeature({ ...newFeature, [item.id]: e.target.value })}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature(item.id))}
                  />
                  <Button type="button" onClick={() => addFeature(item.id)} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(item.features || []).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {feature}
                      <button type="button" onClick={() => removeFeature(item.id, index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Booking URL (Calendly, etc.)</Label>
                <Input
                  value={item.booking_url || ""}
                  onChange={(e) => updateItem(item.id, "booking_url", e.target.value)}
                  placeholder="https://calendly.com/yourlink"
                />
              </div>

              <div className="space-y-2">
                <Label>Stripe Price ID (optional)</Label>
                <Input
                  value={item.stripe_price_id || ""}
                  onChange={(e) => updateItem(item.id, "stripe_price_id", e.target.value)}
                  placeholder="price_xxxxxxxxxxxxx"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock Quantity (optional)</Label>
                  <Input
                    type="number"
                    value={item.stock_quantity ?? ""}
                    onChange={(e) =>
                      updateItem(item.id, "stock_quantity", e.target.value ? Number.parseInt(e.target.value) : null)
                    }
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sold Count</Label>
                  <Input type="number" value={item.sold_count} disabled className="bg-muted" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={item.is_available}
                  onCheckedChange={(checked) => updateItem(item.id, "is_available", checked)}
                />
                <Label>Available for Purchase</Label>
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={() => handleUpdate(item)} disabled={isLoading === item.id}>
                  {isLoading === item.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                {message?.id === item.id && (
                  <span className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
                    {message.text}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
      {pricing.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pricing data found. Run the seed script to add initial pricing.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
