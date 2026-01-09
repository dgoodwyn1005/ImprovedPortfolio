import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/avif"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, GIF, WebP, SVG, AVIF` },
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
    const extension = file.name.split(".").pop() || "jpg"
    const sanitizedName = file.name
      .replace(/\.[^.]+$/, "") // Remove extension
      .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace special chars
      .substring(0, 50) // Limit length
    const uniqueFilename = `${sanitizedName}-${timestamp}-${randomStr}.${extension}`

    let blob
    let retries = 3
    let lastError

    while (retries > 0) {
      try {
        blob = await put(uniqueFilename, file, {
          access: "public",
          addRandomSuffix: false, // We already added our own suffix
        })
        break
      } catch (err) {
        lastError = err
        retries--
        if (retries > 0) {
          // Wait before retry (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, (3 - retries) * 500))
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
