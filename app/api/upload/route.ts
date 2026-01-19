import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB for audio files
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/heic",
  "image/heif",
]
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/aac",
  "audio/m4a",
  "audio/x-m4a",
  "audio/flac",
]
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES]

function getExtension(filename: string, mimeType: string): string {
  const ext = filename.split(".").pop()?.toLowerCase()

  // Map MIME types to extensions as fallback
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/avif": "avif",
    "image/heic": "heic",
    "image/heif": "heif",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/wave": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/aac": "aac",
    "audio/m4a": "m4a",
    "audio/x-m4a": "m4a",
    "audio/flac": "flac",
  }

  return ext || mimeToExt[mimeType] || "jpg"
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const allowedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "heic", "heif"]
    const allowedAudioExtensions = ["mp3", "wav", "ogg", "aac", "m4a", "flac"]
    const allowedExtensions = [...allowedImageExtensions, ...allowedAudioExtensions]

    const isValidType = ALLOWED_TYPES.includes(file.type) || allowedExtensions.includes(fileExtension || "")

    if (!isValidType) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: Images (JPG, PNG, GIF, WebP) or Audio (MP3, WAV, OGG, AAC, M4A)` },
        { status: 400 },
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 },
      )
    }

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = getExtension(file.name, file.type)
    const sanitizedName = file.name
      .replace(/\.[^.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace special chars
      .replace(/-+/g, "-") // Remove multiple dashes
      .substring(0, 50) // Limit length
    const uniqueFilename = `${sanitizedName}-${timestamp}-${randomStr}.${extension}`

    let blob
    let retries = 3
    let lastError

    while (retries > 0) {
      try {
        const arrayBuffer = await file.arrayBuffer()

        blob = await put(uniqueFilename, arrayBuffer, {
          access: "public",
          addRandomSuffix: false,
          contentType: file.type || `image/${extension}`,
        })
        break
      } catch (err) {
        lastError = err
        retries--
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, (3 - retries) * 1000))
        }
      }
    }

    if (!blob) {
      console.error("Upload failed after retries:", lastError)
      return NextResponse.json({ error: "Upload failed after multiple attempts. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    const message = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
