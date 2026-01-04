import { list, del } from "@vercel/blob"
import { NextResponse, type NextRequest } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list()

    const files = blobs.map((blob) => ({
      ...blob,
      filename: blob.pathname.split("/").pop() || "unknown",
    }))

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    await del(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
