// utils/referral.ts

export const REFERRAL_KEY = 'langomango_referral';

/**
 * Captures referral code from URL and stores it in localStorage
 */
export function captureReferral(): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  
  // If there's a referral code in the URL, save it
  if (ref) {
    localStorage.setItem(REFERRAL_KEY, ref);
    console.log('Referral captured:', ref);
  } else{
    console.log('Referral NOT captured:', ref);
  }
}

/**
 * Gets the stored referral code
 * @returns {string|null} The referral code or null if not found
 */
export function getReferral(): string | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(REFERRAL_KEY);
}

/**
 * Adds referral parameter to URL if one exists in localStorage
 * @param {string} url - The URL to add the referral to
 * @returns {string} The URL with referral parameter if applicable
 */
export function addReferralToUrl(url: string): string {
  console.log('pre addReferralToUrl')
  const ref = getReferral();
  if (!ref) return url;
  console.log('addReferralToUrl', ref)
  
  // Check if the URL already has parameters
  const hasParams = url.includes('?');
  const separator = hasParams ? '&' : '?';
  
  console.log(`${url}${separator}ref=${ref}`)
  return `${url}${separator}ref=${ref}`;
}