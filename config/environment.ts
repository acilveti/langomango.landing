/**
 * Centralized environment configuration
 * This file provides typed access to all environment variables used in the application
 */

export interface EnvironmentConfig {
  // Site metadata
  siteName: string;
  ogImagesUrl: string;
  
  // API URLs
  apiUrl: string;
  appUrl: string;
  landingUrl: string;
  
  // Optional ngrok URL for local development
  ngrokUrl?: string;
  
  // Third-party URLs
  mailchimpSubscribeUrl: string;
  
  // Environment type
  environment: 'development' | 'staging' | 'production';
  
  // Feature flags
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

/**
 * Get the current environment type
 */
function getEnvironment(): 'development' | 'staging' | 'production' {
  // Check NEXT_PUBLIC_ENV first (explicit environment setting)
  if (process.env.NEXT_PUBLIC_ENV === 'production') return 'production';
  if (process.env.NEXT_PUBLIC_ENV === 'staging') return 'staging';
  if (process.env.NEXT_PUBLIC_ENV === 'development') return 'development';
  
  // Fallback to NODE_ENV
  if (process.env.NODE_ENV === 'production') return 'production';
  if (process.env.NODE_ENV === 'development') return 'development';
  
  // Default to development
  return 'development';
}

/**
 * Get the API URL based on environment and configuration
 */
function getApiUrl(): string {
  const env = getEnvironment();
  
  // Check for explicit API URL first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In development, check for ngrok URL
  if (env === 'development' && process.env.NEXT_PUBLIC_API_URL_NGROK) {
    return process.env.NEXT_PUBLIC_API_URL_NGROK;
  }
  
  // Default URLs by environment
  const defaults = {
    development: 'http://localhost:8080',
    staging: 'https://staging.langomango.com',
    production: 'https://api.langomango.com'
  };
  
  return defaults[env];
}

/**
 * Get the frontend app URL (platform)
 */
function getAppUrl(): string {
  const env = getEnvironment();
  
  // Check for explicit app URL first
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Default URLs by environment
  const defaults = {
    development: 'http://localhost:3001',
    staging: 'https://beta-app.langomango.com',
    production: 'https://app.langomango.com'
  };
  
  return defaults[env];
}

/**
 * Get the landing page URL
 */
function getLandingUrl(): string {
  const env = getEnvironment();
  
  // Check for explicit landing URL first
  if (process.env.NEXT_PUBLIC_LANDING_URL) {
    return process.env.NEXT_PUBLIC_LANDING_URL;
  }
  
  // Default URLs by environment
  const defaults = {
    development: 'http://localhost:3000',
    staging: 'https://staging-landing.langomango.com',
    production: 'https://langomango.com'
  };
  
  return defaults[env];
}

/**
 * Main environment configuration object
 */
export const config: EnvironmentConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'LangoMango',
  ogImagesUrl: process.env.NEXT_PUBLIC_OG_IMAGES_URL || `${getLandingUrl()}/og-images/`,
  apiUrl: getApiUrl(),
  appUrl: getAppUrl(),
  landingUrl: getLandingUrl(),
  ngrokUrl: process.env.NEXT_PUBLIC_API_URL_NGROK,
  mailchimpSubscribeUrl: process.env.NEXT_PUBLIC_MAILCHIMP_SUBSCRIBE_URL || 'https://bstefanski.us5.list-manage.com/subscribe/post?u=66b4c22d5c726ae22da1dcb2e&id=679fb0eec9',
  environment: getEnvironment(),
  isDevelopment: getEnvironment() === 'development',
  isStaging: getEnvironment() === 'staging',
  isProduction: getEnvironment() === 'production',
};

/**
 * Helper function to get base URL for API calls
 * Handles ngrok URLs and localhost replacements for development
 */
export function getBaseApiUrl(): string {
  let baseUrl = config.apiUrl;
  
  // In development, if using an IP address, replace with localhost
  if (config.isDevelopment && 
      (baseUrl.includes('192.168.') || 
       baseUrl.includes('10.0.') || 
       baseUrl.includes('172.16.'))) {
    const portMatch = baseUrl.match(/:(\d+)/);
    const port = portMatch ? portMatch[1] : '8080';
    baseUrl = `http://localhost:${port}`;
  }
  
  // Ensure trailing slash
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

// Export for debugging (only in development)
if (config.isDevelopment && typeof window !== 'undefined') {
  (window as any).__ENV_CONFIG__ = config;
}