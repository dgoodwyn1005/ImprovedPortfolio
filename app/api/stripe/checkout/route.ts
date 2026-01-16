import { getStripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const stripe = await getStripe()
    const body = await request.json()
    const { priceId, productId, quantity = 1, customerEmail, successUrl, cancelUrl } = body

    if (!priceId && !productId) {
      return NextResponse.json({ error: "Price ID or Product ID is required" }, { status: 400 })
    }

    // Get the price ID if only product ID was provided
    let finalPriceId = priceId
    if (!priceId && productId) {
      const product = await stripe.products.retrieve(productId, {
        expand: ["default_price"],
      })
      if (product.default_price && typeof product.default_price === "object") {
        finalPriceId = product.default_price.id
      }
    }

    if (!finalPriceId) {
      return NextResponse.json({ error: "No price found for this product" }, { status: 400 })
    }

    const origin = request.headers.get("origin")
    const host = request.headers.get("host")
    let baseUrl: string

    if (origin && origin.startsWith("http")) {
      baseUrl = origin
    } else if (host) {
      // Default to https, use http only for localhost
      const protocol = host.includes("localhost") ? "http" : "https"
      baseUrl = `${protocol}://${host}`
    } else {
      // Fallback to the request URL
      const url = new URL(request.url)
      baseUrl = `${url.protocol}//${url.host}`
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: finalPriceId,
          quantity,
        },
      ],
      customer_email: customerEmail,
      success_url: successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/shop`,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session. Please configure Stripe in Admin." },
      { status: 500 },
    )
  }
}
