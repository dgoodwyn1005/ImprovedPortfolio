import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StripeSettings } from "@/components/admin/stripe-settings"

export default async function StripeAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  // Fetch current Stripe settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .in("key", ["stripe_secret_key", "stripe_publishable_key", "stripe_connected"])

  const settingsMap: Record<string, string> = {}
  settings?.forEach((s) => {
    settingsMap[s.key] = s.value
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Stripe Integration</h1>
        <p className="text-muted-foreground">Connect your Stripe account to accept payments and create invoices</p>
      </div>

      <StripeSettings settings={settingsMap} />
    </div>
  )
}
