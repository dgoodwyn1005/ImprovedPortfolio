import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PortfolioManager } from "@/components/admin/portfolio-manager"

export default async function PortfolioPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name")

  const { data: portfolio } = await supabase
    .from("company_portfolio")
    .select("*, companies(name)")
    .order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted-foreground mt-1">Manage work samples and case studies for each company</p>
      </div>

      <PortfolioManager initialPortfolio={portfolio || []} companies={companies || []} />
    </div>
  )
}
