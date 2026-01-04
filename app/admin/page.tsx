import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Folders,
  Link2,
  DollarSign,
  Video,
  Settings,
  BarChart3,
  Building2,
  Briefcase,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  // Fetch counts
  const [projectsRes, linksRes, videosRes, companiesRes, servicesRes, testimonialsRes] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("social_links").select("id", { count: "exact" }),
    supabase.from("videos").select("id", { count: "exact" }),
    supabase.from("companies").select("id", { count: "exact" }),
    supabase.from("company_services").select("id", { count: "exact" }),
    supabase.from("company_testimonials").select("id", { count: "exact" }),
  ])

  const personalStats = [
    { name: "Projects", count: projectsRes.count || 0, icon: Folders, href: "/admin/projects" },
    { name: "Social Links", count: linksRes.count || 0, icon: Link2, href: "/admin/social-links" },
    { name: "Videos", count: videosRes.count || 0, icon: Video, href: "/admin/videos" },
  ]

  const companyStats = [
    { name: "Companies", count: companiesRes.count || 0, icon: Building2, href: "/admin/companies" },
    { name: "Services", count: servicesRes.count || 0, icon: Briefcase, href: "/admin/companies/services" },
    {
      name: "Testimonials",
      count: testimonialsRes.count || 0,
      icon: MessageSquare,
      href: "/admin/companies/testimonials",
    },
  ]

  const quickLinks = [
    {
      name: "Site Settings",
      description: "Edit hero text, about section, and more",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      name: "Pricing",
      description: "Update service rates and booking links",
      icon: DollarSign,
      href: "/admin/pricing",
    },
    {
      name: "Quick Stats",
      description: "Manage the stats shown in about section",
      icon: BarChart3,
      href: "/admin/stats",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Manage your portfolio and company content here.</p>
      </div>

      {/* Personal Portfolio Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Personal Portfolio</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {personalStats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Company Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Companies (WynTech & Wynora)</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {companyStats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.count}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <link.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{link.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
