import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowRight, Code, Bot } from "lucide-react"

export async function VenturesSection() {
  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  const ventures = companies || []

  // Default ventures if none in database
  const defaultVentures = [
    {
      id: "wyntech",
      name: "WynTech",
      slug: "wyntech",
      tagline: "Web Development & Digital Solutions",
      description: "Building modern, high-performance websites and applications that drive business growth.",
      primary_color: "#14b8a6",
      icon: "code",
    },
    {
      id: "wynora",
      name: "Wynora",
      slug: "wynora",
      tagline: "AI-Powered Innovation",
      description: "Leveraging artificial intelligence to create intelligent solutions for tomorrow's challenges.",
      primary_color: "#8b5cf6",
      icon: "bot",
    },
  ]

  const displayVentures = ventures.length > 0 ? ventures : defaultVentures

  const getIcon = (iconName: string | null, color: string) => {
    const iconClass = "w-8 h-8"
    switch (iconName?.toLowerCase()) {
      case "bot":
        return <Bot className={iconClass} style={{ color }} />
      case "code":
      default:
        return <Code className={iconClass} style={{ color }} />
    }
  }

  return (
    <section id="ventures" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">My Ventures</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore my businesses and see how I can help bring your ideas to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {displayVentures.map((venture) => (
            <Link
              key={venture.id}
              href={`/${venture.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-primary/50"
            >
              <div
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: venture.primary_color || "#14b8a6" }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl bg-background/80"
                    style={{ borderColor: venture.primary_color || "#14b8a6", borderWidth: 1 }}
                  >
                    {getIcon(venture.icon, venture.primary_color || "#14b8a6")}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{ color: venture.primary_color || "#14b8a6" }}>
                      {venture.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{venture.tagline}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">{venture.description}</p>

                <div
                  className="inline-flex items-center gap-2 font-medium transition-all group-hover:gap-3"
                  style={{ color: venture.primary_color || "#14b8a6" }}
                >
                  Explore {venture.name}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
