import { useEffect } from 'react';

interface AdSenseProps {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'square' | 'skyscraper' | 'leaderboard' | 'mobile-banner';
  responsive?: boolean;
  className?: string;
}

const adDimensions = {
  banner: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  square: { width: 250, height: 250 },
  skyscraper: { width: 160, height: 600 },
  leaderboard: { width: 970, height: 90 },
  'mobile-banner': { width: 320, height: 50 },
};

export default function AdSense({ 
  slot = "1234567890", 
  format = "rectangle", 
  responsive = true,
  className = ""
}: AdSenseProps) {
  const dimensions = adDimensions[format];
  
  useEffect(() => {
    try {
      // Initialize Google AdSense
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);
  
  return (
    <div className={`adsense-container ${className}`}>
      {/* Google AdSense Placeholder */}
      <div 
        className="adsense-placeholder"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          color: '#6c757d',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Google AdSense Branding */}
        <div 
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            backgroundColor: '#4285f4',
            color: 'white',
            padding: '1px 4px',
            fontSize: '9px',
            borderRadius: '2px',
            fontWeight: 'bold',
          }}
        >
          AdSense
        </div>
        
        {/* Ad Content Placeholder */}
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ 
            fontSize: '10px', 
            color: '#9ca3af', 
            marginBottom: '4px',
            fontWeight: '500'
          }}>
            Advertisement
          </div>
          <div style={{ 
            width: '60%', 
            height: '20px', 
            backgroundColor: '#e5e7eb', 
            margin: '0 auto 8px',
            borderRadius: '2px'
          }}></div>
          <div style={{ 
            width: '80%', 
            height: '12px', 
            backgroundColor: '#f3f4f6', 
            margin: '0 auto 4px',
            borderRadius: '1px'
          }}></div>
          <div style={{ 
            width: '70%', 
            height: '12px', 
            backgroundColor: '#f3f4f6', 
            margin: '0 auto',
            borderRadius: '1px'
          }}></div>
        </div>
        
        {/* Google Ads Info */}
        <div 
          style={{
            position: 'absolute',
            bottom: '2px',
            left: '2px',
            fontSize: '8px',
            color: '#9ca3af',
          }}
        >
          Ads by Google
        </div>
      </div>
      
      {/* Real AdSense Ad */}
      <ins className="adsbygoogle"
           style={{ display: 'block', width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
           data-ad-client="ca-pub-6050208690938374"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
}