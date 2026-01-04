"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Music, ShoppingCart, Check } from "lucide-react"
import { CheckoutDialog } from "@/components/checkout-dialog"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Pricing {
  id: string
  service_type: string
  title: string
  price: string
  description: string | null
  booking_url: string | null
  is_available: boolean
  stock_quantity: number | null
  sold_count: number
  features: string[]
}

interface Video {
  id: string
  title: string
  youtube_id: string
  category: string
}

export function MusicSection({ pricing, videos }: { pricing: Pricing[]; videos: Video[] }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Pricing | null>(null)

  const handleBooking = (service: Pricing) => {
    if (service.booking_url) {
      window.open(service.booking_url, "_blank")
    } else {
      setSelectedService(service)
      setCheckoutOpen(true)
    }
  }

  return (
    <section id="music" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              Gospel Keys & Sessions
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <Music className="h-6 w-6" />
                <span className="text-lg font-semibold text-foreground">Piano & Keys</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                200+ chord charts in ForScore · Specializing in gospel reharmonization and accompaniment. Available for
                worship services, studio sessions, and live performances.
              </p>

              <div className="space-y-4">
                {pricing.map((service) => {
                  const hasStock = service.stock_quantity !== null
                  const stockRemaining = hasStock ? (service.stock_quantity || 0) - service.sold_count : null
                  const isOutOfStock = hasStock && (stockRemaining || 0) <= 0

                  return (
                    <Card key={service.id} className={!service.is_available || isOutOfStock ? "opacity-60" : ""}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{service.title}</h4>
                            <p className="text-2xl font-bold text-primary mt-1">{service.price}</p>
                          </div>
                          {isOutOfStock && <Badge variant="destructive">Sold Out</Badge>}
                          {!service.is_available && !isOutOfStock && <Badge variant="secondary">Unavailable</Badge>}
                        </div>

                        {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}

                        {service.features && service.features.length > 0 && (
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}

                        {hasStock && stockRemaining !== null && stockRemaining > 0 && (
                          <p className="text-xs text-muted-foreground">Only {stockRemaining} spots remaining</p>
                        )}

                        <Button
                          className="w-full"
                          size="lg"
                          onClick={() => handleBooking(service)}
                          disabled={!service.is_available || isOutOfStock}
                        >
                          {service.booking_url ? (
                            <>
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Now
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Purchase
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="aspect-video rounded-lg overflow-hidden bg-card border border-border"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtube_id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {selectedService && (
        <CheckoutDialog
          serviceId={selectedService.id}
          serviceType="pricing"
          serviceName={selectedService.title}
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
        />
      )}
    </section>
  )
}
