import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import LanguageSelector from 'components/LanguageSelector';
import type { Language } from 'contexts/VisitorContext';
import ReaderDemo from 'components/ReaderDemoModal';
import Portal from 'components/Portal';
import { useReaderDemoModalContext } from 'contexts/ReaderDemoModalContext';
import { useLanguageSelectorModalContext } from 'contexts/LanguageSelectorModalContext';

interface HeroStickyProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  overlayOpacity?: number;
}

const ROTATING_LANGUAGES = [
  { code: 'en', name: 'English', word: 'English', font: 'Georgia, serif' },
  { code: 'es', name: 'Spanish', word: 'Español', font: 'Arial, sans-serif' },
  { code: 'de', name: 'German', word: 'Deutsch', font: 'Helvetica, sans-serif' },
  { code: 'fr', name: 'French', word: 'Français', font: 'Garamond, serif' },
  { code: 'it', name: 'Italian', word: 'Italiano', font: 'Baskerville, serif' },
  { code: 'pt', name: 'Portuguese', word: 'Português', font: 'Verdana, sans-serif' },
  { code: 'nl', name: 'Dutch', word: 'Nederlands', font: 'Arial, sans-serif' },
  { code: 'ru', name: 'Russian', word: 'Русский', font: 'Times New Roman, serif' },
  { code: 'ja', name: 'Japanese', word: '日本語', font: 'MS Mincho, serif' },
  { code: 'zh', name: 'Chinese', word: '中文', font: 'SimSun, serif' },
  { code: 'ko', name: 'Korean', word: '한국어', font: 'Batang, serif' },
  { code: 'ar', name: 'Arabic', word: 'العربية', font: 'Traditional Arabic, serif' },
  { code: 'hi', name: 'Hindi', word: 'हिन्दी', font: 'Devanagari, serif' },
  { code: 'tr', name: 'Turkish', word: 'Türkçe', font: 'Arial, sans-serif' },
  { code: 'pl', name: 'Polish', word: 'Polski', font: 'Arial, sans-serif' },
  { code: 'sv', name: 'Swedish', word: 'Svenska', font: 'Helvetica, sans-serif' }
];

