import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackLeadMagnetSubmit, trackBookCallClick, trackPackageView } from "@/lib/analytics";
import { useEffect } from "react";
import { Link } from "wouter";
import AdSense from "@/components/AdSense";

export default function AIServices() {
  // Add structured data to document head
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Deshawn Goodwyn — AI & Web Implementation",
      "areaServed": "Richmond, VA",
      "url": "https://deshawngoodwyn.com/ai",
      "telephone": "(804) 505-9668",
      "priceRange": "$$",
      "sameAs": [
        "https://www.linkedin.com/in/deshawngoodwyn",
        "https://github.com/dgoodwyn1005"
      ],
      "serviceOffer": "AI chatbots, Zapier automation, web development"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Update page title and meta description
    document.title = "AI & Web Development Services - Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional AI automation and web development services in Richmond, VA. Custom chatbots, Zapier automation, and modern websites to grow your business.');
    }

    return () => {
      // Cleanup structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const aiServices = [
    {
      icon: "fas fa-globe",
      title: "Custom Websites",
      description: "Mobile-responsive, SEO-optimized websites that convert visitors into customers"
    },
    {
      icon: "fas fa-robot",
      title: "AI Chatbots", 
      description: "24/7 customer support and lead qualification with intelligent automation"
    },
    {
      icon: "fas fa-cogs",
      title: "Zapier Automation",
      description: "Connect your business tools and automate repetitive tasks seamlessly"
    },
    {
      icon: "fas fa-chart-line",
      title: "CRM Integration",
      description: "Streamline your sales process with automated lead tracking and follow-ups"
    }
  ];

  const packages = [
    {
      name: "QUICK-WIN SPRINT",
      price: "$450",
      features: [
        "7-day implementation guarantee",
        "One automation or micro-site",
        "Contact form with CRM integration",
        "Perfect for testing the waters"
      ]
    },
    {
      name: "STARTER",
      price: "$650 setup + $35/month",
      features: [
        "1-page custom website",
        "Basic AI chatbot for FAQs", 
        "Contact form with Zapier automation",
        "Hosting & SSL security"
      ]
    },
    {
      name: "GROWTH",
      price: "$1,200 setup + $75/month",
      features: [
        "3-5 page custom website",
        "AI chatbot + Zapier email/SMS automation",
        "Lead tracking & CRM integration", 
        "SEO & Google My Business setup"
      ],
      popular: true
    },
    {
      name: "PRO", 
      price: "$2,500+ setup + $150/month",
      features: [
        "Multi-page website with store/booking",
        "Advanced AI + multi-platform automation",
        "Full Zapier workflow integration",
        "Review & social media automation",
        "Priority support & custom workflows"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue-900 via-blue-800 to-deep-blue-700">
      {/* Navigation */}
      <nav className="p-6">
        <Link href="/">
          <Button variant="ghost" className="text-white hover:text-gold-400 hover:bg-white/10">
            ← Back to Home
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Transform Your Business with 
            <span className="text-gold-400"> AI & Automation</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Custom websites, intelligent chatbots, and powerful automations that work 24/7 to grow your business
          </p>



          {/* Primary CTA */}
          <div className="space-y-4">
            <Button 
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                trackBookCallClick('ai', 'hero');
                window.open('https://calendly.com/contactme-dkg/30min', '_blank');
              }}
            >
              Book a Free Consult
            </Button>
            <p className="text-blue-200 text-sm">15-minute discovery call • No pressure • Custom strategy session</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What I Can Build For You</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiServices.map((service, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className={`${service.icon} text-2xl text-white`}></i>
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Ad */}
      <div className="py-6 flex justify-center overflow-x-auto">
        <AdSense format="leaderboard" slot="2003333333" responsive={false} />
      </div>

      {/* Calendly Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Book Your Free Strategy Call</h2>
            <p className="text-blue-100 text-center mb-8">
              Let's discuss your business goals and create a custom automation plan
            </p>
            
            <div className="bg-white rounded-lg p-8">
              <div className="text-center">
                <i className="fas fa-calendar-alt text-6xl text-blue-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Schedule Your AI Consultation</h3>
                <p className="text-gray-600 mb-6">
                  Book a free 30-minute consultation to discuss your AI implementation needs.
                </p>
                <a
                  href="https://calendly.com/deshawngoodwyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Book AI Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Choose Your Package</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.popular ? 'ring-2 ring-gold-400 bg-white/15' : 'bg-white/10'} backdrop-blur-md border border-white/20`}
                onClick={() => trackPackageView(pkg.name, 'ai')}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-gold-400 text-xl font-semibold">{pkg.price}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-blue-100">
                        <i className="fas fa-check text-gold-400 mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full mt-6 bg-gold-500 hover:bg-gold-600 text-white"
                    onClick={() => {
                      trackBookCallClick('ai', `package_${pkg.name.toLowerCase()}`);
                      window.open('https://calendly.com/contactme-dkg/30min', '_blank');
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}