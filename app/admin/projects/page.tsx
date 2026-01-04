import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProjectsManager } from "@/components/admin/projects-manager"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  const { data: projects } = await supabase.from("projects").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
      </div>
      <ProjectsManager initialProjects={projects || []} />
    </div>
  )
}
