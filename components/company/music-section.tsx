"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Music, Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AudioClip {
  id: string
  title: string
  artist: string | null
  description: string | null
  audio_url: string
  cover_image: string | null
  duration: string | null
  genre: string | null
}

interface MusicSectionProps {
  clips: AudioClip[]
  companyName?: string
}

export function MusicSection({ clips, companyName = "Our" }: MusicSectionProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  function togglePlay(clipId: string, audioUrl: string) {
    if (playingId === clipId) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      audioRef.current.onended = () => {
        setPlayingId(null)
        setProgress((prev) => ({ ...prev, [clipId]: 0 }))
      }
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
          setProgress((prev) => ({ ...prev, [clipId]: pct }))
        }
      }
      setPlayingId(clipId)
    }
  }

  if (clips.length === 0) return null

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">{companyName} Music</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Listen to our latest tracks and productions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative aspect-square">
                  {clip.cover_image ? (
                    <img
                      src={clip.cover_image || "/placeholder.svg"}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Music className="w-16 h-16 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => togglePlay(clip.id, clip.audio_url)}
                      className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      {playingId === clip.id ? (
                        <Pause className="w-8 h-8 text-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-primary ml-1" />
                      )}
                    </button>
                  </div>
                  {playingId === clip.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div
                        className="h-full bg-primary transition-all duration-100"
                        style={{ width: `${progress[clip.id] || 0}%` }}
                      />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{clip.title}</h3>
                  {clip.artist && (
                    <p className="text-sm text-muted-foreground truncate">{clip.artist}</p>
                  )}
                  {clip.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{clip.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {clip.genre && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {clip.genre}
                      </span>
                    )}
                    {clip.duration && <span>{clip.duration}</span>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
