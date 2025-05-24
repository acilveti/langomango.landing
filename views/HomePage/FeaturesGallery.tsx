import NextImage from 'next/image';
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Collapse from 'components/Collapse';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import SectionTitle from 'components/SectionTitle';
import ThreeLayersCircle from 'components/ThreeLayersCircle';
import { media } from 'utils/media';
import { useTranslation } from 'next-i18next';
import ExpandingButton from 'components/ExpandingButton';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import LanguageRegistrationModal from 'components/LanguageRegistrationModal';

// Define the proper type for objectFit
type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

interface TabItem {
  titleKey: string;
  descriptionKey: string;
  imageUrl: string | null;
  baseColor: string;
  secondColor: string;
  objectFit: ObjectFit | null;
  isLanguageSelector?: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

export default function FeaturesGallery() {
  const { t } = useTranslation();
  const { setIsModalOpened } = useNewsletterModalContext();

  const LANGUAGES: Language[] = [
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

  // State for selected language
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedLanguageForModal, setSelectedLanguageForModal] = useState<Language | null>(null);

  // Define tabs with proper typing
  const TABS: TabItem[] = [
    {
      titleKey: 'features.tabs.smart_assistance.title',
      descriptionKey: 'features.tabs.smart_assistance.description',
      imageUrl: '/feature2.jpeg',
      baseColor: '249,82,120',
      secondColor: '221,9,57',
      objectFit: 'cover' as ObjectFit,
    },
    {
      titleKey: 'features.tabs.instant_translation.title',
      descriptionKey: 'features.tabs.instant_translation.description',
      imageUrl: '/wordwise-text.jpeg',
      baseColor: '57,148,224',
      secondColor: '99,172,232',
      objectFit: 'contain' as ObjectFit,
    },
    {
      titleKey: 'features.tabs.adjustable_language.title',
      descriptionKey: 'features.tabs.adjustable_language.description',
      imageUrl: '/translated-text.jpeg',
      baseColor: '88,193,132',
      secondColor: '124,207,158',
      objectFit: 'contain' as ObjectFit,
    },
    {
      titleKey: 'features.tabs.language_selector.title',
      descriptionKey: 'features.tabs.language_selector.description',
      imageUrl: null,
      baseColor: '255,152,0',
      secondColor: '255,193,7',
      objectFit: null,
      isLanguageSelector: true,
    },
    {
      titleKey: 'features.tabs.fourth_feature.title',
      descriptionKey: 'features.tabs.fourth_feature.description',
      imageUrl: null,
      baseColor: '156,39,176',
      secondColor: '186,104,200',
      objectFit: null,
    },
  ];

  // Map translation keys to translated content
  const translatedTabs = TABS.map((tab) => ({
    ...tab,
    title: tab.isLanguageSelector ? 'At this point you will experience how you are learning by the exposure' : t(tab.titleKey),
    description: tab.isLanguageSelector
      ? '<p>What language are you trying to learn now?.</p>'
      : `<p>${t(tab.descriptionKey)}</p>`,
  }));

  const [currentTab, setCurrentTab] = useState(translatedTabs[0]);

  const featuresMarkup = translatedTabs.map((singleTab, idx) => {
    const isActive = singleTab.title === currentTab.title;
    const isFirst = idx === 0;

    return (
      <FeatureItem key={singleTab.title}>
        <Tab isActive={isActive} onClick={() => handleTabClick(idx)}>
          <TabTitleContainer>
            <CircleContainer>
              <ThreeLayersCircle baseColor={isActive ? 'transparent' : singleTab.baseColor} secondColor={singleTab.secondColor} />
            </CircleContainer>
            <h4>{singleTab.title}</h4>
          </TabTitleContainer>
          <Collapse isOpen={true} duration={300}>
            <TabContent>
              <div dangerouslySetInnerHTML={{ __html: singleTab.description }}></div>

              {/* Language selector for the language tab */}
              {singleTab.isLanguageSelector && (
                <LanguageSelector data-has-selection={!!selectedLanguage}>
                  <LanguageDropdown onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)} isOpen={isLanguageDropdownOpen}>
                    <SelectedLanguage>
                      {selectedLanguage ? (
                        <>
                          <LanguageFlag>{selectedLanguage.flag}</LanguageFlag>
                          <LanguageName>{selectedLanguage.name}</LanguageName>
                          {isProcessing && <ProcessingSpinner />}
                          {showConfirmation && !isProcessing && <CheckmarkIcon>✓</CheckmarkIcon>}
                        </>
                      ) : (
                        <PlaceholderText>Select a language</PlaceholderText>
                      )}
                      <ChevronIcon isOpen={isLanguageDropdownOpen}>▼</ChevronIcon>
                    </SelectedLanguage>
                  </LanguageDropdown>

                  <Collapse isOpen={isLanguageDropdownOpen} duration={300}>
                    <LanguageList>
                      {LANGUAGES.map((language) => (
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

                  {/* Processing/Confirmation Message */}
                  {isProcessing && selectedLanguage && (
                    <ProcessingMessage>
                      <ProcessingIcon>⏳</ProcessingIcon>
                      <ProcessingText>
                        Setting up <strong>{selectedLanguage.name}</strong> for you...
                      </ProcessingText>
                    </ProcessingMessage>
                  )}

                  {/* Confirmation Message */}
                  {showConfirmation && !isProcessing && selectedLanguage && (
                    <ConfirmationMessage>
                      <ConfirmationIcon>🎉</ConfirmationIcon>
                      <ConfirmationText>
                        Great choice! <strong>{selectedLanguage.name}</strong> is now available for your learning journey.
                      </ConfirmationText>
                    </ConfirmationMessage>
                  )}
                </LanguageSelector>
              )}
            </TabContent>
          </Collapse>
        </Tab>

        {/* Show image for tabs that have imageUrl and objectFit */}
        {singleTab.imageUrl && singleTab.objectFit && (
          <ImageContainer>
            <NextImage src={singleTab.imageUrl} alt={singleTab.title} layout="fill" objectFit={singleTab.objectFit} priority={isFirst} />
          </ImageContainer>
        )}
      </FeatureItem>
    );
  });

  function handleTabClick(idx: number) {
    setCurrentTab(translatedTabs[idx]);
  }

  function handleLanguageSelect(language: Language) {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
    
    // Start processing
    setIsProcessing(true);
    setShowConfirmation(false);
    
    // Simulate processing time (1.2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
      
      // After showing confirmation for 1.5 seconds, open the language modal
      setTimeout(() => {
        setSelectedLanguageForModal(language);
        setIsLanguageModalOpen(true);
      }, 1500);
    }, 1200);
    
    console.log('Selected language:', language);
  }

