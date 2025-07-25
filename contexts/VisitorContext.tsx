import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Language type definition (same as in LanguageSelector)
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Default languages list - matches backend DataSeeder.cs
export const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { code: 'my', name: 'Burmese', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸' }
];

// Referral source type
export type ReferralSource = 'reddit' | 'instagram' | 'facebook' | 'twitter' | 'google' | 'direct' | 'other';

// Context type definition
interface VisitorContextType {
  selectedLanguage: Language | null;
  selectedLanguageLevel: string | null;
  setSelectedLanguage: (language: Language | null, level?: string | null) => void;
  availableLanguages: Language[];
  nativeLanguage: Language | null;
  referralSource: ReferralSource;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (value: boolean) => void;
  hasSelectedLevel: boolean;
  setHasSelectedLevel: (value: boolean) => void;
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
  
  // Find matching language in our list, default to English if not found
  return DEFAULT_LANGUAGES.find(lang => lang.code === langCode) || 
         DEFAULT_LANGUAGES.find(lang => lang.code === 'en') || 
         null;
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
  const [selectedLanguage, setSelectedLanguageState] = useState<Language | null>(defaultLanguage);
  const [selectedLanguageLevel, setSelectedLanguageLevelState] = useState<string | null>(null);
  const [nativeLanguage, setNativeLanguage] = useState<Language | null>(null);
  const [referralSource, setReferralSource] = useState<ReferralSource>('direct');
  const [hasSelectedLanguage, setHasSelectedLanguageState] = useState<boolean>(false);
  const [hasSelectedLevel, setHasSelectedLevelState] = useState<boolean>(false);

  // Load persisted data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load persisted language preferences
    const persistedData = localStorage.getItem('languagePreferences');
    if (persistedData) {
      try {
        const data = JSON.parse(persistedData);
        console.log('Loading persisted language preferences:', data);
        
        // Restore selected language
        if (data.selectedLanguage) {
          const lang = DEFAULT_LANGUAGES.find(l => l.code === data.selectedLanguage);
          if (lang) {
            setSelectedLanguageState(lang);
            setHasSelectedLanguageState(true);
          }
        }
        
        // Restore selected language level
        if (data.selectedLanguageLevel) {
          setSelectedLanguageLevelState(data.selectedLanguageLevel);
        }
        
        // Restore hasSelectedLevel flag
        if (data.hasSelectedLevel !== undefined) {
          setHasSelectedLevelState(data.hasSelectedLevel);
        }
        
        // Restore native language
        if (data.nativeLanguage) {
          const lang = DEFAULT_LANGUAGES.find(l => l.code === data.nativeLanguage);
          if (lang) {
            setNativeLanguage(lang);
          }
        }
      } catch (e) {
        console.error('Failed to parse persisted language preferences:', e);
      }
    }
    
    // If no persisted native language, detect it
    if (!nativeLanguage) {
      const detectedLang = detectBrowserLanguage();
      setNativeLanguage(detectedLang);
    }
    
    // If no selected language, use German as default
    if (!selectedLanguage && !persistedData) {
      const germanLang = DEFAULT_LANGUAGES.find(lang => lang.code === 'de');
      setSelectedLanguageState(germanLang || DEFAULT_LANGUAGES[0]);
    }
    
    // Detect referral source
    const source = detectReferralSource();
    setReferralSource(source);
    
    // Store referral source in cookie for persistence
    if (source !== 'direct') {
      document.cookie = `referral_source=${source}; path=/; max-age=2592000`; // 30 days
    }
  }, []);

  // Custom setSelectedLanguage that also persists to localStorage
  const setSelectedLanguage = (language: Language | null, level?: string | null) => {
    setSelectedLanguageState(language);
    setSelectedLanguageLevelState(level || null);
    
    // If level is explicitly provided, mark it as selected
    if (level) {
      setHasSelectedLevelState(true);
    }
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const currentData = localStorage.getItem('languagePreferences');
      let data: any = {};
      
      try {
        if (currentData) {
          data = JSON.parse(currentData);
        }
      } catch (e) {
        console.error('Failed to parse existing preferences:', e);
      }
      
      data.selectedLanguage = language?.code || null;
      data.selectedLanguageLevel = level || null;
      data.hasSelectedLevel = level ? true : data.hasSelectedLevel || false;
      if (nativeLanguage) {
        data.nativeLanguage = nativeLanguage.code;
      }
      
      localStorage.setItem('languagePreferences', JSON.stringify(data));
      console.log('Persisted language preferences:', data);
    }
  };
  
  // Custom setHasSelectedLanguage that also persists
  const setHasSelectedLanguage = (value: boolean) => {
    setHasSelectedLanguageState(value);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      const currentData = localStorage.getItem('languagePreferences');
      let data: any = {};
      
      try {
        if (currentData) {
          data = JSON.parse(currentData);
        }
      } catch (e) {
        console.error('Failed to parse existing preferences:', e);
      }
      
      data.hasSelected = value;
      localStorage.setItem('languagePreferences', JSON.stringify(data));
    }
  };

  // Custom setHasSelectedLevel that also persists
  const setHasSelectedLevel = (value: boolean) => {
    setHasSelectedLevelState(value);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      const currentData = localStorage.getItem('languagePreferences');
      let data: any = {};
      
      try {
        if (currentData) {
          data = JSON.parse(currentData);
        }
      } catch (e) {
        console.error('Failed to parse existing preferences:', e);
      }
      
      data.hasSelectedLevel = value;
      localStorage.setItem('languagePreferences', JSON.stringify(data));
    }
  };

  const value: VisitorContextType = {
    selectedLanguage,
    selectedLanguageLevel,
    setSelectedLanguage,
    availableLanguages,
    nativeLanguage,
    referralSource,
    hasSelectedLanguage,
    setHasSelectedLanguage,
    hasSelectedLevel,
    setHasSelectedLevel,
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

// Helper function to get default language (German)
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
    selectedLanguageLevel: context.selectedLanguageLevel || 'none',
    nativeLanguageCode: context.nativeLanguage?.code || 'unknown',
    referralSource: context.referralSource,
    languageMatch: context.selectedLanguage?.code === context.nativeLanguage?.code,
  };
};
