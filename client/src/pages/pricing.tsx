import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdSense from "@/components/AdSense";
import { useState, useEffect } from "react";

export default function Pricing() {
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    document.title = "Pricing - Deshawn Goodwyn Services";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transparent pricing for web development, AI implementation, piano services, and basketball coaching. Custom solutions from $45/hour to fixed packages starting at $500.');
    }
  }, []);

  const services = {
    computer: [
      {
        title: "One-Page Website",
        description: "Professional single-page website with 3-5 sections",
        price: "$500",
        type: "fixed",
        turnaround: "1-2 weeks",
        includes: [
          "Responsive design",
          "Contact form integration", 
          "Basic SEO optimization",
          "Mobile optimization",
          "1 round of revisions"
        ],
        cta: "Order Now",
        featured: true
      },
      {
        title: "AI Chatbot Implementation", 
        description: "Basic AI chatbot for customer service",
        price: "$600",
        type: "fixed",
        turnaround: "1-2 weeks", 
        includes: [
          "Custom AI training",
          "Website integration",
          "Basic conversation flows",
          "Testing & optimization",
          "1 month support"
        ],
        cta: "Get Started"
      },
      {
        title: "Web Hosting",
        description: "Reliable hosting with SSL and backups",
        price: "$10",
        type: "monthly",
        turnaround: "Immediate",
        includes: [
          "SSL certificate",
          "Daily backups", 
          "99.9% uptime guarantee",
          "Technical support",
          "Email accounts"
        ],
        cta: "Subscribe"
      },
      {
        title: "AI Agent Implementation",
        description: "Custom AI solutions and automation",
        price: "$50",
        type: "hourly",
        turnaround: "1-3 weeks",
        includes: [
          "Custom AI development",
          "Business process analysis",
          "Integration support",
          "Training & documentation",
          "Ongoing optimization"
        ],
        cta: "Get Quote"
      },
      {
        title: "App Development",
        description: "Custom mobile or web application",
        price: "$20",
        type: "hourly", 
        turnaround: "2-8 weeks",
        includes: [
          "Custom development",
          "UI/UX design",
          "Database integration",
          "Testing & deployment",
          "Post-launch support"
        ],
        cta: "Discuss Project"
      },
      {
        title: "Web Application (Startup)",
        description: "Full-featured web application for startups",
        price: "$800",
        type: "fixed",
        turnaround: "2-4 weeks",
        includes: [
          "MVP development",
          "User authentication",
          "Database design",
          "Admin dashboard",
          "Payment integration"
        ],
        cta: "Start Building",
        startup: true
      },
      {
        title: "Web Application (Standard)",
        description: "Enterprise-grade web application",
        price: "$800-$2,000",
        type: "project",
        turnaround: "3-8 weeks",
        includes: [
          "Custom architecture",
          "Advanced features",
          "Scalable infrastructure",
          "Security implementation",
          "Training & documentation"
        ],
        cta: "Get Proposal"
      }
    ],
    music: [
      {
        title: "Essential Package",
        description: "Perfect for intimate gatherings and small events",
        price: "$100",
        type: "fixed",
        turnaround: "2 hours",
        includes: [
          "2 hours of performance",
          "Song requests accepted",
          "Professional attire",
          "Punctuality guarantee",
          "Travel within 25 miles"
        ],
        cta: "Book Now",
        featured: true
      },
      {
        title: "Premium Package", 
        description: "Ideal for weddings and special occasions",
        price: "$200",
        type: "fixed",
        turnaround: "4 hours",
        includes: [
          "4 hours of performance",
          "Custom song list",
          "Ceremony & reception",
          "Sound equipment provided",
          "Travel within 50 miles"
        ],
        cta: "Reserve Date"
      },
      {
        title: "Luxury Package",
        description: "Full-day premium piano service",
        price: "$500", 
        type: "fixed",
        turnaround: "Full day",
        includes: [
          "8+ hours of performance",
          "Custom arrangements",
          "Multiple event segments",
          "Professional sound system",
          "Extended travel included"
        ],
        cta: "Book Luxury"
      },
      {
        title: "Piano Accompaniment",
        description: "Professional accompaniment services",
        price: "$45",
        type: "hourly",
        turnaround: "Flexible",
        includes: [
          "Rehearsal attendance",
          "Professional performance",
          "Music reading & adaptation",
          "Collaboration with artists",
          "Performance preparation"
        ],
        cta: "Schedule"
      },
      {
        title: "Session Rate", 
        description: "Alternative pricing for shorter performances",
        price: "$100",
        type: "session",
        turnaround: "Per event",
        includes: [
          "Single event performance",
          "Up to 2 hours",
          "Song requests",
          "Professional service",
          "Local travel included"
        ],
        cta: "Book Session"
      },
      {
        title: "Custom Song Arrangement",
        description: "Personalized piano arrangements",
        price: "$75-$250",
        type: "project",
        turnaround: "1-2 weeks",
        includes: [
          "Custom arrangement",
          "Sheet music provided",
          "Performance practice",
          "Revision included",
          "Audio demo available"
        ],
        cta: "Commission"
      },
      {
        title: "Performance Recording",
        description: "Professional recording of piano performances",
        price: "$100-$300",
        type: "project", 
        turnaround: "1-2 weeks",
        includes: [
          "Studio-quality recording",
          "Multiple takes",
          "Basic audio editing",
          "Digital file delivery",
          "Usage rights included"
        ],
        cta: "Record Now"
      }
    ],
    basketball: [
      {
        title: "Individual Training",
        description: "One-on-one skill development sessions",
        price: "$75",
        type: "hourly",
        turnaround: "Per session",
        includes: [
          "Personalized training plan",
          "Shooting mechanics",
          "Ball handling drills",
          "Game strategy coaching",
          "Progress tracking"
        ],
        cta: "Book Training",
        featured: true
      },
      {
        title: "Group Training",
        description: "Small group basketball training sessions",
        price: "$50",
        type: "per person",
        turnaround: "Per session",
        includes: [
          "Team dynamics training",
          "Competitive drills",
          "Communication skills",
          "Leadership development",
          "Group motivation"
        ],
        cta: "Organize Group"
      },
      {
        title: "Youth Development Camp",
        description: "Multi-day basketball camp for young athletes",
        price: "Contact for pricing",
        type: "camp",
        turnaround: "Multi-day",
        includes: [
          "Fundamental skills training",
          "Character development",
          "Sportsmanship education",
          "Fun activities",
          "Achievement certificates"
        ],
        cta: "Learn More"
      },
      {
        title: "Coaching Consultation",
        description: "Strategy and development consultation",
        price: "$100",
        type: "session",
        turnaround: "1-2 hours",
        includes: [
          "Game film analysis",
          "Strategy development",
          "Player assessment",
          "Training plan creation",
          "Follow-up support"
        ],
        cta: "Get Consultation"
      }
    ]
  };

  const addOns = [
    {
      title: "Extended Travel",
      description: "For locations 50+ miles away",
      price: "$1/mile",
      applies: ["Music", "Basketball"]
    },
    {
      title: "Rush Booking", 
      description: "Less than 1 week notice",
      price: "+25%",
      applies: ["All Services"]
    },
    {
      title: "Weekend Premium",
      description: "Saturday/Sunday bookings", 
      price: "+15%",
      applies: ["Music", "Basketball"]
    }
  ];

  const filteredServices = activeTab === "all" 
    ? [...services.computer, ...services.music, ...services.basketball]
    : services[activeTab as keyof typeof services] || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Service <span className="text-gold-400">Pricing</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Transparent, competitive pricing for all services. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: "all", label: "All Services" },
                { id: "computer", label: "Computer/Web" },
                { id: "music", label: "Music" },
                { id: "basketball", label: "Basketball" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "bg-gold-400 text-gray-900"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  className={`bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors relative ${
                    service.featured ? "ring-2 ring-gold-400" : ""
                  }`}
                >
                  {service.featured && (
                    <div className="absolute -top-3 left-4 bg-gold-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      Popular
                    </div>
                  )}
                  {(service as any).startup && (
                    <div className="absolute -top-3 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Startup Special
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gold-400 mb-3">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      {service.price}
                      {service.type === "hourly" && <span className="text-lg text-gray-400">/hr</span>}
                      {service.type === "monthly" && <span className="text-lg text-gray-400">/mo</span>}
                      {service.type === "per person" && <span className="text-lg text-gray-400">/person</span>}
                    </div>
                    <div className="text-gray-400 text-sm">
                      <i className="fas fa-clock mr-1"></i>
                      {service.turnaround}
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    {service.includes.map((item, i) => (
                      <div key={i} className="flex items-center text-gray-400">
                        <i className="fas fa-check text-green-400 mr-3"></i>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-gold-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gold-500 transition-colors">
                    {service.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gold-400 mb-12">Additional Fees & Options</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gold-400 mb-2">{addon.title}</h3>
                  <p className="text-gray-300 mb-4">{addon.description}</p>
                  <div className="text-xl font-bold text-white mb-2">{addon.price}</div>
                  <div className="text-sm text-gray-400">
                    Applies to: {addon.applies.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="py-6 flex justify-center bg-gray-900 overflow-x-auto">
        <AdSense format="leaderboard" slot="4444444444" responsive={false} />
      </div>

      {/* FAQ */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gold-400 mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gold-400 mb-3">Do you require payment upfront?</h3>
                <p className="text-gray-300">
                  For fixed-price projects, I require 50% upfront with the remainder due upon completion. 
                  Hourly services are billed weekly. Payment plans available for larger projects.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gold-400 mb-3">What's your cancellation policy?</h3>
                <p className="text-gray-300">
                  Cancellations more than 48 hours in advance receive full refund. Within 48 hours, 
                  a 50% cancellation fee applies. Same-day cancellations are non-refundable.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gold-400 mb-3">Do you offer custom packages?</h3>
                <p className="text-gray-300">
                  Absolutely! Many clients need services from multiple areas. I offer discounted 
                  custom packages that combine web development, music services, and coaching.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gold-400 mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-300">
                  Credit/debit cards, PayPal, Venmo, bank transfers, and cash for local services. 
                  All online payments are processed securely through Stripe.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 mb-6">
                Have questions about pricing or need a custom quote?
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gold-400 text-gray-900 font-semibold rounded-lg hover:bg-gold-500 transition-colors"
              >
                <i className="fas fa-envelope mr-2"></i>
                Get Custom Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}