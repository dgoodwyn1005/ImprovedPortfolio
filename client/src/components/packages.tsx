export default function Packages() {
  const packages = [
    {
      name: "STARTER",
      description: "Perfect for small businesses getting started",
      setupPrice: "$650",
      monthlyPrice: "$35",
      features: [
        "1-page custom website",
        "Basic AI chatbot for FAQs",
        "Contact form with Zapier automation",
        "Hosting & SSL security",
      ],
      buttonText: "Get Started",
      buttonClass: "bg-deep-blue-600 hover:bg-deep-blue-700",
      isPopular: false,
    },
    {
      name: "GROWTH",
      description: "Ideal for growing businesses",
      setupPrice: "$1,200",
      monthlyPrice: "$75",
      features: [
        "3–5 page custom website",
        "AI chatbot + Zapier email/SMS automation",
        "Lead tracking & CRM integration",
        "SEO & Google My Business setup",
      ],
      buttonText: "Choose Growth",
      buttonClass: "bg-gold-500 hover:bg-gold-600",
      isPopular: true,
    },
    {
      name: "PRO",
      description: "Full-service enterprise solution",
      setupPrice: "$2,500+",
      monthlyPrice: "$150",
      features: [
        "Multi-page website with store/booking",
        "Advanced AI + multi-platform automation",
        "Full Zapier workflow integration",
        "Review & social media automation",
        "Priority support & custom workflows",
      ],
      buttonText: "Go Pro",
      buttonClass: "bg-deep-blue-600 hover:bg-deep-blue-700",
      isPopular: false,
    },
  ];

  const scrollToContact = () => {
    const target = document.querySelector("#contact");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section id="packages" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">Choose Your Package</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Scalable solutions designed to grow with your business
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                  pkg.isPopular
                    ? "border-2 border-gold-400 transform scale-105"
                    : "border border-gray-600"
                }`}
              >
                {pkg.isPopular && (
                  <div className="bg-gradient-to-r from-gold-400 to-gold-600 text-gray-900 text-center py-3 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <p className="text-gray-300 mb-4">{pkg.description}</p>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-white">{pkg.setupPrice}</span>
                      <span className="text-gray-300"> setup</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-2xl font-semibold text-gold-400">{pkg.monthlyPrice}</span>
                      <span className="text-gray-300">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <i className="fas fa-check text-green-400 mt-1"></i>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={scrollToContact}
                    className={`w-full text-white py-3 rounded-lg font-semibold transition-colors duration-300 ${
                      pkg.isPopular ? "bg-gold-500 hover:bg-gold-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {pkg.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