  return (
    <FeaturesGalleryWrapper>
      <Content>
        <OverTitle>{t('features.overTitle')}</OverTitle>
        <SectionTitle>{t('features.title')}</SectionTitle>
      </Content>
      <FeaturesContainer>{featuresMarkup}</FeaturesContainer>
      
      {/* Language Registration Modal */}
      {isLanguageModalOpen && selectedLanguageForModal && (
        <LanguageRegistrationModal
          selectedLanguage={selectedLanguageForModal}
          onClose={() => {
            setIsLanguageModalOpen(false);
            setSelectedLanguageForModal(null);
            // Reset the confirmation states
            setShowConfirmation(false);
            setIsProcessing(false);
          }}
          onSuccess={() => {
            setIsLanguageModalOpen(false);
            setSelectedLanguageForModal(null);
            setShowConfirmation(false);
            setIsProcessing(false);
          }}
        />
      )}
    </FeaturesGalleryWrapper>
  );
}

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

// New CTA animations - Vibration based
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

const subtleGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 152, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);
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
const FeaturesGalleryWrapper = styled(Container)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4rem;
  gap: 3rem;

  ${media('<=desktop')} {
    gap: 2rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Content = styled.div`
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
  text-align: left;
  width: 100%;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.8rem;
  border: 2px solid #d1d5db;
  background: #f3f4f6;
  padding: 10px;
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  width: 100%;

  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: calc((9 / 16) * 100%);
  }

  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  background: rgb(var(--cardBackground));
  box-shadow: var(--shadow-md);
  cursor: pointer;
  border-radius: 0.6rem;
  transition: opacity 0.2s;

  font-size: 1.6rem;
  font-weight: bold;
`;

const TabTitleContainer = styled.div`
  display: flex;
  align-items: center;

  h4 {
    flex: 1;
    text-align: left;
    margin: 0;
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: normal;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  padding-left: calc(5rem + 1.5rem);

  ${media('<=tablet')} {
    padding-left: calc(4rem + 1.25rem);
  }

  p {
    font-weight: normal;
  }
`;

const CircleContainer = styled.div`
  flex: 0 calc(5rem + 1.5rem);

  ${media('<=tablet')} {
    flex: 0 calc(4rem + 1.25rem);
  }
`;

const LanguageSelector = styled.div`
  margin-top: 1.5rem;
  max-width: 300px;
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
  ${LanguageSelector}:not([data-has-selection="true"]) & {
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

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;