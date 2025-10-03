import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";
import logoImage from "@assets/FreelanceProfileImage_1754945363617.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // Update active section
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || "";
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-md" : "bg-gray-900/90 backdrop-blur-md"
      } border-b border-gray-700`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Deshawn Goodwyn"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-xl font-bold text-gold-400">Deshawn Goodwyn</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-2 py-2 text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-gold-400"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Portfolio CTA */}
              <Link
                to="/contact"
                className="bg-gold-400 text-gray-900 hover:bg-gold-500 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-gold-400 focus:outline-none"
            >
              <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-gray-800 border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-gold-400 hover:bg-gray-700 rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
