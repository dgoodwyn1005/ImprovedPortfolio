import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ServicesManager } from "@/components/admin/services-manager"

export default async function ServicesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: companies } = await supabase.from("companies").select("id, name, slug, primary_color").order("name")

  const { data: services } = await supabase
    .from("company_services")
    .select("*, companies(name, slug)")
    .order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Services</h1>
        <p className="text-muted-foreground mt-1">Manage services and pricing for each company</p>
      </div>

      <ServicesManager initialServices={services || []} companies={companies || []} />
    </div>
  )
}
