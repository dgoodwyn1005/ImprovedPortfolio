import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TestimonialsManager } from "@/components/admin/testimonials-manager"

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name")

  const { data: testimonials } = await supabase
    .from("company_testimonials")
    .select("*, companies(name)")
    .order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
        <p className="text-muted-foreground mt-1">Manage client testimonials for each company</p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials || []} companies={companies || []} />
    </div>
  )
}
