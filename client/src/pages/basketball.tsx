import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdSense from "@/components/AdSense";
import { useEffect } from "react";

export default function BasketballServices() {
  useEffect(() => {
    document.title = "Basketball Services - Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Basketball coaching, training, and mentorship services from former Division I player Deshawn Goodwyn. Youth development, skills training, and athletic consulting in Richmond, VA.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Basketball <span className="text-orange-400">Services</span>
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Coaching, training, and mentorship from a former Division I athlete
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="https://calendly.com/deshawngoodwyn"
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Book Training Session
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 border border-orange-400 text-orange-400 font-semibold rounded-lg hover:bg-orange-400 hover:text-gray-900 transition-colors"
              >
                <i className="fas fa-envelope mr-2"></i>
                Get Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-orange-400 mb-12">Athletic Journey</h2>
            
            <div className="space-y-8">
              {/* High School */}
              <div className="bg-gray-700 p-8 rounded-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-school text-white text-lg"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400 mb-2">High School Excellence</h3>
                    <p className="text-gray-300 mb-4">
                      Developed foundational skills and competitive mindset that would carry through college and beyond. 
                      Learned the importance of discipline, teamwork, and consistent practice.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Team Leadership</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Skill Development</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Work Ethic</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* George Washington University */}
              <div className="bg-gray-700 p-8 rounded-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-white text-lg"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400 mb-2">George Washington University</h3>
                    <p className="text-gray-300 mb-4">
                      Division I basketball experience that taught advanced strategy, mental toughness, and performing under pressure. 
                      Balanced rigorous academics with elite-level athletics.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Division I Athletics</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Strategic Thinking</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Pressure Performance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Virginia State University */}
              <div className="bg-gray-700 p-8 rounded-lg">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-trophy text-white text-lg"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400 mb-2">Virginia State University</h3>
                    <p className="text-gray-300 mb-4">
                      Continued basketball excellence while developing leadership skills and mentoring younger players. 
                      Gained experience in coaching and player development.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Leadership</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Mentoring</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">Player Development</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-orange-400 mb-12">Basketball Services</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Individual Training */}
              <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-user text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Individual Training</h3>
                <p className="text-gray-300 mb-6">
                  One-on-one skill development focused on fundamentals, shooting, ball handling, and game strategy.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Shooting mechanics</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Ball handling drills</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Game strategy</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Mental conditioning</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-400 mb-4">From $75/hour</div>
                <a
                  href="https://calendly.com/deshawngoodwyn"
                  className="block w-full text-center bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Session
                </a>
              </div>

              {/* Group Training */}
              <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Group Training</h3>
                <p className="text-gray-300 mb-6">
                  Small group sessions focusing on team dynamics, communication, and competitive drills.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Team chemistry</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Competitive drills</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Communication skills</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Leadership development</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-400 mb-4">From $50/person</div>
                <a
                  href="/contact"
                  className="block w-full text-center bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Get Quote
                </a>
              </div>

              {/* Youth Camps */}
              <div className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-child text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Youth Development</h3>
                <p className="text-gray-300 mb-6">
                  Age-appropriate training camps and clinics for young athletes learning the game.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Fundamental skills</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Sportsmanship</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Confidence building</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    <span>Fun & engagement</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-400 mb-4">Contact for pricing</div>
                <a
                  href="/contact"
                  className="block w-full text-center bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="py-6 flex justify-center bg-gray-800 overflow-x-auto">
        <AdSense format="leaderboard" slot="4444444444" responsive={false} />
      </div>

      {/* Achievements & Values */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-orange-400 mb-12">Core Values</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-700 p-6 rounded-lg">
                <i className="fas fa-target text-orange-400 text-3xl mb-4"></i>
                <h3 className="text-xl font-bold text-white mb-3">Discipline</h3>
                <p className="text-gray-300">Consistent practice and dedication to improvement in every aspect of the game.</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <i className="fas fa-handshake text-orange-400 text-3xl mb-4"></i>
                <h3 className="text-xl font-bold text-white mb-3">Teamwork</h3>
                <p className="text-gray-300">Understanding how individual excellence contributes to team success.</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <i className="fas fa-brain text-orange-400 text-3xl mb-4"></i>
                <h3 className="text-xl font-bold text-white mb-3">Mental Toughness</h3>
                <p className="text-gray-300">Developing resilience and focus to perform under pressure.</p>
              </div>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg">
              <p className="text-lg text-gray-300 italic mb-6">
                "Basketball taught me that success isn't just about individual talent - it's about preparation, 
                teamwork, and the mental strength to perform when it matters most. I bring these same principles 
                to every coaching session."
              </p>
              <p className="text-orange-400 font-semibold">- Deshawn Goodwyn</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}