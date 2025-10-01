import { useEffect } from "react";

interface SEOStructuredDataProps {
  type: "WebSite" | "LocalBusiness" | "PerformingGroup" | "Person";
  data: any;
}

export default function SEOStructuredData({ type, data }: SEOStructuredDataProps) {
  useEffect(() => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(baseData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [type, data]);

  return null;
}

// Common structured data configurations
export const homePageStructuredData = {
  type: "Person" as const,
  data: {
    name: "Deshawn Goodwyn",
    alternateName: "Deshawn Goodwyn - Web, AI, & Music Solutions",
    jobTitle: ["Web Developer", "AI Implementation Specialist", "Professional Pianist"],
    url: "https://deshawngoodwyn.com",
    telephone: "(804) 505-9668",
    email: "contactme.dkg@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Richmond",
      addressRegion: "VA",
      addressCountry: "US"
    },
    sameAs: [
      "https://www.linkedin.com/in/deshawngoodwyn",
      "https://github.com/dgoodwyn1005"
    ],
    knowsAbout: [
      "Web Development",
      "AI Implementation", 
      "Business Automation",
      "Piano Performance",
      "Wedding Music"
    ],
    worksFor: {
      "@type": "LocalBusiness",
      "name": "Deshawn Goodwyn - Web, AI, & Music Solutions",
      "url": "https://deshawngoodwyn.com",
      "telephone": "(804) 505-9668",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Richmond",
        "addressRegion": "VA",
        "addressCountry": "US"
      }
    }
  }
};

export const aiServicesStructuredData = {
  type: "LocalBusiness" as const,
  data: {
    name: "Deshawn Goodwyn - Web, AI, & Music Solutions",
    alternateName: "Deshawn Goodwyn — AI & Web Implementation",
    areaServed: "Richmond, VA",
    url: "https://deshawngoodwyn.com/ai",
    telephone: "(804) 505-9668",
    email: "contactme.dkg@gmail.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Richmond",
      addressRegion: "VA",
      addressCountry: "US"
    },
    sameAs: [
      "https://www.linkedin.com/in/deshawngoodwyn",
      "https://github.com/dgoodwyn1005"
    ],
    serviceOffer: "AI chatbots, Zapier automation, web development",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "15"
    }
  }
};

export const musicServicesStructuredData = {
  type: "PerformingGroup" as const,
  data: {
    name: "Deshawn Goodwyn - Web, AI, & Music Solutions",
    alternateName: "Deshawn Goodwyn — Pianist",
    areaServed: "Richmond, VA",
    url: "https://deshawngoodwyn.com/music",
    telephone: "(804) 505-9668",
    email: "contactme.dkg@gmail.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Richmond",
      addressRegion: "VA",
      addressCountry: "US"
    },
    genre: ["Classical", "Contemporary", "Wedding Music", "Jazz"],
    sameAs: [
      "https://www.linkedin.com/in/deshawngoodwyn"
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "12"
    }
  }
};