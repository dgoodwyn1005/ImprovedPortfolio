import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEditableContent } from "@/hooks/use-editable-content";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get editable content
  const { content: sectionContent } = useEditableContent("home", "testimonials");

  // Fetch testimonials from API
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of manual control
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating: string) => {
    const numRating = parseInt(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < numRating ? 'text-gold-400' : 'text-gray-400'}`}
      ></i>
    ));
  };

  // Show loading state or empty state
  if (isLoading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Client Testimonials</h2>
          <div className="text-gray-400">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Client Testimonials</h2>
          <div className="text-gray-400">No testimonials available at this time.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          {sectionContent.section_title?.isVisible !== false && (
            <>
              <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">
                {sectionContent.section_title?.title || "What Clients Say"}
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {sectionContent.section_title?.subtitle || "Real feedback from real people who've experienced the difference"}
              </p>
            </>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Testimonial Cards */}
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 md:p-12 mx-4 rounded-2xl border border-gray-600">
                      <div className="text-center">
                        {/* Stars */}
                        <div className="flex justify-center space-x-1 mb-6">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-lg md:text-xl text-gray-300 italic mb-8 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>

                        {/* Client Info */}
                        <div className="flex items-center justify-center space-x-4">
                          <img
                            src={testimonial.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full bg-gray-600"
                          />
                          <div className="text-left">
                            <h4 className="font-semibold text-white">{testimonial.name}</h4>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                            <p className="text-sm text-gold-400">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gold-400 scale-125'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}