export default function HeroSticky({
  backgroundImage,
  title,
  subtitle,
  overlayOpacity = 0.4
}: HeroStickyProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(2); // Start with German (index 2)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const {isReaderDemoModalOpened, setIsReaderDemoModalOpened} = useReaderDemoModalContext();
  const [hasStartedRotating, setHasStartedRotating] = useState(false);
  const {isLanguageSelectorModalOpened, setIsLanguageSelectorModalOpened} = useLanguageSelectorModalContext();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const secondTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Handle scroll events
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollProgress(scrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Rotate languages effect
  useEffect(() => {
    // Wait 5 seconds before starting rotation
    const startRotationTimer = setTimeout(() => {
      setHasStartedRotating(true);
    }, 5000);

    return () => clearTimeout(startRotationTimer);
  }, []);

  useEffect(() => {
    if (!hasStartedRotating) return;

    // Start rotating every 2 seconds after the initial 5 second delay
    const interval = setInterval(() => {
      setCurrentLanguageIndex((prevIndex) => 
        (prevIndex + 1) % ROTATING_LANGUAGES.length
      );
    }, 2000); // Change language every 2 seconds

    return () => clearInterval(interval);
  }, [hasStartedRotating]);

  // Calculate whether to show the trial text based on scroll position
  const shouldShowTrialText = scrollProgress > 50; // Show text after 50px of scrolling
  
  // Calculate dynamic overlay opacity based on scroll position
  // Start with the initial overlayOpacity and increase to a maximum of 0.8
  const dynamicOverlayOpacity = Math.min(overlayOpacity + (scrollProgress * 0.001), 0.8);

  return (
    <HeroWrapper ref={heroRef}>
      {/* Fixed background image and overlay */}
      <BackgroundContainer>
        <BackgroundImage backgroundImage={backgroundImage} />
        <Overlay opacity={dynamicOverlayOpacity} />
      </BackgroundContainer>
      
      {/* Main content */}
      <ContentWrapper ref={contentRef}>
        <Title>
          You just started to learn 28 words in <LanguageWordContainer>
            <LanguageWord 
              fontFamily={ROTATING_LANGUAGES[currentLanguageIndex].font}
              key={currentLanguageIndex}
            >
              {ROTATING_LANGUAGES[currentLanguageIndex].word}
            </LanguageWord>
          </LanguageWordContainer>
        </Title>
        <Question>What language are you trying to learn now?</Question>
        <LanguageSelector
          onLanguageSelect={(language: Language, level?: string) => {
            console.log('Language selected:', language, 'Level:', level);
            setSelectedLanguage(language);
            // Store the level if needed
            if (level) {
              sessionStorage.setItem('selectedLevel', level);
            }
          }}
          onProcessingComplete={(language: Language, level?: string) => {
            console.log('Processing complete for:', language, 'Level:', level);
            // Open the reader demo modal after processing
            setIsReaderDemoModalOpened(true);
          }}
          placeholder="Select your target language"
          maxWidth="400px"
          isDark={true}
          requireLevel={true}
        />
      </ContentWrapper>
      
      {/* Second title that appears after scrolling */}
      <SecondTitleWrapper visible={shouldShowTrialText} ref={secondTitleRef}>
        <Title>
        </Title>
      </SecondTitleWrapper>
      
      {/* Reader Demo Modal with Signup - Rendered in Portal */}
      {isReaderDemoModalOpened && selectedLanguage && (
        <Portal>
          <ReaderDemo 
            selectedLanguage={selectedLanguage}
            onClose={() => setIsReaderDemoModalOpened(false)}
          />
        </Portal>
      )}
    </HeroWrapper>
  );
}

// Main wrapper that contains everything
const HeroWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// Container for fixed background elements
const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* Changed to negative z-index to ensure it stays behind content */
`;

const BackgroundImage = styled.div<{ backgroundImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Overlay = styled.div<{ opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: ${props => props.opacity};
  transition: opacity 0.3s ease;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10; /* Increased z-index to ensure it's above everything */
  text-align: center;
  padding: 0 2rem;
  margin-top: 70vh; /* Position content 70% down the viewport */
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto; /* Ensure pointer events work */
`;

// Second title with visibility control
const SecondTitleWrapper = styled.div<{ visible: boolean }>`
  position: relative;
  z-index: 10; /* Increased z-index to match ContentWrapper */
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 4rem; /* Add bottom margin to ensure space after this element */
  padding: 0 2rem;
  text-align: center;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translateY(${props => (props.visible ? 0 : '20px')});
  transition: opacity 0.6s ease, transform 0.6s ease;
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
`;

const Title = styled.h1`
  font-size: 4rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  margin: 0 0 2rem 0;
  font-weight: 700;
  letter-spacing: 0.05em;
  
  ${media('<=tablet')} {
    font-size: 3rem;
  }
  
  ${media('<=phone')} {
    font-size: 2.5rem;
  }
`;

const Question = styled.h2`
  font-size: 2rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 0.02em;
  
  ${media('<=tablet')} {
    font-size: 1.75rem;
  }
  
  ${media('<=phone')} {
    font-size: 1.5rem;
  }
`;

const LanguageWordContainer = styled.span`
  display: inline-block;
  width: 200px; /* Fixed width to prevent layout shift */
  text-align: center;
  position: relative;
  margin: 0 0.5rem;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 152, 0, 0.2);
  height: 1.8em;
  line-height: 1.8em;
`;

const LanguageWord = styled.span<{ fontFamily: string }>`
  color: rgb(255, 152, 0);
  font-family: ${props => props.fontFamily};
  font-weight: 700;
  display: inline-block;
  animation: fadeInOut 2s ease-in-out;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  line-height: 1;
  
  @keyframes fadeInOut {
    0% { 
      opacity: 0;
      transform: translate(-50%, -50%) translateY(-10px);
    }
    20%, 80% { 
      opacity: 1;
      transform: translate(-50%, -50%) translateY(0);
    }
    100% { 
      opacity: 0;
      transform: translate(-50%, -50%) translateY(10px);
    }
  }
`;