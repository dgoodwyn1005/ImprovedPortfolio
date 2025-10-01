import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackBookCallClick } from "@/lib/analytics";
import { useEffect } from "react";
import { Link } from "wouter";

export default function ThankYouAI() {
  // Add structured data and page meta
  useEffect(() => {
    document.title = "Thank You - AI Consultation Booked | Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Thank you for booking your AI consultation. Get ready to transform your business with automation.');
    }
  }, []);

  const nextSteps = [
    {
      title: "📧 Check Your Email",
      description: "You'll receive a confirmation email with calendar invite and preparation guide"
    },
    {
      title: "🎯 Prepare Your Goals",
      description: "Think about your biggest time-consuming tasks and automation opportunities"
    },
    {
      title: "📊 Review Your Business",
      description: "Consider your current tools, website, and customer journey"
    },
    {
      title: "💡 Bring Questions",
      description: "Come ready to discuss your specific challenges and growth goals"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              🎉 Consultation Booked Successfully!
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Excellent choice! You're about to discover how AI and automation can save you 20+ hours per week and significantly boost your revenue.
            </p>
          </div>

          {/* Calendly Embed */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Your Consultation Details</h2>
            
            <div className="bg-white rounded-lg p-8">
              <div className="text-center text-gray-600">
                <i className="fas fa-calendar-check text-6xl text-green-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Consultation Confirmed!</h3>
                <p className="text-lg mb-4">Your AI consultation has been successfully booked.</p>
                <p className="text-sm mb-6">You should receive a confirmation email with calendar invite shortly.</p>
                <a
                  href="https://calendly.com/deshawngoodwyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-calendar-alt mr-2"></i>
                  View/Reschedule Appointment
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Happens Next?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nextSteps.map((step, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gold-500/20 backdrop-blur-md rounded-2xl p-8 border border-gold-400/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              While You Wait...
            </h3>
            <p className="text-blue-100 mb-6">
              Get started with our free AI Starter Kit if you haven't already!
            </p>
            
            <div className="space-y-4">
              <Button 
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 mr-4"
                onClick={() => trackBookCallClick('ai', 'thank_you_lead_magnet')}
              >
                Download AI Starter Kit
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-4">Need to Reschedule or Have Questions?</h3>
          <p className="text-blue-100 mb-6">
            No problem! Just reply to your confirmation email or contact me directly:
          </p>
          <div className="space-y-2 text-blue-100">
            <p><i className="fas fa-envelope mr-2"></i> contactme.dkg@gmail.com</p>
            <p><i className="fas fa-phone mr-2"></i> (804) 505-9668</p>
          </div>
        </div>
      </section>
    </div>
  );
}