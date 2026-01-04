"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Testimonial {
  id: string
  client_name: string
  client_role: string
  client_company: string
  content: string
  rating: number
  image_url: string
}

interface Company {
  primary_color: string
}

export function CompanyTestimonials({ company, testimonials }: { company: Company; testimonials: Testimonial[] }) {
  if (testimonials.length === 0) {
    return null
  }

  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Hear from our satisfied customers</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 mb-4" style={{ color: company.primary_color }} />
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url || "/placeholder.svg"}
                        alt={testimonial.client_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: company.primary_color }}
                      >
                        {testimonial.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.client_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.client_role}
                        {testimonial.client_company ? `, ${testimonial.client_company}` : ""}
                      </p>
                    </div>
                  </div>
                  {testimonial.rating > 0 && (
                    <div className="flex gap-1 mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4"
                          fill={i < testimonial.rating ? company.primary_color : "transparent"}
                          style={{ color: company.primary_color }}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
