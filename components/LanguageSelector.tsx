import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Collapse from 'components/Collapse';

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
  autoOpenModal = false
}, ref) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleLanguageSelect(language: Language) {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
    
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
    setIsLanguageDropdownOpen(false);
  };

  // Expose reset function via ref
  useImperativeHandle(ref, () => ({
    resetStates
  }));

  return (
    <LanguageSelectorContainer 
      className={className}
      data-has-selection={!!selectedLanguage}
      maxWidth={maxWidth}
    >
      <LanguageDropdown 
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)} 
        isOpen={isLanguageDropdownOpen}
      >
        <SelectedLanguage>
          {selectedLanguage ? (
            <>
              <LanguageFlag>{selectedLanguage.flag}</LanguageFlag>
              <LanguageName>{selectedLanguage.name}</LanguageName>
              {isProcessing && <ProcessingSpinner />}
              {showConfirmation && !isProcessing && <CheckmarkIcon>✓</CheckmarkIcon>}
            </>
          ) : (
            <PlaceholderText>{placeholder}</PlaceholderText>
          )}
          <ChevronIcon isOpen={isLanguageDropdownOpen}>▼</ChevronIcon>
        </SelectedLanguage>
      </LanguageDropdown>

      <Collapse isOpen={isLanguageDropdownOpen} duration={300}>
        <LanguageList>
          {languages.map((language) => (
            <LanguageOption
              key={language.code}
              isSelected={selectedLanguage?.code === language.code}
              onClick={() => handleLanguageSelect(language)}
            >
              <LanguageFlag>{language.flag}</LanguageFlag>
              <LanguageName>{language.name}</LanguageName>
            </LanguageOption>
          ))}
        </LanguageList>
      </Collapse>

      {/* Processing Message */}
      {showProcessingMessage && isProcessing && selectedLanguage && (
        <ProcessingMessage>
          <ProcessingIcon>⏳</ProcessingIcon>
          <ProcessingText>
            Verification of <strong>{selectedLanguage.name}</strong> availability for you...
          </ProcessingText>
        </ProcessingMessage>
      )}

      {/* Confirmation Message */}
      {showConfirmationMessage && showConfirmation && !isProcessing && selectedLanguage && (
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
`;

const LanguageDropdown = styled.div<{ isOpen: boolean }>`
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgb(255, 152, 0);
    transform: translateY(-2px);
    box-shadow: 0 0 5px rgba(255, 152, 0, 0.2);
  }

  ${(props) =>
    props.isOpen &&
    `
    border-color: rgb(255,152,0);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}

  // Add vibration and border color animation when no language is selected
  ${LanguageSelectorContainer}:not([data-has-selection="true"]) & {
    animation: ${vibrateWithIntervals} 6s infinite, ${borderColorBounce} 3s ease-in-out infinite;
    animation-delay: 2s, 2s;
    
    &:hover {
      animation-play-state: paused, paused;
    }
    
    &:focus {
      animation-play-state: paused, paused;
    }
  }
`;

const SelectedLanguage = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const PlaceholderText = styled.span`
  color: #6b7280;
  font-weight: 400;
  animation: ${placeholderPulse} 2s ease-in-out infinite;
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  color: #6b7280;
  font-size: 0.8rem;

  ${(props) =>
    props.isOpen &&
    `
    transform: rotate(180deg);
  `}
`;

const ProcessingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid rgb(255, 152, 0);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-left: 0.5rem;
`;

const CheckmarkIcon = styled.span`
  color: #22c55e;
  font-size: 1.2rem;
  font-weight: bold;
  margin-left: 0.5rem;
  animation: ${checkmarkBounce} 0.5s ease-out;
`;

const LanguageList = styled.div`
  border: 2px solid rgb(255, 152, 0);
  border-top: none;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background: white;
  max-height: 200px;
  overflow-y: auto;
`;

const LanguageOption = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.isSelected ? 'rgba(255,152,0,0.1)' : 'transparent')};

  &:hover {
    background: rgba(255, 152, 0, 0.05);
    transform: translateX(2px);
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.2rem;
  margin-right: 0.75rem;
`;

const LanguageName = styled.span`
  font-size: 1.2rem;
  font-weight: 400;
`;

const ProcessingMessage = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%);
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 0.5rem;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const ProcessingIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.75rem;
  animation: ${spin} 2s linear infinite;
`;

const ProcessingText = styled.span`
  color: #d97706;
  font-size: 1.1rem;
  line-height: 1.4;
  
  strong {
    font-weight: 600;
  }
`;

const ConfirmationMessage = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 0.5rem;
  animation: ${fadeInUp} 0.5s ease-out, ${pulse} 2s infinite;
`;

const ConfirmationIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.75rem;
  animation: ${checkmarkBounce} 0.6s ease-out 0.2s both;
`;

const ConfirmationText = styled.span`
  color: #059669;
  font-size: 1.1rem;
  line-height: 1.4;
  
  strong {
    font-weight: 600;
  }
`;