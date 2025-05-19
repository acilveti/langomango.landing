// utils/redditPixel.ts - Enhanced with visibility tracking and time tracking
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
    
    // Initialize time tracking for engagement
    initTimeTracking();
  };
  
  /**
   * Track visibility of a component using Intersection Observer
   * @param elementId The ID of the element to track
   * @param sectionName Name of the section (for reporting)
   * @param threshold Visibility threshold (0-1, default 0.5 means 50% visible)
   * @param trackOnce Only track the first time the element becomes visible (default true)
   */
  export const trackElementVisibility = (
    elementId: string,
    sectionName: string,
    threshold: number = 0.5,
    trackOnce: boolean = true
  ): void => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setupVisibilityObserver(elementId, sectionName, threshold, trackOnce);
      });
    } else {
      setupVisibilityObserver(elementId, sectionName, threshold, trackOnce);
    }
  };
  
  /**
   * Helper function to set up Intersection Observer for visibility tracking
   */
  const setupVisibilityObserver = (
    elementId: string,
    sectionName: string,
    threshold: number,
    trackOnce: boolean
  ): void => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Reddit Pixel: Element with ID "${elementId}" not found for visibility tracking`);
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackRedditConversion(RedditEventTypes.SECTION_VISIBLE, {
              section_name: sectionName,
              visibility_percent: Math.round(entry.intersectionRatio * 100),
              element_id: elementId
            });
            
            if (trackOnce) {
              observer.disconnect();
            }
          }
        });
      },
      { threshold }
    );
    
    observer.observe(element);
  };
  
  /**
   * Initialize time tracking for engagement measurement
   * Tracks events at specific time intervals to measure engagement
   */
  export const initTimeTracking = (): void => {
    if (typeof window === 'undefined') return;
    
    // Track 5-second engagement (reduced bounce rate)
    setTimeout(() => {
      trackRedditConversion(RedditEventTypes.TIME_ON_PAGE, {
        duration: 5,
        duration_unit: 'seconds'
      });
    }, 5000);
    
    // Track 30-second engagement
    setTimeout(() => {
      trackRedditConversion(RedditEventTypes.TIME_ON_PAGE, {
        duration: 30,
        duration_unit: 'seconds'
      });
    }, 30000);
    
    // Track 1-minute engagement
    setTimeout(() => {
      trackRedditConversion(RedditEventTypes.TIME_ON_PAGE, {
        duration: 1,
        duration_unit: 'minutes'
      });
    }, 60000);
    
    // Track 3-minute engagement (high-value visitor)
    setTimeout(() => {
      trackRedditConversion(RedditEventTypes.TIME_ON_PAGE, {
        duration: 3,
        duration_unit: 'minutes',
        high_value: true
      });
    }, 180000);
  };
  
  /**
   * Track all key sections on the page
   * Call this once after the page has loaded to set up visibility tracking for all important sections
   */
  export const setupAllSectionTracking = (): void => {
    // Track all key sections
    trackElementVisibility('hero-section', 'Hero', 0.5, true);
    trackElementVisibility('features-section', 'Features', 0.5, true);
    trackElementVisibility('video-section', 'Video Section', 0.5, true);
    trackElementVisibility('pricing-section', 'Pricing', 0.5, true);
    trackElementVisibility('cta-section-top', 'Top CTA', 0.8, true);
    trackElementVisibility('cta-section-bottom', 'Bottom CTA', 0.8, true);
    trackElementVisibility('faq-section', 'FAQ', 0.5, true);
    
    // You can add more sections as needed
  };