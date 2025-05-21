import React, { useEffect, useState } from 'react';
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
  useEffect(() => { 
    // Set initial height
    const setInitialHeight = () => {
      const height = window.innerHeight;
      setHeroHeight(`${height}px`);
    };
    
    // Set height on component mount
    setInitialHeight();
    
    // Prevent resize on scroll (browser UI appearance/disappearance)
    window.addEventListener('resize', setInitialHeight);
    
    return () => {
      window.removeEventListener('resize', setInitialHeight);
    };
  }, []);
  return (
    <HeroStickyWrapper backgroundImage={backgroundImage}>
      <Overlay opacity={overlayOpacity} />
      <ContentWrapper>
        <Title>{title}</Title>
        <ScrollIndicator>
          {/* <ScrollArrow>↓</ScrollArrow> */}
          <AnimatedButton>Free Trial</AnimatedButton>
        </ScrollIndicator>
        {/* {subtitle && <Subtitle>{subtitle}</Subtitle>} */}
      </ContentWrapper>
    </HeroStickyWrapper>
  );
}

const HeroStickyWrapper = styled.div<{ backgroundImage: string }>`
  position: relative;
  height: 100vh ;
  width: 100%;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* This makes the background stay in place when scrolling */
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5rem;
  margin: 0;
  margin-bottom: 10px;
  overflow: hidden;
`;

const Overlay = styled.div<{ opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: ${props => props.opacity};
`;

const ContentWrapper = styled.div`
  z-index: 1;
  text-align: center;
  padding: 0 2rem;
  position: relative;
  margin-bottom: 3vh;
  width: 100%;
  max-width: 1200px;
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

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0 0 2rem 0;
  font-weight: 400;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: -10rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
  margin: 2rem 0 2rem 0;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) translateX(-50%);
    }
    40% {
      transform: translateY(-10px) translateX(-50%);
    }
    60% {
      transform: translateY(-5px) translateX(-50%);
    }
  }
`;