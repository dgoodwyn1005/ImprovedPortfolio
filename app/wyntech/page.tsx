import { createClient } from "@/lib/supabase/server"
import { CompanyNavbar } from "@/components/company/navbar"
import { CompanyHero } from "@/components/company/hero"
import { CompanyAbout } from "@/components/company/about"
import { CompanyServices } from "@/components/company/services"
import { CompanyPortfolio } from "@/components/company/portfolio"
import { CompanyTestimonials } from "@/components/company/testimonials"
import { CompanyContact } from "@/components/company/contact"
import { CompanyFooter } from "@/components/company/footer"
import { notFound } from "next/navigation"

export const metadata = {
  title: "WynTech Solutions | Custom Software Development",
  description: "Full-service software development company building custom solutions for businesses.",
}

export default async function WynTechPage() {
  const supabase = await createClient()

  const { data: company } = await supabase.from("companies").select("*").eq("slug", "wyntech").single()

  if (!company) {
    notFound()
  }

  const { data: services } = await supabase
    .from("company_services")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: portfolio } = await supabase
    .from("company_portfolio")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: testimonials } = await supabase
    .from("company_testimonials")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: faqs } = await supabase
    .from("company_faqs")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  return (
    <main className="min-h-screen">
      <CompanyNavbar company={company} />
      <CompanyHero company={company} />
      <CompanyAbout company={company} />
      <CompanyServices company={company} services={services || []} />
      <CompanyPortfolio company={company} portfolio={portfolio || []} />
      <CompanyTestimonials company={company} testimonials={testimonials || []} />
      <CompanyContact company={company} faqs={faqs || []} />
      <CompanyFooter company={company} />
    </main>
  )
}
