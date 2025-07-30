// Centralized selectors for all tests
export const selectors = {
  // Navigation
  nav: {
    container: 'nav',
    logo: 'nav a[href="/"]',
    ctaButton: 'nav button:has-text("USE DEMO")',
    mobileMenuButton: '[aria-label="Menu"]'
  },

  // Hero Section
  hero: {
    section: '#hero-section',
    stickySection: '#hero-sticky-section',
    title: 'h1',
    subtitle: 'h2',
    readerWidget: '[class*="DemoContainer"]',
    ctaButton: '#hero-section button:has-text("USE DEMO")',
    backgroundImage: '#hero-sticky-section img'
  },

  // Features Section
  features: {
    section: '#features-section',
    gallery: '[class*="FeaturesGallery"]',
    tabs: '[role="tab"]',
    tabPanel: '[role="tabpanel"]',
    featureImage: '[role="tabpanel"] img',
    featureTitle: '[role="tabpanel"] h3',
    featureDescription: '[role="tabpanel"] p'
  },

  // Testimonials Section
  testimonials: {
    section: '#section-1',
    container: '[class*="Testimonials"]',
    card: '[class*="TestimonialCard"]',
    author: '[class*="AuthorName"]',
    company: '[class*="CompanyName"]',
    content: '[class*="TestimonialContent"]',
    avatar: '[class*="Avatar"] img'
  },

  // Pricing Section
  pricing: {
    section: '#pricing-section',
    container: '[class*="PricingTables"]',
    card: '[class*="PricingCard"]',
    price: '[class*="Price"]',
    features: '[class*="FeatureList"] li',
    ctaButton: '[class*="PricingCard"] button'
  },

  // Video Section
  video: {
    section: '#video-section',
    container: '[class*="YoutubeVideo"]',
    iframe: '#video-section iframe',
    title: '#video-section h1'
  },

  // CTA Sections
  cta: {
    sections: ['#cta-section-top', '#cta-section-bottom'],
    button: '[class*="Cta"] button',
    image: '[class*="Cta"] img',
    title: '[class*="Cta"] h2',
    description: '[class*="Cta"] p'
  },

  // FAQ Section
  faq: {
    section: '#faq-section',
    container: '[class*="FaqSection"]',
    items: '[class*="FaqItem"]',
    question: '[class*="Question"]',
    answer: '[class*="Answer"]'
  },

  // Reader Demo Modal
  readerDemo: {
    modal: '[class*="ReaderDemoModal"]',
    closeButton: '[class*="ReaderDemoModal"] [aria-label="Close"]',
    languageSelector: '[class*="LanguageSelector"]',
    content: '[class*="ReaderContent"]',
    levelSelector: '[class*="LevelSelector"]'
  },

  // Common Elements
  common: {
    overlay: '[class*="Overlay"]',
    darkenOverlay: '[class*="PageDarkenOverlay"]',
    loading: '[class*="Loading"]',
    error: '[class*="Error"]'
  }
};

// Helper function to get selector with text
export function withText(selector: string, text: string): string {
  return `${selector}:has-text("${text}")`;
}

// Helper function to get nth element
export function nth(selector: string, index: number): string {
  return `${selector}:nth-of-type(${index})`;
}