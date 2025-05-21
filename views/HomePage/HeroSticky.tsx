import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import AnimatedButton from './animatedButton';

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
  const [heroHeight, setHeroHeight] = useState('100vh');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const secondTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Set initial height
    const setInitialHeight = () => {
      const height = window.innerHeight;
      setHeroHeight(`${height}px`);
      
      // Calculate content height including the second title
      if (contentRef.current && secondTitleRef.current) {
        const contentHeight = contentRef.current.offsetHeight + secondTitleRef.current.offsetHeight + 40; // Add some padding
        setContentHeight(contentHeight);
      }
    };

    // Set height on component mount
    setInitialHeight();

    // Handle scroll events
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollProgress(scrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', setInitialHeight);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', setInitialHeight);
    };
  }, []);

  // Calculate whether to show the trial text based on scroll position
  const shouldShowTrialText = scrollProgress > 50; // Show text after 50px of scrolling
  
  // Calculate dynamic overlay opacity based on scroll position
  // Start with the initial overlayOpacity and increase to a maximum of 0.8
  const dynamicOverlayOpacity = Math.min(overlayOpacity + (scrollProgress * 0.001), 0.8);

  return (
    <HeroContainer height={heroHeight} contentHeight={contentHeight} ref={heroRef}>
      {/* Fixed background image and overlay */}
      <BackgroundImage backgroundImage={backgroundImage} />
      <Overlay opacity={dynamicOverlayOpacity} />
      
      {/* Scrollable content */}
      <ContentWrapper ref={contentRef}>
        <Title>{title}</Title>
        <ScrollIndicator>
          <AnimatedButton>Free Trial</AnimatedButton>
        </ScrollIndicator>
      </ContentWrapper>
      
      {/* Second title that appears after scrolling */}
      <SecondTitleWrapper visible={shouldShowTrialText} ref={secondTitleRef}>
        <Title>
          And when you finish the free trial, you will have read 30.000
        </Title>
      </SecondTitleWrapper>
    </HeroContainer>
  );
}

// Updated HeroContainer to account for content height
const HeroContainer = styled.div<{ height: string; contentHeight: number }>`
  position: relative;
  min-height: ${props => `calc(${props.height} + ${props.contentHeight}px)`};
  width: 100%;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

const BackgroundImage = styled.div<{ backgroundImage: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
`;

const Overlay = styled.div<{ opacity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  opacity: ${props => props.opacity};
  z-index: 1;
  transition: opacity 0.3s ease;
`;

const ContentWrapper = styled.div`
  z-index: 2;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  margin-top: calc(100vh - 30vh); /* Position at bottom as in original */
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// New wrapper for the second title with visibility control
const SecondTitleWrapper = styled.div<{ visible: boolean }>`
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 0 2rem;
  text-align: center;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translateY(${props => (props.visible ? 0 : '20px')});
  transition: opacity 0.6s ease, transform 0.6s ease;
  height: ${props => (props.visible ? 'auto' : '0')};
  overflow: ${props => (props.visible ? 'visible' : 'hidden')};
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

const ScrollIndicator = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
  margin: 2rem 0;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;