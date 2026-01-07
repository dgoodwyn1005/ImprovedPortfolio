import { createClient } from "@/lib/supabase/server"
import { AboutContent } from "@/components/about-content"

export async function AboutSection() {
  const supabase = await createClient()

  const { data: settingsData } = await supabase.from("site_settings").select("key, value")
  const settings =
    settingsData?.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {} as Record<string, string>) || {}

  const { data: stats } = await supabase.from("quick_stats").select("*")

  return (
    <AboutContent
      profileImage={settings.about_profile_image}
      aboutParagraph1={settings.about_paragraph_1}
      aboutParagraph2={settings.about_paragraph_2}
      aboutParagraph3={settings.about_paragraph_3}
      resumeUrl={settings.resume_url}
      stats={stats || []}
    />
  )
}
