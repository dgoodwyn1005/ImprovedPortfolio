export default function Services() {
  const computerServices = [
    {
      title: "Website Design & Development",
      description: "Custom, responsive websites tailored to your brand",
    },
    {
      title: "Web Hosting & Maintenance",
      description: "Reliable hosting with ongoing support and updates",
    },
    {
      title: "AI Chatbots & Zapier Automation",
      description: "Intelligent bots with powerful workflow automation via Zapier",
    },
    {
      title: "Custom Applications",
      description: "Bespoke software solutions for your specific needs",
    },
    {
      title: "Recurring Support Services",
      description: "Ongoing maintenance and feature development",
    },
    {
      title: "Package Bundles",
      description: "Comprehensive solutions at discounted rates",
    },
  ];

  const pianoServices = [
    {
      title: "Live Performance Sessions",
      description: "Professional performances for events and venues",
    },
    {
      title: "Music Arrangements",
      description: "Custom arrangements and compositions",
    },
    {
      title: "Studio Recordings",
      description: "High-quality recordings for albums and projects",
    },
    {
      title: "Travel Services",
      description: "Performance services with travel accommodation",
    },
    {
      title: "Rush Bookings",
      description: "Last-minute performance requests",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">Services</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Comprehensive solutions for your digital and musical needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Computer Services */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl border border-gray-600">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4">
                  <i className="fas fa-laptop-code text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">💻 Computer Services</h3>
              </div>

              <div className="space-y-4">
                {computerServices.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className="fas fa-check-circle text-green-400 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-white">{service.title}</h4>
                      <p className="text-gray-300 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Piano Services */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl border border-gray-600">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-gray-900 rounded-2xl mb-4">
                  <i className="fas fa-music text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">🎹 Piano Services</h3>
              </div>

              <div className="space-y-4">
                {pianoServices.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className="fas fa-check-circle text-gold-400 mt-1"></i>
                    <div>
                      <h4 className="font-semibold text-white">{service.title}</h4>
                      <p className="text-gray-300 text-sm">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Not Included Notice */}
              <div className="mt-8 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  🚫 Not Included
                </h4>
                <p className="text-sm text-red-300">
                  Equipment rental, venue booking, additional musicians, or audio engineering services unless
                  specifically arranged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
