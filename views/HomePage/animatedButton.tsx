// AnimatedButton.tsx
import React from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import { trackRedditConversion, RedditEventTypes } from 'utils/redditPixel';

interface AnimatedButtonProps {
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  showArrowAnimation?: boolean;
  trackingData?: {
    eventType: RedditEventTypes;
    data: any;
  };
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  text = 'Free Trial', 
  onClick, 
  className,
  showArrowAnimation = true,
  trackingData
}) => {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Track click with Reddit Pixel if tracking data is provided
    if (trackingData) {
      trackRedditConversion(trackingData.eventType, trackingData.data);
    }
    
    // Call external click handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <ButtonContainer className={className}>
      
      <PrimaryButton 
        onClick={handleClick} 
        data-umami-event="Free Trial button"
      >
        {text} <Arrow>&rarr;</Arrow>
      </PrimaryButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3rem 0;
`;

// Matching the style from the CTA component
const PrimaryButton = styled.button`
  display: inline-block;
  text-decoration: none;
  text-align: center;
  background: rgb(var(--primary));
  padding: 1.75rem 2.25rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: rgb(var(--textSecondary));
  text-transform: uppercase;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  ${media('<=tablet')} {
    font-size: 1rem;
    padding: 1.25rem 1.75rem;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s ease;
  
  ${PrimaryButton}:hover & {
    transform: translateX(5px);
  }
`;

const AnimatedArrow = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 15px;
  animation: bounceArrow 2s infinite;
  
  @keyframes bounceArrow {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) translateX(-50%);
    }
    40% {
      transform: translateY(10px) translateX(-50%);
    }
    60% {
      transform: translateY(5px) translateX(-50%);
    }
  }
`;

const ArrowLine = styled.div`
  width: 3px;
  height: 30px;
  background-color: rgb(var(--textSecondary));
  margin: 0 auto;
`;

const ArrowHead = styled.div`
  width: 0; 
  height: 0; 
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid rgb(var(--textSecondary));
  margin: 0 auto;
`;

export default AnimatedButton;