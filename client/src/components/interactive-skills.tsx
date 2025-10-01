import { useState, useEffect, useRef } from "react";

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
  category: "technical" | "creative" | "soft";
}

const skills: Skill[] = [
  // Technical Skills
  { name: "React & TypeScript", level: 90, icon: "fab fa-react", color: "from-blue-400 to-blue-600", category: "technical" },
  { name: "Node.js & Express", level: 85, icon: "fab fa-node-js", color: "from-green-400 to-green-600", category: "technical" },
  { name: "Database Design", level: 80, icon: "fas fa-database", color: "from-purple-400 to-purple-600", category: "technical" },
  { name: "AI Implementation", level: 88, icon: "fas fa-robot", color: "from-gold-400 to-gold-600", category: "technical" },
  
  // Creative Skills
  { name: "Piano Performance", level: 95, icon: "fas fa-music", color: "from-purple-400 to-pink-600", category: "creative" },
  { name: "UI/UX Design", level: 75, icon: "fas fa-palette", color: "from-pink-400 to-red-600", category: "creative" },
  { name: "Music Composition", level: 92, icon: "fas fa-compose", color: "from-indigo-400 to-purple-600", category: "creative" },
  
  // Soft Skills
  { name: "Problem Solving", level: 95, icon: "fas fa-puzzle-piece", color: "from-orange-400 to-red-600", category: "soft" },
  { name: "Team Leadership", level: 88, icon: "fas fa-users", color: "from-teal-400 to-blue-600", category: "soft" },
  { name: "Client Communication", level: 92, icon: "fas fa-comments", color: "from-green-400 to-teal-600", category: "soft" }
];

interface ProgressBarProps {
  skill: Skill;
  isVisible: boolean;
}

function AnimatedProgressBar({ skill, isVisible }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setProgress(skill.level);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, skill.level]);

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-3">
          <i className={`${skill.icon} text-lg text-gray-300 group-hover:text-white transition-colors`}></i>
          <span className="text-white font-medium">{skill.name}</span>
        </div>
        <span className="text-gold-400 font-semibold">{progress}%</span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out relative`}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveSkills() {
  const [activeCategory, setActiveCategory] = useState<"technical" | "creative" | "soft">("technical");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categories = [
    { key: "technical" as const, label: "Technical", icon: "fas fa-code", color: "text-blue-400" },
    { key: "creative" as const, label: "Creative", icon: "fas fa-palette", color: "text-purple-400" },
    { key: "soft" as const, label: "Soft Skills", icon: "fas fa-heart", color: "text-green-400" }
  ];

  const filteredSkills = skills.filter(skill => skill.category === activeCategory);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gold-400 mb-4">
              Skills & Expertise
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A diverse skillset spanning technology, creativity, and leadership
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 rounded-full p-1 backdrop-blur-sm border border-gray-600">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                    activeCategory === category.key
                      ? 'bg-gold-500 text-gray-900 shadow-lg transform scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <i className={`${category.icon} ${activeCategory === category.key ? 'text-gray-900' : category.color}`}></i>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-600">
            <div className="space-y-6">
              {filteredSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AnimatedProgressBar skill={skill} isVisible={isVisible} />
                </div>
              ))}
            </div>

            {/* Fun Fact */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-gray-700/50 rounded-full px-6 py-3 text-sm text-gray-300">
                <i className="fas fa-lightbulb text-gold-400"></i>
                <span>
                  {activeCategory === "technical" && "Always learning new technologies and frameworks"}
                  {activeCategory === "creative" && "15+ years of musical experience meets modern design"}
                  {activeCategory === "soft" && "NCAA Division I experience built championship mindset"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}