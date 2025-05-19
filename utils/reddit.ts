// This can be placed in a utility file like 'utils/redditPixel.ts'

interface RedditConversionEvent {
    value?: number;
    currency?: string;
    transaction_id?: string;
    [key: string]: any; // For custom properties
  }
  
  // Initialize Reddit Pixel
  export const initRedditPixel = (pixelId: string): void => {
    if (typeof window === 'undefined') return;
    
    // Check if rdt is already initialized
    if ((window as any).rdt) return;
    
    // Add Reddit Pixel base code
    !function(w: any, d: Document) {
      if (!w.rdt) {
        const p = w.rdt = function() {
          p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
        };
        p.callQueue = [];
        const t = d.createElement("script");
        t.src = "https://www.redditstatic.com/ads/pixel.js";
        t.async = true;
        const s = d.getElementsByTagName("script")[0];
        s.parentNode?.insertBefore(t, s);
      }
    }(window, document);
    
    // Initialize with the pixel ID
    (window as any).rdt('init', pixelId);
    
    // Track default PageVisit event
    (window as any).rdt('track', 'PageVisit');
  };
  
  // Track specific Reddit conversion events
  export const trackRedditConversion = (
    eventType: string, 
    customData?: RedditConversionEvent
  ): void => {
    if (typeof window === 'undefined' || !(window as any).rdt) return;
    
    try {
      (window as any).rdt('track', eventType, customData);
      console.log(`Reddit Pixel: Tracked event ${eventType}`, customData);
    } catch (error) {
      console.error('Reddit Pixel: Error tracking event', error);
    }
  };
  
  // Common event types you might want to track
  export const RedditEventTypes = {
    SIGNUP: 'SignUp',
    VIEW_CONTENT: 'ViewContent',
    ADD_TO_CART: 'AddToCart',
    PURCHASE: 'Purchase',
    LEAD: 'Lead',
    PAGE_VISIT: 'PageVisit',
    CUSTOM: 'Custom' // For custom events
  };