import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackBookCallClick } from "@/lib/analytics";
import { useEffect } from "react";
import { Link } from "wouter";

export default function ThankYouMusic() {
  // Add structured data and page meta
  useEffect(() => {
    document.title = "Thank You - Music Consultation Booked | Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Thank you for booking your music consultation. Let\'s make your event unforgettable with beautiful piano music.');
    }
  }, []);

  const nextSteps = [
    {
      title: "📧 Check Your Email",
      description: "You'll receive a confirmation email with calendar invite and event planning guide"
    },
    {
      title: "🎵 Prepare Your Song List",
      description: "Think about special songs, processional/recessional preferences, and any dedications"
    },
    {
      title: "📅 Review Your Timeline",
      description: "Consider your event schedule, setup time, and any special moment coordination"
    },
    {
      title: "💡 Bring Details",
      description: "Come ready to discuss venue, guest count, style preferences, and logistics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-music text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              🎹 Music Consultation Booked!
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Wonderful! I'm excited to help make your special event unforgettable with beautiful piano music tailored perfectly to your vision.
            </p>
          </div>

          {/* Calendly Embed */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Your Music Consultation</h2>
            
            <div className="bg-white rounded-lg p-8">
              <div className="text-center text-gray-600">
                <i className="fas fa-music text-6xl text-purple-600 mb-4"></i>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Music Consultation Confirmed!</h3>
                <p className="text-lg mb-4">Your music consultation has been successfully booked.</p>
                <p className="text-sm mb-6">You should receive a confirmation email with calendar invite shortly.</p>
                <a
                  href="https://calendly.com/deshawngoodwyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
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
          <h2 className="text-3xl font-bold text-white text-center mb-12">What to Expect</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nextSteps.map((step, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-purple-100">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gold-500/20 backdrop-blur-md rounded-2xl p-8 border border-gold-400/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎯 My Punctuality Guarantee
            </h3>
            <p className="text-purple-100 mb-6">
              I arrive 45 minutes early to every event to ensure perfect setup and sound check. If I'm ever late, you get 100% of your deposit back - no questions asked.
            </p>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gold-400 mb-2">What This Means for You:</h4>
              <ul className="text-purple-100 text-left space-y-2">
                <li>✅ Zero stress about music setup on your big day</li>
                <li>✅ Full sound check before guests arrive</li>
                <li>✅ Backup equipment always on standby</li>
                <li>✅ Coordination with other vendors</li>
                <li>✅ Complete peace of mind</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 mr-4"
                onClick={() => trackBookCallClick('music', 'thank_you_lead_magnet')}
              >
                Download Wedding Planner
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900">
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
          <p className="text-purple-100 mb-6">
            No problem! Just reply to your confirmation email or contact me directly:
          </p>
          <div className="space-y-2 text-purple-100">
            <p><i className="fas fa-envelope mr-2"></i> contactme.dkg@gmail.com</p>
            <p><i className="fas fa-phone mr-2"></i> (804) 505-9668</p>
          </div>
        </div>
      </section>
    </div>
  );
}