import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VideosManager } from "@/components/admin/videos-manager"

export default async function VideosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: videos } = await supabase.from("videos").select("*").order("section").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Videos</h1>
        <p className="text-muted-foreground mt-1">Manage YouTube videos for music and basketball sections.</p>
      </div>
      <VideosManager initialVideos={videos || []} />
    </div>
  )
}
