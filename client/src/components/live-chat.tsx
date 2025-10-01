import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp?: any;
    CRISP_WEBSITE_ID?: string;
  }
}

export default function LiveChat() {
  useEffect(() => {
    // Initialize Crisp chat widget
    // Replace 'YOUR_CRISP_WEBSITE_ID' with your actual Crisp website ID
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "YOUR_CRISP_WEBSITE_ID";

    // Load Crisp script
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // Configure Crisp
    window.$crisp.push(["safe", true]);
    
    // Optional: Set user data
    window.$crisp.push(["set", "user:nickname", ["Visitor"]]);
    
    // Clean up on unmount
    return () => {
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}

// Alternative: Simple tawk.to integration
export function TawkToChat() {
  useEffect(() => {
    // Replace 'YOUR_TAWK_TO_ID' with your actual Tawk.to property ID
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/YOUR_TAWK_TO_ID/1234567890';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.getElementsByTagName('head')[0].appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src^="https://embed.tawk.to/"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
}