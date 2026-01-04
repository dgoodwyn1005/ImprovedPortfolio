import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/project-card"

export async function ProjectsSection() {
  const supabase = await createClient()
  const { data: projects } = await supabase.from("projects").select("*").eq("is_visible", true).order("display_order")

  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="py-24 sm:py-32 bg-card/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-border" />
          <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">Projects</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
