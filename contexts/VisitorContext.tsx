import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Context type definition
interface VisitorContextType {
  selectedLanguage: Language | null;
  setSelectedLanguage: (language: Language | null) => void;
  availableLanguages: Language[];
}

// Create the context
const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

// Provider props
interface VisitorProviderProps {
  children: ReactNode;
  defaultLanguage?: Language | null;
  availableLanguages?: Language[];
}

// Provider component
export const VisitorProvider: React.FC<VisitorProviderProps> = ({ 
  children, 
  defaultLanguage = null,
  availableLanguages = DEFAULT_LANGUAGES 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(defaultLanguage);

  const value: VisitorContextType = {
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
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
