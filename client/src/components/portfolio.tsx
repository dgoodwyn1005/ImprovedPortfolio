import { useQuery } from "@tanstack/react-query";
import type { PortfolioProject } from "@shared/schema";

export default function Portfolio() {
  const { data: projects = [], isLoading, error } = useQuery<PortfolioProject[]>({
    queryKey: ["/api/portfolio"],
  });

  // Sample data for when API is not available
  const sampleProjects: PortfolioProject[] = [
    {
      id: "1",
      title: "Client Website Redesign",
      description: "Complete website redesign for a local business, improving user experience and increasing conversion rates by 40%.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
      year: "2024",
      featured: true,
      clientResults: "+40% Conversion",
      websiteUrl: "https://example.com",
      order: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "E-Learning Platform",
      description: "Custom e-learning platform with video streaming, progress tracking, and interactive quizzes for an educational institution.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
      year: "2024",
      featured: false,
      clientResults: "500+ Students",
      websiteUrl: "https://example.com",
      order: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Restaurant Management System",
      description: "Full-featured restaurant management system with online ordering, inventory tracking, and staff management capabilities.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      technologies: ["Vue.js", "Express", "MongoDB", "Stripe"],
      year: "2023",
      featured: true,
      clientResults: "25% Efficiency Gain",
      websiteUrl: "https://example.com",
      order: "3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Use sample data if API fails or returns empty
  const displayProjects = error || projects.length === 0 ? sampleProjects : projects;

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gold-400 mb-4">Client Portfolio</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">Client Portfolio</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Successful projects delivered for clients across various industries
          </p>
        </div>

        {displayProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-800 rounded-2xl p-12 max-w-md mx-auto">
              <i className="fas fa-folder-open text-6xl text-gray-600 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">No Projects Yet</h3>
              <p className="text-gray-400">
                Portfolio projects will appear here once they're added through the admin panel.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                          <rect width="400" height="300" fill="#374151"/>
                          <text x="200" y="150" text-anchor="middle" dy="0.3em" fill="#9CA3AF" font-family="Arial" font-size="16">
                            ${project.title}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gold-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gold-400 font-semibold text-sm">{project.year}</span>
                    <div className="flex items-center gap-2">
                      {project.clientResults && (
                        <span className="text-green-400 text-xs bg-green-900/20 px-2 py-1 rounded">
                          {project.clientResults}
                        </span>
                      )}
                      {project.websiteUrl && (
                        <a 
                          href={project.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 text-xs hover:underline flex items-center gap-1"
                        >
                          🔗 Visit Site
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}