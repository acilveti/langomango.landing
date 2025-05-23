// views/HomePage/Cta.tsx - Enhanced with ExpandingButton component and Reddit Pixel tracking
import NextLink from 'next/link';
import React from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import SectionTitle from 'components/SectionTitle';
import ExpandingButton from 'components/ExpandingButton';
import { media } from 'utils/media';
import { useTranslation } from 'next-i18next';
import { addReferralToUrl } from 'utils/referral';
// Import Reddit Pixel tracking
import { RedditEventTypes,trackRedditConversion } from 'utils/redditPixel';

// Add onCtaClick prop for external tracking
interface CtaProps {
  onCtaClick?: () => void;
  imageSrc?: string; // Optional image source prop
  imageAlt?: string; // Optional image alt text prop
}

export default function Cta({ onCtaClick, imageSrc, imageAlt = "CTA Image" }: CtaProps) {
  const { t } = useTranslation(['common', 'home']);
  
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Track CTA click with Reddit Pixel
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'CTA button',
      button_text: t('common:cta.button'),
      location: 'primary CTA'
    });
    
    // Call external tracking handler if provided
    if (onCtaClick) {
      onCtaClick();
    }
    
    // Navigate to sign-up
    window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
  };

  const handleSecondaryButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track secondary button click
    trackRedditConversion(RedditEventTypes.CUSTOM, {
      custom_event_name: 'secondary_button_click',
      button_text: t('common:areYouAuthor'),
      location: 'primary CTA'
    });
  };

  return (
    <CtaWrapper>
      <Container>
        <Stack>
          <OverTitle>{t('common:cta.title')}</OverTitle>
          <SectionTitle>{t('common:cta.subtitle')}</SectionTitle>
          <Description>
            {t('common:cta.description')}
          </Description>

          {/* Image placement between text and buttons */}
          {imageSrc && (
            <ImageContainer>
              <CtaImage src={imageSrc} alt={imageAlt} />
            </ImageContainer>
          )}

          <ButtonGroup>
            <ExpandingButton 
              data-umami-event="cta button" 
              onClick={handleButtonClick}
            >
              {t('common:cta.button')} <span>&rarr;</span>
            </ExpandingButton>
            {/* <NextLink href="/authors" passHref>
              <OutlinedButton 
                transparent
                onClick={handleSecondaryButtonClick}
              >
                {t('common:areYouAuthor')} <span>&rarr;</span>
              </OutlinedButton>
            </NextLink> */}
          </ButtonGroup>
        </Stack>
      </Container>
    </CtaWrapper>
  );
}

export function CtaAuthors({ imageSrc, imageAlt = "Author CTA Image" }: { imageSrc?: string; imageAlt?: string; }) {
  const { t } = useTranslation(['common', 'home']);
  
  const handleAuthorButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track author CTA click
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'Author CTA button',
      button_text: t('authorCta.button'),
      location: 'author CTA'
    });
  };

  const handleSecondaryButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track secondary button click
    trackRedditConversion(RedditEventTypes.CUSTOM, {
      custom_event_name: 'secondary_button_click',
      button_text: t('authorCta.secondaryButton'),
      location: 'author CTA'
    });
  };
  
  return (
    <CtaWrapper>
      <Container>
        <Stack>
          <OverTitle>{t('authorCta.title')}</OverTitle>
          <SectionTitle>{t('authorCta.subtitle')}</SectionTitle>
          <Description>
            {t('authorCta.description')}
          </Description>

          {/* Image placement between text and buttons */}
          {imageSrc && (
            <ImageContainer>
              <CtaImage src={imageSrc} alt={imageAlt} />
            </ImageContainer>
          )}
  
          <ButtonGroup>
            <NextLink href={addReferralToUrl("https://beta-app.langomango.com/sign-up")} passHref>
              <ExpandingButton 
                data-umami-event="cta button"
                onClick={handleAuthorButtonClick}
              >
                {t('authorCta.button')} <span>&rarr;</span>
              </ExpandingButton>
            </NextLink>
            {/* <NextLink href="/" passHref>
              <OutlinedButton 
                transparent
                onClick={handleSecondaryButtonClick}
              >
                {t('authorCta.secondaryButton')} <span>&rarr;</span>
              </OutlinedButton>
            </NextLink> */}
          </ButtonGroup>
        </Stack>
      </Container>
    </CtaWrapper>
  );
}

// New styled components for the image
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 2rem 0;
`;

const CtaImage = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 300px; // Adjust as needed
  border-radius: 8px; // Optional: rounded corners
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); // Optional: subtle shadow
  
  ${media('<=tablet')} {
    max-height: 200px; // Smaller on mobile
  }
`;

const Description = styled.div`
  font-size: 1.8rem;
  color: rgba(var(--textSecondary), 0.8);
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4rem 0;
  color: rgb(var(--textSecondary));
  text-align: center;
  align-items: center;
  justify-content: center;

  & > *:not(:first-child) {
    max-width: 80%;
    margin-top: 4rem;
  }

  ${media('<=tablet')} {
    text-align: center;

    & > *:not(:first-child) {
      max-width: 100%;
      margin-top: 2rem;
    }
  }
`;

const OutlinedButton = styled(Button)`
  border: 1px solid rgb(var(--textSecondary));
  color: rgb(var(--textSecondary));
`;

const CtaWrapper = styled.div`
  background: rgb(var(--secondary));
`;