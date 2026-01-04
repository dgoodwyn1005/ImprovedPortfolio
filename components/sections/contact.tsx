import { Github, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ContactContent } from "@/components/contact-content"

const iconMap: Record<string, any> = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Youtube,
}

export async function ContactSection() {
  const supabase = await createClient()

  const { data: settingsData } = await supabase.from("site_settings").select("key, value")
  const settings =
    settingsData?.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as Record<string, string>) || {}

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_visible", true)
    .order("display_order")

  return <ContactContent settings={settings} socialLinks={socialLinks || []} />
}
