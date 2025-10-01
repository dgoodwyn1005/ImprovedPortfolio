import Navigation from "@/components/navigation";
import EnhancedHero from "@/components/enhanced-hero";
import About from "@/components/about";
import StatsCounter from "@/components/stats-counter";
import InteractiveSkills from "@/components/interactive-skills";
import Services from "@/components/services";
import Packages from "@/components/packages";
import Portfolio from "@/components/portfolio";
import Projects from "@/components/projects";
import Testimonials from "@/components/testimonials";
import Music from "@/components/music";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/floating-cta";
import AdSense from "@/components/AdSense";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <EnhancedHero />
      <About />
      
      {/* Combined stats and skills in one focused section */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <StatsCounter />
          <div className="mt-16">
            <InteractiveSkills />
          </div>
        </div>
      </div>
      
      <Services />
      
      {/* Banner Ad - Mid-page */}
      <div className="py-6 flex justify-center bg-gray-800 overflow-x-auto">
        <AdSense format="leaderboard" slot="4444444444" responsive={false} />
      </div>
      
      <Portfolio />
      <Testimonials />
      <Music />
      <Contact />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
