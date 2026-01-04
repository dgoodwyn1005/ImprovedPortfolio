import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FAQsManager } from "@/components/admin/faqs-manager"

export default async function FAQsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name")

  const { data: faqs } = await supabase.from("company_faqs").select("*, companies(name)").order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">FAQs</h1>
        <p className="text-muted-foreground mt-1">Manage frequently asked questions for each company</p>
      </div>

      <FAQsManager initialFaqs={faqs || []} companies={companies || []} />
    </div>
  )
}
