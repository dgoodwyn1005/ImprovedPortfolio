export default function Footer() {
  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#packages", label: "Packages" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#projects", label: "Projects" },
    { href: "#music", label: "Music" },
  ];

  const services = [
    "Web Development",
    "AI Implementation",
    "Piano Performance",
    "Music Instruction",
    "Custom Applications",
  ];

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Deshawn Goodwyn</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Freelance Web Developer, AI Implementation Specialist, and Professional Pianist. Crafting
                digital solutions with the same precision and passion as musical performances.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/dgoodwyn1005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a
                  href="https://linkedin.com/in/deshawngoodwyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                {services.map((service, index) => (
                  <li key={index}>
                    <span className="text-gray-400">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Deshawn Goodwyn. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              All projects available on{" "}
              <a
                href="https://github.com/dgoodwyn1005"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 transition-colors duration-300"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
