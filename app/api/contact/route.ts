import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message, companySlug, submissionType } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        company_slug: companySlug || null,
        submission_type: submissionType || "contact",
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving submission:", error)
      return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
