import { PropsWithChildren } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { media } from 'utils/media';
import Button from './Button';
import RichText from './RichText';

interface PricingCardProps {
  title: string;
  description: string;
  benefits: string[];
  isOutlined?: boolean;
}

export default function PricingCard({ title, description, benefits, isOutlined, children }: PropsWithChildren<PricingCardProps>) {
  const isAnyBenefitPresent = benefits?.length;
  const { setIsModalOpened } = useNewsletterModalContext(); 
  
  // Function to handle button click with proper type annotation for anchor elements
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpened(true)
    // window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
  };

  return (
    <Wrapper isOutlined={isOutlined}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <PriceContainer>
        <Price>{children}</Price>
        {isAnyBenefitPresent && (
          <CustomRichText>
            <ul>
              {benefits.map((singleBenefit, idx) => (
                <li key={idx}>{singleBenefit}</li>
              ))}
            </ul>
          </CustomRichText>
        )}
      </PriceContainer>
      <AnimatedButton data-umami-event="pricing button" onClick={handleButtonClick}>
        Start free trial <ArrowSpan>&rarr;</ArrowSpan>
      </AnimatedButton>
    </Wrapper>
  );
}

// WaveCta animation keyframes - copied from your WaveCta component
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

const Wrapper = styled.div<{ isOutlined?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 3rem;
  background: rgb(var(--cardBackground));
  box-shadow: ${(p) => (p.isOutlined ? 'var(--shadow-lg)' : 'var(--shadow-md)')};
  transform: ${(p) => (p.isOutlined ? 'scale(1.1)' : 'scale(1.0)')};
  text-align: center;

  & > *:not(:first-child) {
    margin-top: 1rem;
  }

  ${media('<=desktop')} {
    box-shadow: var(--shadow-md);
    transform: none;
    order: ${(p) => (p.isOutlined ? -1 : 0)};
  }
`;

const Title = styled.h3`
  font-size: 4rem;
  text-transform: capitalize;
`;

const Description = styled.p`
  font-size: 2.5rem;
`;

const PriceContainer = styled.div`
  margin: auto;

  & > *:not(:first-child) {
    margin-top: 2rem;
  }
`;

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 4rem;
  line-height: 1;
  font-weight: bold;

  span {
    font-size: 2rem;
    font-weight: normal;
  }
`;

const CustomRichText = styled(RichText)`
  li {
    margin: auto;
    width: fit-content;
  }
`;

// Enhanced button with WaveCta animations
const AnimatedButton = styled(Button)`
  width: 100%;
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

// Animated arrow span
const ArrowSpan = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
  margin-left: 0.5rem;
  
  ${AnimatedButton}:hover & {
    animation: ${arrowSlide} 1s infinite;
  }
`;