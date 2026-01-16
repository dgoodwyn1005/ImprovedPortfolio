"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { useState } from "react"

interface Video {
  id: string
  title: string
  youtube_id?: string
  embed_id?: string
  category?: string
  section?: string
}

export function VideoShowcase({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  if (!videos || videos.length === 0) return null

  return (
    <section id="videos" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Videos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Check out some of my latest content</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => {
            const videoId = video.youtube_id || video.embed_id
            const isActive = activeVideo === video.id

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-background border">
                  {isActive ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <button onClick={() => setActiveVideo(video.id)} className="absolute inset-0 w-full h-full">
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="h-8 w-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>
                <h3 className="mt-3 font-medium text-sm">{video.title}</h3>
                {(video.category || video.section) && (
                  <p className="text-xs text-muted-foreground capitalize">{video.category || video.section}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
