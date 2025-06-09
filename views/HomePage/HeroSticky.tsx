import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import LanguageSelector from 'components/LanguageSelector';
import type { Language } from 'components/LanguageSelector';

interface HeroStickyProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  overlayOpacity?: number;
}

export default function HeroSticky({
  backgroundImage,
  title,
  subtitle,
  overlayOpacity = 0.4
}: HeroStickyProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
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
        <Title>{title}</Title>
        <LanguageSelector
          onLanguageSelect={(language: Language) => {
            console.log('Language selected:', language);
            // You can add additional logic here for when a language is selected
          }}
          onProcessingComplete={(language: Language) => {
            console.log('Processing complete for:', language);
            // You can add logic here for after processing is complete
          }}
          placeholder="Select your target language"
          maxWidth="400px"
          isDark={true}
        />
      </ContentWrapper>
      
      {/* Second title that appears after scrolling */}
      <SecondTitleWrapper visible={shouldShowTrialText} ref={secondTitleRef}>
        <Title>
          And when you finish the free trial, you will have read 30.000
        </Title>
      </SecondTitleWrapper>
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