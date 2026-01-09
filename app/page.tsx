import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { ProjectsSection } from "@/components/sections/projects"
import { VenturesSection } from "@/components/sections/ventures"
import { PhotoGallerySection } from "@/components/sections/photo-gallery"
import { ContactSection } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()

  const { data: pricing } = await supabase.from("pricing").select("*").eq("is_available", true).order("display_order")

  const { data: videos } = await supabase.from("videos").select("*").eq("is_visible", true).order("display_order")

  const musicPricing = pricing?.filter((p) => p.service_type === "music") || []
  const basketballPricing = pricing?.filter((p) => p.service_type === "basketball") || []
  const musicVideos = videos?.filter((v) => v.category === "music") || []
  const basketballVideos = videos?.filter((v) => v.category === "basketball") || []

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PhotoGallerySection />
      <VenturesSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
