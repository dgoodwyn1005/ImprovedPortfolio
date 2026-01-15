import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const { secretKey, publishableKey } = await request.json()

    if (!secretKey || !publishableKey) {
      return NextResponse.json({ error: "Both keys are required" }, { status: 400 })
    }

    // Validate key formats
    if (!secretKey.startsWith("sk_test_") && !secretKey.startsWith("sk_live_")) {
      return NextResponse.json(
        { error: "Invalid secret key format. Must start with sk_test_ or sk_live_" },
        { status: 400 },
      )
    }

    if (!publishableKey.startsWith("pk_test_") && !publishableKey.startsWith("pk_live_")) {
      return NextResponse.json(
        { error: "Invalid publishable key format. Must start with pk_test_ or pk_live_" },
        { status: 400 },
      )
    }

    // Test the connection by fetching account info
    const stripe = new Stripe(secretKey, { apiVersion: "2024-12-18.acacia" })

    const account = await stripe.accounts.retrieve()

    return NextResponse.json({
      success: true,
      accountId: account.id,
      accountName: account.business_profile?.name || account.email || account.id,
    })
  } catch (error) {
    console.error("Stripe test error:", error)

    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to connect to Stripe" },
      { status: 500 },
    )
  }
}
