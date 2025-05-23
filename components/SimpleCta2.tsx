// components/SimpleCta.tsx - Simple CTA component with VibratingButton
import React from 'react';
import styled from 'styled-components';
import VibratingButton from 'components/VibratingButton';
import { useTranslation } from 'next-i18next';
import { addReferralToUrl } from 'utils/referral';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';

interface SimpleCtaProps {
  buttonText?: string; // Optional custom button text
  trackingEvent?: string; // Optional custom tracking event name
  location?: string; // Optional location identifier for tracking
  className?: string; // Optional className for styling
}

export default function SimpleCta({ 
  buttonText, 
  trackingEvent = 'simple cta button',
  location = 'simple CTA',
  className 
}: SimpleCtaProps) {
  const { t } = useTranslation(['common']);
  const { setIsModalOpened } = useNewsletterModalContext(); 

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Track CTA click with Reddit Pixel
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'Simple CTA button',
      button_text: buttonText || t('common:cta.button'),
      location: location
    });
    
    // Navigate to sign-up
    // window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
    setIsModalOpened(true)
  };

  return (
    <CtaContainer className={className}>
      <VibratingButton 
        data-umami-event={trackingEvent}
        onClick={handleButtonClick}
      >
        {buttonText || t('common:cta.button')} <span>&rarr;</span>
      </VibratingButton>
    </CtaContainer>
  );
}

const CtaContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 0;
`;