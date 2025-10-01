import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdSense from "@/components/AdSense";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    document.title = "About - Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about Deshawn Goodwyn - Web Developer, AI Implementation Specialist, Professional Pianist, and former Division I basketball player with a unique multidisciplinary background.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              About <span className="text-gold-400">Deshawn</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Multi-talented professional bringing excellence from the basketball court to the concert hall to the digital world
            </p>
          </div>
        </div>
      </section>

      {/* Full Bio Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Early Life & Basketball */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gold-400 mb-6">Athletic Foundation</h2>
              <div className="prose prose-lg prose-blue max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6">
                  My journey began on the basketball courts, where I developed the discipline, teamwork, and competitive drive that would shape my entire approach to life. As a Division I athlete, I learned that success comes through consistent practice, strategic thinking, and never giving up when facing challenges.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Basketball taught me invaluable lessons about performance under pressure, working with diverse teams, and the importance of preparation. These skills translate directly into how I approach client projects - with dedication, strategic planning, and a commitment to excellence.
                </p>
              </div>
            </div>

            {/* Musical Journey */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gold-400 mb-6">Musical Excellence</h2>
              <div className="prose prose-lg prose-blue max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6">
                  With over 15 years of piano experience, music has been my constant companion and creative outlet. From classical compositions to contemporary arrangements, I've performed for weddings, worship services, and special events throughout the Richmond area.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Music taught me about precision, emotional expression, and the power of practice. The attention to detail required for flawless performances mirrors the meticulous care I bring to web development and AI implementation projects.
                </p>
              </div>
            </div>

            {/* Technology & Innovation */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gold-400 mb-6">Digital Innovation</h2>
              <div className="prose prose-lg prose-blue max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6">
                  My transition into technology was driven by a fascination with how digital solutions can transform businesses and improve lives. I specialize in web development, AI implementation, and business automation - helping entrepreneurs and small businesses leverage technology to scale their operations.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  What sets me apart is my multidisciplinary background. The teamwork from basketball, the precision from piano, and the creativity from both come together in my technical work. I don't just build websites - I create digital experiences that connect with people.
                </p>
              </div>
            </div>

            {/* Philosophy & Approach */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gold-400 mb-6">My Approach</h2>
              <div className="bg-gray-700 p-8 rounded-lg">
                <p className="text-gray-300 leading-relaxed mb-4 italic text-lg">
                  "Excellence isn't a single act, but a habit. Whether I'm performing a piano piece, developing a website, or implementing AI solutions, I bring the same commitment to perfection."
                </p>
                <p className="text-gray-300 leading-relaxed">
                  I believe in clear communication, reliable delivery, and going above and beyond client expectations. My diverse background allows me to understand different perspectives and create solutions that truly resonate with target audiences.
                </p>
              </div>
            </div>

            {/* Current Focus */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gold-400 mb-6">Today</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Based in Richmond, VA, I'm focused on helping businesses succeed through custom web solutions, AI automation, and providing elegant piano music for special occasions. Each project benefits from my unique combination of athletic discipline, musical precision, and technical innovation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Get In Touch
                </a>
                <a
                  href="/portfolio"
                  className="inline-flex items-center px-8 py-4 border border-gold-400 text-gold-400 font-semibold rounded-lg hover:bg-gold-400 hover:text-gray-900 transition-colors"
                >
                  <i className="fas fa-eye mr-2"></i>
                  View My Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="py-6 flex justify-center bg-gray-900 overflow-x-auto">
        <AdSense format="leaderboard" slot="4444444444" responsive={false} />
      </div>

      <Footer />
    </div>
  );
}