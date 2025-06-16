import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Collapse from 'components/Collapse';
import { useVisitor } from 'contexts/VisitorContext';

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
  const { selectedLanguage: contextLanguage, setSelectedLanguage: setContextLanguage } = useVisitor();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(contextLanguage);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Sync with context when it changes
  useEffect(() => {
    setSelectedLanguage(contextLanguage);
  }, [contextLanguage]);

  function handleLanguageSelect(language: Language) {
    setSelectedLanguage(language);
    setContextLanguage(language); // Update context
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
        isDark={isDark}
      >
        <SelectedLanguage>
          {selectedLanguage ? (
            <>
              <LanguageFlag>{selectedLanguage.flag}</LanguageFlag>
              <LanguageName isDark={isDark}>{selectedLanguage.name}</LanguageName>
              {isProcessing && <ProcessingSpinner />}
              {showConfirmation && !isProcessing && <CheckmarkIcon>✓</CheckmarkIcon>}
            </>
          ) : (
            <PlaceholderText isDark={isDark}>{placeholder}</PlaceholderText>
          )}
          <ChevronIcon isOpen={isLanguageDropdownOpen} isDark={isDark}>▼</ChevronIcon>
        </SelectedLanguage>
      </LanguageDropdown>

      <Collapse isOpen={isLanguageDropdownOpen} duration={300}>
        <LanguageList isDark={isDark}>
          {languages.map((language) => (
            <LanguageOption
              key={language.code}
              isSelected={selectedLanguage?.code === language.code}
              onClick={() => handleLanguageSelect(language)}
              isDark={isDark}
            >
              <LanguageFlag>{language.flag}</LanguageFlag>
              <LanguageName isDark={isDark}>{language.name}</LanguageName>
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
  /* Ensure messages don't affect container height */
  min-height: 60px;
  /* Allow overflow for messages */
  overflow: visible;
`;

const LanguageDropdown = styled.div<{ isOpen: boolean; isDark?: boolean }>`
  border: 2px solid ${props => props.isDark ? 'transparent' : '#e5e7eb'};
  border-radius: 0.5rem;
  background: ${props => props.isDark ? 'rgb(255, 152, 0)' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  ${props => props.isDark && `
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `}

  &:hover {
    border-color: ${props => props.isDark ? 'transparent' : 'rgb(255, 152, 0)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.isDark 
      ? '0 8px 16px rgba(0, 0, 0, 0.2)' 
      : '0 0 5px rgba(255, 152, 0, 0.2)'};
    ${props => props.isDark && `
      background: rgb(255, 162, 0);
    `}
  }

  ${(props) =>
    props.isOpen &&
    `
    border-color: ${props.isDark ? 'transparent' : 'rgb(255,152,0)'};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}

  // Add vibration and border color animation when no language is selected
  ${LanguageSelectorContainer}:not([data-has-selection="true"]) & {
    ${props => props.isDark 
      ? css`
          animation: ${vibrateWithIntervals} 6s infinite;
          animation-delay: 2s;
        `
      : css`
          animation: ${vibrateWithIntervals} 6s infinite, ${borderColorBounce} 3s ease-in-out infinite;
          animation-delay: 2s, 2s;
        `
    }
    
    &:hover {
      animation-play-state: ${props => props.isDark ? 'paused' : 'paused, paused'};
    }
    
    &:focus {
      animation-play-state: ${props => props.isDark ? 'paused' : 'paused, paused'};
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

const PlaceholderText = styled.span<{ isDark?: boolean }>`
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'};
  font-weight: ${props => props.isDark ? '500' : '400'};
  animation: ${placeholderPulse} 2s ease-in-out infinite;
`;

const ChevronIcon = styled.span<{ isOpen: boolean; isDark?: boolean }>`
  transition: transform 0.2s ease;
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'};
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

const LanguageList = styled.div<{ isDark?: boolean }>`
  border: 2px solid ${props => props.isDark ? 'transparent' : 'rgb(255, 152, 0)'};
  border-top: none;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  background: ${props => props.isDark ? 'rgba(0, 0, 0, 0.9)' : 'white'};
  max-height: 200px;
  overflow-y: auto;
  ${props => props.isDark && `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `}

  /* Custom scrollbar for dark mode */
  ${props => props.isDark && `
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 152, 0, 0.5);
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 152, 0, 0.7);
    }
  `}
`;

const LanguageOption = styled.div<{ isSelected: boolean; isDark?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => {
    if (props.isSelected) {
      return props.isDark ? 'rgba(255,152,0,0.3)' : 'rgba(255,152,0,0.1)';
    }
    return 'transparent';
  }};
  color: ${props => props.isDark ? 'white' : 'inherit'};

  &:hover {
    background: ${props => props.isDark ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.05)'};
    transform: translateX(2px);
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.2rem;
  margin-right: 0.75rem;
`;

const LanguageName = styled.span<{ isDark?: boolean }>`
  font-size: 1.2rem;
  font-weight: ${props => props.isDark ? '500' : '400'};
  color: ${props => props.isDark ? 'white' : 'inherit'};
`;

const ProcessingMessage = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.9) 0%, rgba(255, 152, 0, 0.8) 100%);
  border: 1px solid rgba(255, 152, 0, 1);
  border-radius: 0.5rem;
  animation: ${fadeInUp} 0.5s ease-out;
  z-index: 10;
  white-space: nowrap;
  min-width: max-content;
`;

const ProcessingIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.75rem;
  animation: ${spin} 2s linear infinite;
`;

const ProcessingText = styled.span`
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1.4;
  opacity: 1;
  
  strong {
    font-weight: 600;
    color: #ffffff;
    opacity: 1;
  }
`;

const ConfirmationMessage = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.8) 100%);
  border: 1px solid rgba(34, 197, 94, 1);
  border-radius: 0.5rem;
  animation: ${fadeInUp} 0.5s ease-out, ${pulse} 2s infinite;
  z-index: 10;
  white-space: nowrap;
  min-width: max-content;
`;

const ConfirmationIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.75rem;
  animation: ${checkmarkBounce} 0.6s ease-out 0.2s both;
`;

const ConfirmationText = styled.span`
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1.4;
  opacity: 1;
  
  strong {
    font-weight: 600;
    color: #ffffff;
    opacity: 1;
  }
`;