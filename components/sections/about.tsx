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
      aboutIntro={settings.about_intro}
      aboutDescription={settings.about_description}
      resumeUrl={settings.resume_url}
      stats={stats || []}
    />
  )
}
