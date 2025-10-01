// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = "G-0GLCE0R1RH";

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', 'G-0GLCE0R1RH', {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Specific funnel tracking events
export const trackLeadMagnetSubmit = (leadMagnetType: 'ai' | 'music') => {
  trackEvent('lead_magnet_submit', 'conversion', leadMagnetType);
  
  // Facebook Pixel tracking (if available)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      content_name: leadMagnetType === 'ai' ? 'AI Starter Kit' : 'Wedding Music Planner',
      content_category: leadMagnetType
    });
  }
};

export const trackBookCallClick = (serviceType: 'ai' | 'music', source: string) => {
  trackEvent('book_call_click', 'engagement', `${serviceType}_${source}`);
  
  // Google Ads conversion tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'GOOGLE_ADS_CONVERSION_ID/CONVERSION_LABEL', // Replace with actual values
      'event_callback': () => {
        console.log('Conversion tracked');
      }
    });
  }
};

export const trackContactSubmit = (source: string) => {
  trackEvent('contact_submit', 'conversion', source);
  
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Contact');
  }
};

export const trackPackageView = (packageName: string, serviceType: 'ai' | 'music') => {
  trackEvent('package_view', 'engagement', `${serviceType}_${packageName}`);
};

export const trackNavigation = (destination: string) => {
  trackEvent('navigation', 'engagement', destination);
};

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  const pixelId = 'YOUR_FACEBOOK_PIXEL_ID'; // Replace with actual pixel ID
  
  const script = document.createElement('script');
  script.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
};

// Initialize Google Tag Manager (optional)
export const initGTM = () => {
  const gtmId = 'GTM-XXXXXXX'; // Replace with actual GTM ID
  
  const script = document.createElement('script');
  script.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(script);
};