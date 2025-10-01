import { useQuery } from "@tanstack/react-query";
import type { LivePerformance } from "@shared/schema";

export default function Music() {
  // Fetch live performances
  const { data: livePerformances = [] } = useQuery<LivePerformance[]>({
    queryKey: ["/api/live-performances"],
  });

  const scrollToContact = () => {
    const target = document.querySelector("#contact");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const services = [
    {
      icon: "fas fa-music",
      title: "Worship & Religious Services",
      description: "Traditional and contemporary worship music",
    },
    {
      icon: "fas fa-heart",
      title: "Wedding Ceremonies",
      description: "Processional, recessional, and ceremony music",
    },
    {
      icon: "fas fa-glass-cheers",
      title: "Special Events & Receptions",
      description: "Background music and entertainment",
    },
    {
      icon: "fas fa-microphone",
      title: "Recording Sessions",
      description: "Studio recordings for albums and projects",
    },
    {
      icon: "fas fa-chalkboard-teacher",
      title: "Music Instruction",
      description: "Private lessons for all skill levels",
    },
  ];

  return (
    <section id="music" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">Music Services</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Professional piano performance with 15+ years of experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Music Content */}
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-deep-blue-800 mb-4">Principal Pianist</h3>
                <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-xl border border-gold-200">
                  <h4 className="text-xl font-semibold text-deep-blue-800 mb-4">Live Performance Samples</h4>
                  {livePerformances.length > 0 ? (
                    <div className="space-y-3">
                      {livePerformances.map((performance) => (
                        <div key={performance.id} className="border-l-4 border-gold-400 pl-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <a 
                                href={performance.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-semibold text-deep-blue-800 hover:text-gold-600 transition-colors duration-200 underline decoration-gold-400 decoration-2 underline-offset-2"
                              >
                                {performance.title}
                              </a>
                              <p className="text-sm text-gray-600 mt-1">
                                {performance.venue}
                                {performance.performanceDate && ` • ${performance.performanceDate}`}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{performance.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      Serving as principal pianist for worship services, special events, and community
                      gatherings. Providing musical leadership and creating inspiring worship experiences for
                      congregations.
                    </p>
                  )}
                </div>
              </div>

              {/* Piano Services List */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-deep-blue-800 mb-4">Piano Service Offerings:</h4>

                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className={`${service.icon} text-gold-500 mt-1`}></i>
                    <div>
                      <h5 className="font-semibold text-deep-blue-800">{service.title}</h5>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact for Music Services */}
              <div className="mt-8 p-6 bg-gradient-to-r from-deep-blue-50 to-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-deep-blue-800 mb-2">Book Music Services</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Contact for availability, pricing, and custom arrangements
                </p>
                <button
                  onClick={scrollToContact}
                  className="inline-flex items-center px-6 py-3 bg-gold-500 text-white font-semibold rounded-lg hover:bg-gold-600 transition-colors duration-300"
                >
                  <i className="fas fa-calendar mr-2"></i>
                  Schedule Consultation
                </button>
              </div>
            </div>

            {/* Performance Media */}
            <div className="space-y-8">
              {/* Video Placeholder */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-play-circle text-6xl text-white opacity-75 mb-4"></i>
                    <h4 className="text-white font-semibold mb-2">Live Performance Sample</h4>
                    <p className="text-gray-300 text-sm">Watch recent worship service performance</p>
                    <button className="mt-4 inline-flex items-center px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors duration-300">
                      <i className="fas fa-play mr-2"></i>
                      Play Video
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Stream Notice */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <div className="flex items-center mb-3">
                  <i className="fas fa-broadcast-tower text-red-500 mr-3"></i>
                  <h4 className="font-semibold text-red-800">Live Streaming</h4>
                </div>
                <p className="text-red-700 text-sm">
                  Experience live worship services featuring piano performances every Sunday. Check church
                  schedule for streaming times and special events.
                </p>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <i className="fas fa-calendar text-3xl text-purple-600 mb-3"></i>
                  <h4 className="text-2xl font-bold text-deep-blue-800">15+</h4>
                  <p className="text-purple-700 font-medium">Years Experience</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <i className="fas fa-users text-3xl text-blue-600 mb-3"></i>
                  <h4 className="text-2xl font-bold text-deep-blue-800">500+</h4>
                  <p className="text-blue-700 font-medium">Performances</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
