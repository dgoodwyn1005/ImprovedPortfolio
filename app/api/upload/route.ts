import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
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
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "heic", "heif"]

    const isValidType = ALLOWED_TYPES.includes(file.type) || allowedExtensions.includes(fileExtension || "")

    if (!isValidType) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG, AVIF, HEIC` },
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
