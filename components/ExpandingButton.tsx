// components/ExpandingButton.tsx - Reusable animated button component
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from 'components/Button';

// ExpandingButton component props
interface ExpandingButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  'data-umami-event'?: string;
  [key: string]: any; // Allow other props to pass through
}

export default function ExpandingButton({ children, onClick, className, ...props }: ExpandingButtonProps) {
  return (
    <AnimatedButton onClick={onClick} className={className} {...props}>
      <ButtonContent>
        {children}
      </ButtonContent>
    </AnimatedButton>
  );
}

// Animation keyframes
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--primary), 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(var(--primary), 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--primary), 0);
  }
`;

const arrowSlide = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Animated button with all WaveCta animations
const AnimatedButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  /* Continuous pulse animation */
  animation: ${pulse} 2s infinite;
  
  /* Hover effects */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    animation-play-state: paused; /* Pause pulse on hover */
    
    /* Shimmer effect on hover */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: ${shimmer} 1.5s infinite;
    }
    
    /* Arrow slide animation on hover */
    span:last-child {
      animation: ${arrowSlide} 1s infinite;
    }
  }
  
  /* Active state */
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  /* Focus state for accessibility */
  &:focus {
    outline: 2px solid rgba(var(--primary), 0.5);
    outline-offset: 2px;
  }
`;

const ButtonContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  /* Target arrow spans for animation */
  span:last-child {
    display: inline-block;
    transition: transform 0.3s ease;
    font-weight: bold;
  }
`;