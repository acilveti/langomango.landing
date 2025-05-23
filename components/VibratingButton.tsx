// components/VibratingButton.tsx - Reusable vibrating button component
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from 'components/Button';

// VibratingButton component props
interface VibratingButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  'data-umami-event'?: string;
  [key: string]: any; // Allow other props to pass through
}

export default function VibratingButton({ children, onClick, className, ...props }: VibratingButtonProps) {
  return (
    <AnimatedButton onClick={onClick} className={className} {...props}>
      {children}
    </AnimatedButton>
  );
}

// Intermittent vibration animation with built-in intervals
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

// Animated button component with intermittent vibration
const AnimatedButton = styled(Button)`
  animation: ${vibrateWithIntervals} 12s infinite;
  animation-delay: 2s; /* Start after 2 seconds */
  
  &:hover {
    animation-play-state: paused; /* Pause animation on hover */
  }
  
  &:focus {
    animation-play-state: paused; /* Pause animation on focus */
  }
`;