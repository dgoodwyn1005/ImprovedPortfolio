import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section
      const scrolled = window.scrollY > window.innerHeight * 0.8;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const target = document.querySelector("#contact");
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isMinimized ? 'scale-75' : 'scale-100'}`}>
      {isMinimized ? (
        // Minimized state
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gold-500 hover:bg-gold-600 text-gray-900 p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <i className="fas fa-envelope text-xl"></i>
        </button>
      ) : (
        // Expanded state
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-2xl border border-gray-600 max-w-sm animate-slide-up">
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white text-sm"
          >
            <i className="fas fa-minus"></i>
          </button>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-rocket text-gray-900 text-xl"></i>
            </div>
            
            <h3 className="text-white font-bold mb-2">Ready to Start?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Let's discuss your project and bring your vision to life!
            </p>
            
            <div className="space-y-2">
              <button
                onClick={scrollToContact}
                className="w-full bg-gold-500 hover:bg-gold-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Free Quote
              </button>
              
              <button
                onClick={() => setIsMinimized(true)}
                className="w-full text-gray-400 hover:text-white text-sm py-1"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}