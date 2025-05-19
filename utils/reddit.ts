// utils/redditPixel.ts - Updated to work with Next.js Script component approach

// Define types for the Reddit Pixel
declare global {
    interface Window {
      rdt?: (...args: any[]) => void;
    }
  }
  
  // Define interface for event data
  export interface RedditConversionEvent {
    value?: number;
    currency?: string;
    transaction_id?: string;
    [key: string]: any; // For custom properties
  }
  
  /**
   * Gets the Reddit Pixel script code as a string
   * This is used inside a Next.js Script component with dangerouslySetInnerHTML
   */
  export const getRedditPixelScript = (pixelId: string): string => {
    return `
      !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
      rdt('init', '${pixelId}');
    `;
  };
  
  /**
   * Tracks an event using the Reddit Pixel
   * This function is safe to call even if the pixel isn't loaded yet
   */
  export const trackRedditConversion = (
    eventType: string, 
    customData?: RedditConversionEvent
  ): void => {
    if (typeof window === 'undefined' || !window.rdt) return;
    
    try {
      window.rdt('track', eventType, customData);
      console.log(`Reddit Pixel: Tracked event ${eventType}`, customData);
    } catch (error) {
      console.error('Reddit Pixel: Error tracking event', error);
    }
  };
  
  /**
   * Initializes tracking PageVisit event
   * Should be called after the Reddit Pixel script has loaded
   */
  export const trackPageVisit = (): void => {
    trackRedditConversion('PageVisit');
  };
  
  /**
   * Standard Reddit Pixel event types
   */
  export const RedditEventTypes = {
    SIGNUP: 'SignUp',
    VIEW_CONTENT: 'ViewContent',
    ADD_TO_CART: 'AddToCart',
    PURCHASE: 'Purchase',
    LEAD: 'Lead',
    PAGE_VISIT: 'PageVisit',
    CUSTOM: 'Custom' // For custom events
  };