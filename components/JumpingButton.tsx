// components/JumpingButton.tsx - Reusable jumping button component
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from 'components/Button';
import { useSignupModalContext } from 'contexts/SignupModalContext';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';

// JumpingButton component props
interface JumpingButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  'data-umami-event'?: string;
  trackingEvent?: string; // Optional custom tracking event name
  location?: string; // Optional location identifier for tracking
  [key: string]: any; // Allow other props to pass through
}

export default function JumpingButton({ 
  children, 
  onClick, 
  className, 
  trackingEvent = 'jumping button',
  location = 'jumping button',
  ...props 
}: JumpingButtonProps) {
    const { setIsModalOpened } = useSignupModalContext(); 
  
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    console.log('JumpingButton clicked!'); // Debug log
    
    // Track button click with Reddit Pixel
    try {
      trackRedditConversion(RedditEventTypes.LEAD, {
        lead_type: 'Jumping button',
        button_text: typeof children === 'string' ? children : 'Jumping button',
        location: location
      });
    } catch (error) {
      console.log('Tracking error:', error);
    }
    
    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e as React.MouseEvent<HTMLAnchorElement>);
    }
    
    // Navigate to sign-up
    console.log('Navigating to signup...'); // Debug log
    // window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
    setIsModalOpened(true)
  };

  return (
    <JumpingContainer>
      <AnimatedButton 
        onClick={handleButtonClick} 
        className={className} 
        data-umami-event={trackingEvent}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {children}
      </AnimatedButton>
    </JumpingContainer>
  );
}

// Bouncing animation keyframes
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Container with the jumping animation
const JumpingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${bounce} 2s infinite;
  margin: 2rem 0;
`;

// Simple button wrapper that inherits the animation from its container
const AnimatedButton = styled(Button)`
  /* Button inherits the bounce animation from JumpingContainer */
  /* Any additional button-specific styles can go here */
`;