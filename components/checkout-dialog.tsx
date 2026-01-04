"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutDialog({
  serviceId,
  serviceType,
  serviceName,
  open,
  onOpenChange,
}: {
  serviceId: string
  serviceType: "pricing" | "company_service"
  serviceName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    if (!clientSecret) {
      const secret = await createCheckoutSession(serviceId, serviceType)
      setClientSecret(secret)
      return secret
    }
    return clientSecret
  }, [serviceId, serviceType, clientSecret])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase - {serviceName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}
