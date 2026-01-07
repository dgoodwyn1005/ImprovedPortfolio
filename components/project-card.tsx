"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  live_url?: string | null
  project_url?: string | null
  github_url: string | null
  tech?: string[] | null
  tags?: string[] | null
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const liveUrl = project.live_url || project.project_url
  const technologies = project.tech || project.tags || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={project.image_url || "/placeholder.svg?height=400&width=600"}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=400&width=600"
            }}
          />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{project.title}</h3>
            <div className="flex gap-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`GitHub repo for ${project.title}`}
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Live demo for ${project.title}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
