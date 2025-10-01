import { useState, useEffect, useRef } from "react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          
          const startTime = Date.now();
          const startCount = 0;
          
          const updateCount = () => {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart);
            
            setCount(currentCount);
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          };
          
          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return (
    <div ref={counterRef} className="text-3xl font-bold text-gold-400">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function StatsCounter() {
  const stats = [
    {
      number: 50,
      suffix: "+",
      label: "Projects Completed",
      icon: "fas fa-check-circle",
      color: "text-green-400"
    },
    {
      number: 3,
      suffix: "+",
      label: "Years Experience",
      icon: "fas fa-calendar-alt",
      color: "text-blue-400"
    },
    {
      number: 15,
      suffix: "+",
      label: "Years Piano",
      icon: "fas fa-music",
      color: "text-purple-400"
    },
    {
      number: 98,
      suffix: "%",
      label: "Client Satisfaction",
      icon: "fas fa-heart",
      color: "text-red-400"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">By the Numbers</h2>
          <p className="text-gray-300">Results that speak for themselves</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-600 hover:border-gold-400 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4`}>
                <i className={`${stat.icon} text-2xl ${stat.color}`}></i>
              </div>
              <AnimatedCounter end={stat.number} suffix={stat.suffix} />
              <p className="text-gray-300 mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}