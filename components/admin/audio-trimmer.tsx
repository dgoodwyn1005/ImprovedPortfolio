"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Pause, Scissors, Upload, X } from "lucide-react"

interface AudioTrimmerProps {
  onTrimComplete: (blob: Blob, duration: string) => void
  onCancel: () => void
  maxDuration?: number // in seconds, default 30
}

export function AudioTrimmer({ onTrimComplete, onCancel, maxDuration = 30 }: AudioTrimmerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(maxDuration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationRef = useRef<number | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [audioUrl])

  // Handle file selection
  const handleFileSelect = async (selectedFile: File) => {
    setError(null)
    setFile(selectedFile)
    
    // Create object URL for playback
    const url = URL.createObjectURL(selectedFile)
    setAudioUrl(url)
    
    // Create audio element to get duration
    const audio = new Audio(url)
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
      setEndTime(Math.min(audio.duration, startTime + maxDuration))
    })
    audioRef.current = audio
    
    // Draw waveform
    try {
      await drawWaveform(selectedFile)
    } catch (err) {
      console.error("Waveform error:", err)
    }
  }

  // Draw waveform visualization
  const drawWaveform = async (audioFile: File) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    try {
      audioContextRef.current = new AudioContext()
      const arrayBuffer = await audioFile.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      
      const data = audioBuffer.getChannelData(0)
      const step = Math.ceil(data.length / canvas.width)
      const amp = canvas.height / 2
      
      ctx.fillStyle = "hsl(var(--muted))"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.beginPath()
      ctx.moveTo(0, amp)
      ctx.strokeStyle = "hsl(var(--primary))"
      ctx.lineWidth = 1
      
      for (let i = 0; i < canvas.width; i++) {
        let min = 1.0
        let max = -1.0
        for (let j = 0; j < step; j++) {
          const datum = data[i * step + j]
          if (datum < min) min = datum
          if (datum > max) max = datum
        }
        ctx.lineTo(i, (1 + min) * amp)
        ctx.lineTo(i, (1 + max) * amp)
      }
      
      ctx.stroke()
    } catch (err) {
      console.error("Error drawing waveform:", err)
    }
  }

  // Update selection overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !duration) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Redraw waveform with selection
    if (file) {
      drawWaveform(file).then(() => {
        // Draw selection overlay
        const startX = (startTime / duration) * canvas.width
        const endX = (endTime / duration) * canvas.width
        
        // Dim areas outside selection
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, startX, canvas.height)
        ctx.fillRect(endX, 0, canvas.width - endX, canvas.height)
        
        // Draw selection borders
        ctx.strokeStyle = "hsl(var(--primary))"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(startX, 0)
        ctx.lineTo(startX, canvas.height)
        ctx.moveTo(endX, 0)
        ctx.lineTo(endX, canvas.height)
        ctx.stroke()
        
        // Draw current time indicator
        if (isPlaying || currentTime > 0) {
          const currentX = (currentTime / duration) * canvas.width
          ctx.strokeStyle = "hsl(var(--destructive))"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(currentX, 0)
          ctx.lineTo(currentX, canvas.height)
          ctx.stroke()
        }
      })
    }
  }, [startTime, endTime, duration, file, currentTime, isPlaying])

  // Playback controls
  const togglePlayback = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      setIsPlaying(false)
    } else {
      audioRef.current.currentTime = startTime
      audioRef.current.play()
      setIsPlaying(true)
      
      // Update current time display
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
          
          // Stop at end time
          if (audioRef.current.currentTime >= endTime) {
            audioRef.current.pause()
            audioRef.current.currentTime = startTime
            setIsPlaying(false)
            setCurrentTime(startTime)
            return
          }
          
          animationRef.current = requestAnimationFrame(updateTime)
        }
      }
      updateTime()
    }
  }

  // Handle range change
  const handleRangeChange = (values: number[]) => {
    const [start, end] = values
    
    // Enforce max duration
    if (end - start > maxDuration) {
      if (start !== startTime) {
        // Start moved, adjust end
        setStartTime(start)
        setEndTime(Math.min(start + maxDuration, duration))
      } else {
        // End moved, adjust start
        setEndTime(end)
        setStartTime(Math.max(end - maxDuration, 0))
      }
    } else {
      setStartTime(start)
      setEndTime(end)
    }
  }

  // Trim and export audio
  const handleTrim = async () => {
    if (!file || !audioContextRef.current) {
      setError("Please select an audio file first")
      return
    }
    
    setProcessing(true)
    setError(null)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      const sampleRate = audioBuffer.sampleRate
      const startSample = Math.floor(startTime * sampleRate)
      const endSample = Math.floor(endTime * sampleRate)
      const trimmedLength = endSample - startSample
      
      // Create new buffer with trimmed audio
      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        trimmedLength,
        sampleRate
      )
      
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const sourceData = audioBuffer.getChannelData(channel)
        const destData = trimmedBuffer.getChannelData(channel)
        for (let i = 0; i < trimmedLength; i++) {
          destData[i] = sourceData[startSample + i]
        }
      }
      
      // Convert to WAV blob
      const wavBlob = audioBufferToWav(trimmedBuffer)
      
      // Calculate duration string
      const trimmedDuration = endTime - startTime
      const minutes = Math.floor(trimmedDuration / 60)
      const seconds = Math.floor(trimmedDuration % 60)
      const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`
      
      onTrimComplete(wavBlob, durationStr)
      audioContext.close()
    } catch (err) {
      console.error("Trim error:", err)
      setError("Failed to trim audio. Please try again.")
    }
    
    setProcessing(false)
  }

  // Convert AudioBuffer to WAV Blob
  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1 // PCM
    const bitDepth = 16
    
    const bytesPerSample = bitDepth / 8
    const blockAlign = numChannels * bytesPerSample
    
    const dataLength = buffer.length * blockAlign
    const bufferLength = 44 + dataLength
    
    const arrayBuffer = new ArrayBuffer(bufferLength)
    const view = new DataView(arrayBuffer)
    
    // WAV header
    writeString(view, 0, "RIFF")
    view.setUint32(4, 36 + dataLength, true)
    writeString(view, 8, "WAVE")
    writeString(view, 12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, format, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)
    writeString(view, 36, "data")
    view.setUint32(40, dataLength, true)
    
    // Write audio data
    const offset = 44
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(offset + (i * blockAlign) + (channel * bytesPerSample), intSample, true)
      }
    }
    
    return new Blob([arrayBuffer], { type: "audio/wav" })
  }

  function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const clipDuration = endTime - startTime

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Audio Trimmer</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Upload an audio file and select a {maxDuration}-second (or shorter) clip to use.
      </p>

      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Click to upload audio file</span>
          <span className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG, AAC, M4A, FLAC</span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{file.name}</span>
            <span className="text-muted-foreground">({formatTime(duration)} total)</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFile(null)
                setAudioUrl(null)
                setDuration(0)
                setStartTime(0)
                setEndTime(maxDuration)
              }}
            >
              Change
            </Button>
          </div>

          {/* Waveform */}
          <canvas
            ref={canvasRef}
            width={600}
            height={80}
            className="w-full h-20 rounded border"
          />

          {/* Range slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Start: {formatTime(startTime)}</span>
              <span className={clipDuration > maxDuration ? "text-destructive" : "text-primary"}>
                Clip: {formatTime(clipDuration)} / {maxDuration}s max
              </span>
              <span>End: {formatTime(endTime)}</span>
            </div>
            <Slider
              value={[startTime, endTime]}
              min={0}
              max={duration}
              step={0.1}
              onValueChange={handleRangeChange}
              className="w-full"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={togglePlayback}>
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "Pause" : "Preview Selection"}
            </Button>
            <Button onClick={handleTrim} disabled={processing || clipDuration > maxDuration}>
              <Scissors className="w-4 h-4 mr-2" />
              {processing ? "Processing..." : "Trim & Use"}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  )
}
