import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useVisitor } from 'contexts/VisitorContext';
import dynamic from 'next/dynamic';

// Use Next.js dynamic import for SSR compatibility
const LanguageSelectorModal = dynamic(
  () => import('./LanguageSelectorModal'),
  { 
    ssr: false, // This prevents the modal from being rendered on the server
    loading: () => null // No loading indicator needed
  }
);

// Define the proper type for objectFit
type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages?: Language[];
  onLanguageSelect: (language: Language) => void;
  onProcessingComplete?: (language: Language) => void;
  placeholder?: string;
  processingDuration?: number;
  confirmationDuration?: number;
  showProcessingMessage?: boolean;
  showConfirmationMessage?: boolean;
  className?: string;
  maxWidth?: string;
  autoOpenModal?: boolean;
  isDark?: boolean;
}

interface LanguageSelectorRef {
  resetStates: () => void;
}

const DEFAULT_LANGUAGES: Language[] = [
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

const LanguageSelector = forwardRef<LanguageSelectorRef, LanguageSelectorProps>(({
  languages = DEFAULT_LANGUAGES,
  onLanguageSelect,
  onProcessingComplete,
  placeholder = "Select a language",
  processingDuration = 1200,
  confirmationDuration = 1500,
  showProcessingMessage = true,
  showConfirmationMessage = true,
  className,
  maxWidth = "300px",
  autoOpenModal = false,
  isDark = false
}, ref) => {
  const { selectedLanguage: contextLanguage, setSelectedLanguage: setContextLanguage, hasSelectedLanguage, setHasSelectedLanguage } = useVisitor();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(contextLanguage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sync with context when it changes
  useEffect(() => {
    setSelectedLanguage(contextLanguage);
  }, [contextLanguage]);

  function handleLanguageSelect(language: Language) {
    setSelectedLanguage(language);
    setContextLanguage(language); // Update context
    setHasSelectedLanguage(true); // Mark that user has selected a language
    setIsModalOpen(false);
    
    // Call the immediate callback
    onLanguageSelect(language);
    
    // Start processing
    setIsProcessing(true);
    setShowConfirmation(false);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
      
      // After showing confirmation, call the completion callback
      setTimeout(() => {
        if (onProcessingComplete) {
          onProcessingComplete(language);
        }
      }, confirmationDuration);
    }, processingDuration);
  }

  // Reset states (useful for external control)
  const resetStates = () => {
    setShowConfirmation(false);
    setIsProcessing(false);
    setSelectedLanguage(null);
    setIsModalOpen(false);
  };

  // Expose reset function via ref
  useImperativeHandle(ref, () => ({
    resetStates
  }));

  return (
    <LanguageSelectorContainer 
      className={`language-selector-container ${className || ''}`}
      data-has-selection={hasSelectedLanguage}
      maxWidth={maxWidth}
    >
      <LanguageDropdown
        onClick={() => setIsModalOpen(true)}
        isDark={isDark}
      >
        <SelectedLanguage>
          {selectedLanguage && hasSelectedLanguage ? (
            <>
              <SelectedLanguageFlag>{selectedLanguage.flag}</SelectedLanguageFlag>
              <SelectedLanguageName isDark={isDark}>{selectedLanguage.name}</SelectedLanguageName>
              {isProcessing && <ProcessingSpinner />}
              {showConfirmation && !isProcessing && <CheckmarkIcon>✓</CheckmarkIcon>}
            </>
          ) : (
            <PlaceholderText isDark={isDark}>{placeholder}</PlaceholderText>
          )}
          <ChevronIcon isDark={isDark}>▼</ChevronIcon>
        </SelectedLanguage>
      </LanguageDropdown>

      {/* Language Selection Modal */}
      <LanguageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={handleLanguageSelect}
        isDark={isDark}
        hasUserSelected={hasSelectedLanguage}
      />

      {/* Processing Message */}
      {showProcessingMessage && isProcessing && selectedLanguage && hasSelectedLanguage && (
        <ProcessingMessage>
          <ProcessingIcon>⏳</ProcessingIcon>
          <ProcessingText>
            Verification of <strong>{selectedLanguage.name}</strong> availability for you...
          </ProcessingText>
        </ProcessingMessage>
      )}

      {/* Confirmation Message */}
      {showConfirmationMessage && showConfirmation && !isProcessing && selectedLanguage && hasSelectedLanguage && (
        <ConfirmationMessage>
          <ConfirmationIcon>🎉</ConfirmationIcon>
          <ConfirmationText>
            Great choice! <strong>{selectedLanguage.name}</strong> is available for your learning journey.
          </ConfirmationText>
        </ConfirmationMessage>
      )}
    </LanguageSelectorContainer>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;

// Export types for external use
export type { Language, LanguageSelectorProps, LanguageSelectorRef };

// Animations
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const checkmarkBounce = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
`;

const vibrateWithIntervals = keyframes`
  /* First vibration burst at start */
  0%, 2% { transform: translateX(0); }
  2.5% { transform: translateX(-2px); }
  3% { transform: translateX(2px); }
  3.5% { transform: translateX(-2px); }
  4% { transform: translateX(2px); }
  4.5% { transform: translateX(-1px); }
  5% { transform: translateX(1px); }
  5.5% { transform: translateX(0); }
  
  /* Rest period */
  6%, 25% { transform: translateX(0); }
  
  /* Second vibration burst */
  25.5% { transform: translateX(-2px); }
  26% { transform: translateX(2px); }
  26.5% { transform: translateX(-2px); }
  27% { transform: translateX(2px); }
  27.5% { transform: translateX(-1px); }
  28% { transform: translateX(1px); }
  28.5% { transform: translateX(0); }
  
  /* Rest period */
  29%, 50% { transform: translateX(0); }
  
  /* Third vibration burst */
  50.5% { transform: translateX(-2px); }
  51% { transform: translateX(2px); }
  51.5% { transform: translateX(-2px); }
  52% { transform: translateX(2px); }
  52.5% { transform: translateX(-1px); }
  53% { transform: translateX(1px); }
  53.5% { transform: translateX(0); }
  
  /* Long rest until cycle repeats */
  54%, 100% { transform: translateX(0); }
`;

const borderColorBounce = keyframes`
  0%, 100% {
    border-color: #e5e7eb;
  }
  25% {
    border-color: rgb(255, 152, 0);
  }
  50% {
    border-color: #000000;
  }
  75% {
    border-color: rgb(255, 152, 0);
  }
`;

const placeholderPulse = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;

// Styled Components
const LanguageSelectorContainer = styled.div<{ maxWidth: string }>`
  max-width: ${props => props.maxWidth};
  position: relative;
  /* Ensure messages don't affect container height */
  min-height: 60px;
  /* Allow overflow for messages and dropdown */
  overflow: visible;
`;

const LanguageDropdown = styled.div<{ isDark?: boolean }>`
  border: 2px solid ${props => props.isDark ? 'transparent' : '#e5e7eb'};
  border-radius: 0.5rem;
  background: ${props => props.isDark ? 'rgb(255, 152, 0)' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  ${props => props.isDark && `
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `}

  &:hover {
    border-color: ${props => props.isDark ? 'transparent' : 'rgb(255, 152, 0)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.isDark 
      ? '0 8px 16px rgba(0, 0, 0, 0.2)' 
      : '0