import { useQuery } from "@tanstack/react-query";
import type { FeaturedProject } from "@shared/schema";

export default function Projects() {
  const { data: projects = [], isLoading, error } = useQuery<FeaturedProject[]>({
    queryKey: ["/api/featured"],
  });

  // Sample data for when API is not available
  const sampleProjects: FeaturedProject[] = [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      icon: "fas fa-shopping-cart",
      iconColor: "from-blue-500 to-purple-600",
      features: ["User Authentication", "Payment Processing", "Admin Dashboard", "Responsive Design"],
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      demoType: "demo",
      order: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2", 
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      icon: "fas fa-tasks",
      iconColor: "from-green-500 to-teal-600",
      features: ["Real-time Updates", "Drag & Drop", "Team Collaboration", "File Sharing"],
      technologies: ["Vue.js", "Socket.io", "MongoDB", "Express"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      demoType: "demo",
      order: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Weather Dashboard",
      description: "Interactive weather dashboard with location-based forecasts, weather maps, and detailed analytics. Built with modern web technologies.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop",
      icon: "fas fa-cloud-sun",
      iconColor: "from-yellow-500 to-orange-600",
      features: ["Location-based Forecasts", "Interactive Maps", "Weather Analytics", "Mobile Responsive"],
      technologies: ["React", "TypeScript", "Chart.js", "OpenWeather API"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      demoType: "demo",
      order: "3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // Use sample data if API fails or returns empty
  const displayProjects = error || projects.length === 0 ? sampleProjects : projects;

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gold-400 mb-4">Personal Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700 rounded-xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">Personal Projects</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Innovative solutions and creative experiments in web development
          </p>
        </div>

        {displayProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-700 rounded-2xl p-12 max-w-md mx-auto">
              <i className="fas fa-lightbulb text-6xl text-gray-500 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">No Projects Yet</h3>
              <p className="text-gray-400">
                Featured projects will appear here once they're added through the admin panel.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <div key={project.id} className="bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                          <rect width="400" height="300" fill="#4B5563"/>
                          <text x="200" y="150" text-anchor="middle" dy="0.3em" fill="#9CA3AF" font-family="Arial" font-size="16">
                            ${project.title}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${project.iconColor} flex items-center justify-center`}>
                      <i className={`${project.icon} text-white text-lg`}></i>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-gray-200 font-semibold text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index} className="text-gray-400 text-xs flex items-center">
                          <i className="fas fa-check text-green-400 mr-2 text-xs"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gold-500 hover:bg-gold-600 text-gray-900 py-2 px-4 rounded text-center text-sm font-semibold transition-colors"
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        {project.demoType === "demo" ? "Live Demo" : 
                         project.demoType === "download" ? "Download" :
                         project.demoType === "game" ? "Play Game" : "View"}
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded text-sm transition-colors"
                      >
                        <i className="fab fa-github"></i>
                      </a>
                    )}
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