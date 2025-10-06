import Navigation from "@/components/navigation";
import EnhancedHero from "@/components/enhanced-hero";
import About from "@/components/about";
import StatsCounter from "@/components/stats-counter";
import InteractiveSkills from "@/components/interactive-skills";
import Portfolio from "@/components/portfolio";
import Projects from "@/components/projects";
import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

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
      
      
      <Portfolio />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
