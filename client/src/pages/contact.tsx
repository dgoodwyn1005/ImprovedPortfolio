import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Contact from "@/components/contact";
import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact - Deshawn Goodwyn";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch with Deshawn Goodwyn for web development, AI implementation, piano services, or basketball coaching. Based in Richmond, VA with flexible scheduling.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Let's Work <span className="text-green-400">Together</span>
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Ready to start your project? Have questions about services? Let's connect.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />

      <Footer />
    </div>
  );
}