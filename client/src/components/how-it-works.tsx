import { useEditableContent } from "@/hooks/use-editable-content";

export default function HowItWorks() {
  // Get editable content
  const { content, isLoading } = useEditableContent("home", "how_it_works");
  const platforms = [
    {
      icon: "fas fa-globe",
      title: content.website_platform?.title || "Website",
      platform: content.website_platform?.subtitle || "(Hostinger)",
      description: content.website_platform?.description || "Modern, mobile-ready, SEO-optimized site for your business. Fast, secure, and designed to convert visitors into customers.",
      features: [
        "Mobile Responsive Design",
        "SEO Optimization",
        "SSL Security",
      ],
      gradient: "from-blue-500 to-deep-blue-600",
    },
    {
      icon: "fas fa-robot",
      title: content.ai_platform?.title || "AI Features",
      platform: content.ai_platform?.subtitle || "(Replit)",
      description: content.ai_platform?.description || "Chatbots, automated replies, lead qualification, and blog generators. Smart AI tools that work 24/7 for your business.",
      features: [
        "Intelligent Chatbots",
        "Lead Qualification",
        "Content Generation",
      ],
      gradient: "from-gold-500 to-gold-600",
    },
    {
      icon: "fas fa-robot",
      title: content.automation_platform?.title || "Smart Automation",
      platform: content.automation_platform?.subtitle || "(Zapier Integration)",
      description: content.automation_platform?.description || "Email/SMS automation, CRM syncing, and intelligent workflows. Connect your business tools and automate repetitive tasks seamlessly.",
      features: [
        "Email & SMS Automation",
        "CRM Integration",
        "Workflow Automation",
      ],
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            {content.section_title?.isVisible !== false && (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold text-deep-blue-800 mb-4">
                  {content.section_title?.title || "How It Works"}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {content.section_title?.subtitle || "Three powerful platforms working together to transform your business"}
                </p>
              </>
            )}
          </div>

          {/* How It Works Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${platform.gradient} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <i className={`${platform.icon} text-2xl`}></i>
                  </div>

                  <h3 className="text-xl font-bold text-deep-blue-800 mb-3">{platform.title}</h3>
                  <p className="text-gray-600 mb-4 font-medium">{platform.platform}</p>

                  <p className="text-gray-700 leading-relaxed">{platform.description}</p>

                  <div className="mt-6 space-y-2">
                    {platform.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
