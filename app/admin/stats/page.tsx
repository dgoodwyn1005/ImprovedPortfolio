import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsManager } from "@/components/admin/stats-manager"

export default async function StatsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: stats } = await supabase.from("quick_stats").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quick Stats</h1>
        <p className="text-muted-foreground mt-1">Manage the stats shown in your about section.</p>
      </div>
      <StatsManager initialStats={stats || []} />
    </div>
  )
}
