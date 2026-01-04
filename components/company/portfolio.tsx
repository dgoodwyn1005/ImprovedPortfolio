"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PortfolioItem {
  id: string
  title: string
  description: string
  client_name: string
  image_url: string
  project_url: string
  tags: string[]
}

interface Company {
  primary_color: string
}

export function CompanyPortfolio({ company, portfolio }: { company: Company; portfolio: PortfolioItem[] }) {
  if (portfolio.length === 0) {
    return null
  }

  return (
    <section id="portfolio" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Featured projects and success stories</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group cursor-pointer h-full">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {item.image_url ? (
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${company.primary_color}20` }}
                    >
                      <span className="text-4xl font-bold" style={{ color: company.primary_color }}>
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <ExternalLink className="h-8 w-8 text-white" />
                    </a>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  {item.client_name && <p className="text-sm text-muted-foreground mb-2">Client: {item.client_name}</p>}
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
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
