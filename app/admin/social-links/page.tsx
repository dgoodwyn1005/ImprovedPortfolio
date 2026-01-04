import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SocialLinksManager } from "@/components/admin/social-links-manager"

export default async function SocialLinksPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: links } = await supabase.from("social_links").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Social Links</h1>
        <p className="text-muted-foreground mt-1">Manage your social media and contact links.</p>
      </div>
      <SocialLinksManager initialLinks={links || []} />
    </div>
  )
}
