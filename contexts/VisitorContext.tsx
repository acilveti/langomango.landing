import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Language type definition (same as in LanguageSelector)
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Default languages list
export const DEFAULT_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸' },
];

// Referral source type
export type ReferralSource = 'reddit' | 'instagram' | 'facebook' | 'twitter' | 'google' | 'direct' | 'other';

// Context type definition
interface VisitorContextType {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language | null) => void;
  availableLanguages: Language[];
  nativeLanguage: Language | null;
  referralSource: ReferralSource;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (value: boolean) => void;
}

// Create the context
const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

// Provider props
interface VisitorProviderProps {
  children: ReactNode;
  defaultLanguage?: Language | null;
  availableLanguages?: Language[];
}

// Helper function to detect browser language
const detectBrowserLanguage = (): Language | null => {
  if (typeof window === 'undefined') return null;
  
  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Find matching language in our list
  return DEFAULT_LANGUAGES.find(lang => lang.code === langCode) || null;
};

// Helper function to get referral source from URL parameters or document referrer
const detectReferralSource = (): ReferralSource => {
  if (typeof window === 'undefined') return 'direct';
  
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source')?.toLowerCase();
  const ref = urlParams.get('ref')?.toLowerCase();
  
  // Check cookies for referral information
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };
  
  const cookieRef = getCookie('referral_source')?.toLowerCase();
  
  // Check document referrer
  const referrer = document.referrer.toLowerCase();
  
  // Priority: URL params > Cookies > Document referrer
  const source = utmSource || ref || cookieRef || referrer;
  
  if (source.includes('reddit')) return 'reddit';
  if (source.includes('instagram')) return 'instagram';
  if (source.includes('facebook') || source.includes('fb.com')) return 'facebook';
  if (source.includes('twitter') || source.includes('t.co')) return 'twitter';
  if (source.includes('google')) return 'google';
  if (referrer && referrer !== '') return 'other';
  
  return 'direct';
};

// Provider component
export const VisitorProvider: React.FC<VisitorProviderProps> = ({ 
  children, 
  defaultLanguage = null,
  availableLanguages = DEFAULT_LANGUAGES 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(defaultLanguage);
  const [nativeLanguage, setNativeLanguage] = useState<Language | null>(null);
  const [referralSource, setReferralSource] = useState<ReferralSource>('direct');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(false);

  useEffect(() => {
    // Detect native language on mount
    const detectedLang = detectBrowserLanguage();
    setNativeLanguage(detectedLang);
    
    // If no default language is set, use the detected language
    if (!defaultLanguage && detectedLang) {
      setSelectedLanguage(detectedLang);
    }
    
    // Detect referral source
    const source = detectReferralSource();
    setReferralSource(source);
    
    // Store referral source in cookie for persistence
    if (source !== 'direct') {
      document.cookie = `referral_source=${source}; path=/; max-age=2592000`; // 30 days
    }
  }, [defaultLanguage]);

  const value: VisitorContextType = {
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
    nativeLanguage,
    referralSource,
    hasSelectedLanguage,
    setHasSelectedLanguage,
  };

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
};

// Custom hook to use the visitor context
export const useVisitor = () => {
  const context = useContext(VisitorContext);
  
  if (context === undefined) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  
  return context;
};

// Helper function to get language by code
export const getLanguageByCode = (code: string, languages: Language[] = DEFAULT_LANGUAGES): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

// Helper function to get default language
export const getDefaultLanguage = (): Language => {
  return DEFAULT_LANGUAGES.find(lang => lang.code === 'de') || DEFAULT_LANGUAGES[0];
};

// Helper function to set referral source cookie
export const setReferralSourceCookie = (source: ReferralSource): void => {
  if (typeof window !== 'undefined') {
    document.cookie = `referral_source=${source}; path=/; max-age=2592000`; // 30 days
  }
};

// Helper function to get visitor analytics data
export const getVisitorAnalytics = (context: VisitorContextType) => {
  return {
    selectedLanguageCode: context.selectedLanguage?.code || 'none',
    nativeLanguageCode: context.nativeLanguage?.code || 'unknown',
    referralSource: context.referralSource,
    languageMatch: context.selectedLanguage?.code === context.nativeLanguage?.code,
  };
};
