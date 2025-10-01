import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackLeadMagnetSubmit, trackBookCallClick, trackPackageView } from "@/lib/analytics";
import { useEffect } from "react";
import { Link } from "wouter";
import AdSense from "@/components/AdSense";

export default function MusicServices() {
  // Add structured data to document head
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "PerformingGroup",
      "name": "Deshawn Goodwyn — Pianist",
      "areaServed": "Richmond, VA",
      "url": "https://deshawngoodwyn.com/music",
      "telephone": "(804) 505-9668"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Update page title and meta description
    document.title = "Professional Piano Services - Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional piano services for weddings, events, and worship in Richmond, VA. Elegant music with punctuality guarantee and custom repertoire.');
    }

    return () => {
      // Cleanup structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const musicServices = [
    {
      icon: "fas fa-heart",
      title: "Wedding Ceremonies",
      description: "Beautiful piano music for your special day, from processional to reception"
    },
    {
      icon: "fas fa-church",
      title: "Church Services",
      description: "Contemporary and traditional hymns for worship services and special events"
    },
    {
      icon: "fas fa-microphone",
      title: "Corporate Events",
      description: "Professional background music and entertainment for business gatherings"
    },
    {
      icon: "fas fa-music",
      title: "Studio Recording",
      description: "High-quality piano recordings for albums, demos, and commercial projects"
    }
  ];

  const packages = [
    {
      name: "CEREMONY ONLY",
      price: "Starting at $400 + travel",
      features: [
        "Prelude music (30 minutes)",
        "Processional & recessional",
        "Unity candle or special moments",
        "Consultation & song planning",
        "💰 $50 date-hold deposit required",
        "🎯 Punctuality Guarantee: Arrive 45 min early or 100% deposit refund"
      ]
    },
    {
      name: "CEREMONY + COCKTAIL",
      price: "Starting at $650 + travel",
      features: [
        "Full ceremony music",
        "Cocktail hour background music",
        "Special requests & dedications",
        "Coordination with vendors",
        "💰 $100 date-hold deposit required",
        "🎯 Punctuality Guarantee: Arrive 45 min early or 100% deposit refund"
      ],
      popular: true
    },
    {
      name: "FULL EVENT",
      price: "Starting at $950 + travel",
      features: [
        "Ceremony & cocktail music",
        "Dinner background music (2-3 hours)",
        "Special performances & dedications",
        "MC coordination available",
        "💰 $150 date-hold deposit required",
        "🎯 Punctuality Guarantee: Arrive 45 min early or 100% deposit refund"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
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
            Professional Piano Services for
            <span className="text-gold-400"> Your Special Moments</span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            15+ years of experience bringing beautiful music to weddings, churches, events, and recording studios
          </p>



          {/* Primary CTA */}
          <div className="space-y-4">
            <Button 
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                trackBookCallClick('music', 'hero');
                window.open('https://calendly.com/contactme-dkg/30min', '_blank');
              }}
            >
              Check Availability
            </Button>
            <p className="text-purple-200 text-sm">Free consultation • Custom song requests • Professional service</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Musical Services I Offer</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {musicServices.map((service, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className={`${service.icon} text-2xl text-white`}></i>
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-100">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">15+ Years of Musical Excellence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-gold-400 mb-2">200+</div>
              <div className="text-white">Weddings Performed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-gold-400 mb-2">50+</div>
              <div className="text-white">Church Services</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-gold-400 mb-2">NCAA</div>
              <div className="text-white">Athletic Background</div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Ad */}
      <div className="py-6 flex justify-center overflow-x-auto">
        <AdSense format="leaderboard" slot="3003333333" responsive={false} />
      </div>

      {/* Calendly Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Check My Availability</h2>
            <p className="text-purple-100 text-center mb-8">
              Let's discuss your event and ensure your music is perfect
            </p>
            
            {/* Calendly embed widget */}
            <div className="calendly-inline-widget bg-white rounded-lg" 
                 data-url="https://calendly.com/contactme-dkg/30min" 
                 style={{minWidth: "320px", height: "700px"}}>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Service Packages</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${pkg.popular ? 'ring-2 ring-gold-400 bg-white/15' : 'bg-white/10'} backdrop-blur-md border border-white/20`}
                onClick={() => trackPackageView(pkg.name, 'music')}
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
                      <li key={idx} className="flex items-center text-purple-100">
                        <i className="fas fa-check text-gold-400 mr-3"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full mt-6 bg-gold-500 hover:bg-gold-600 text-white"
                    onClick={() => {
                      trackBookCallClick('music', `package_${pkg.name.toLowerCase()}`);
                      window.open('https://calendly.com/contactme-dkg/30min', '_blank');
                    }}
                  >
                    Book Now
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