import { useState, useEffect } from "react";
import { useEditableContent } from "@/hooks/use-editable-content";

export default function EnhancedHero() {
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get editable content
  const { content, isLoading } = useEditableContent("home", "hero");
  
  const phrases = [
    "Web Developer",
    "AI Implementation Specialist", 
    "Professional Pianist",
    "Problem Solver"
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (typedText.length < currentPhrase.length) {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (typedText.length > 0) {
          setTypedText(currentPhrase.slice(0, typedText.length - 1));
        } else {
          // Move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [typedText, currentPhraseIndex, isDeleting, phrases]);

  const scrollToPortfolio = () => {
    const target = document.querySelector("#portfolio");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToContact = () => {
    const target = document.querySelector("#contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden"
    >
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold-400 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Reduced floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400 rounded-full opacity-15 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Enhanced Hero Content */}
          <div className="mb-6">
            {content.greeting?.isVisible !== false && (
              <p className="text-gold-400 font-semibold text-lg mb-2 animate-slide-up">
                {content.greeting?.title || "👋 Hello, I'm Deshawn Goodwyn"}
              </p>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="gradient-text">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            {content.main_title?.isVisible !== false && (
              <h2 className="text-2xl sm:text-3xl text-blue-100 mb-6">
                {content.main_title?.title || "Web, AI, and Music — Crafted with Precision"}
              </h2>
            )}
          </div>

          {content.description?.isVisible !== false && (
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {content.description?.description || "Helping businesses and musicians succeed with custom websites, AI automation, and exceptional music services."}
            </p>
          )}

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {content.ai_button?.isVisible !== false && (
              <a
                href={content.ai_button?.buttonLink || "/ai"}
                className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 animate-glow hover-lift"
              >
                <i className="fas fa-robot mr-2 group-hover:animate-bounce-subtle"></i>
                {content.ai_button?.buttonText || "AI & Web Services"}
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </a>
            )}
            {content.music_button?.isVisible !== false && (
              <a
                href={content.music_button?.buttonLink || "/music"}
                className="group inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 animate-glow hover-lift"
              >
                <i className="fas fa-music mr-2 group-hover:animate-bounce-subtle"></i>
                {content.music_button?.buttonText || "Piano Services"}
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </a>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {content.contact_button?.isVisible !== false && (
              <button
                onClick={scrollToContact}
                className="group inline-flex items-center px-6 py-3 glass text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                <i className="fas fa-envelope mr-2"></i>
                {content.contact_button?.buttonText || "Contact Me"}
              </button>
            )}
            {content.portfolio_button?.isVisible !== false && (
              <button
                onClick={scrollToPortfolio}
                className="group inline-flex items-center px-6 py-3 glass text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                <i className="fas fa-eye mr-2"></i>
                {content.portfolio_button?.buttonText || "View Portfolio"}
              </button>
            )}
          </div>

          {/* Simplified Trust Indicators - Removed detailed stats */}
          <div className="flex flex-wrap gap-6 justify-center items-center max-w-2xl mx-auto">
            <div className="flex items-center text-blue-200">
              <i className="fas fa-check-circle text-green-400 mr-2"></i>
              <span className="font-medium">50+ Projects Completed</span>
            </div>
            <div className="flex items-center text-blue-200">
              <i className="fas fa-star text-gold-400 mr-2"></i>
              <span className="font-medium">15+ Years Piano Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
        <div className="glass p-3 rounded-full">
          <i className="fas fa-chevron-down text-gold-400 text-xl"></i>
        </div>
      </div>
    </section>
  );
}