// views/HomePage/Hero.tsx
import NextLink from 'next/link';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import VibratingButton from 'components/VibratingButton';
import { useTranslation } from 'next-i18next';
import ReaderDemoWidget from 'components/ReaderDemoWidget';
import { useSignupModalContext } from 'contexts/SignupModalContext';
import { media } from 'utils/media';

export default function Hero() {
  const { t } = useTranslation(['common', 'home']);
  const { setIsModalOpened } = useSignupModalContext();
  const [isMobile, setIsMobile] = useState(false);
  const [darkenAmount, setDarkenAmount] = useState(0);
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const mobileDemoContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on client side before using window
  useEffect(() => {
    const checkIfMobile = () => {
      // You'll need to set the breakpoint that matches your 'desktop' media query
      const mobileBreakpoint = 1024; // Adjust this value to match your desktop breakpoint
      setIsMobile(window.innerWidth <= mobileBreakpoint);
    };
    
    // Set initial value
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Scroll effect for darkening the reader widget
  useEffect(() => {
    const handleScroll = () => {
      const containerRef = isMobile ? mobileDemoContainerRef : demoContainerRef;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenterY = rect.top + rect.height / 2;
      const screenCenterY = windowHeight / 2;
      
      // Calculate distance from center of screen
      const distanceFromCenter = Math.abs(elementCenterY - screenCenterY);
      const maxDistance = windowHeight / 2;
      
      // Calculate darkening amount (0 to 1)
      // 0 when far from center, 1 when perfectly centered
      const darkness = Math.max(0, 1 - (distanceFromCenter / maxDistance));
      
      // Apply exponential curve for smoother transition
      const smoothDarkness = Math.pow(darkness, 2);
      
      setDarkenAmount(smoothDarkness * 0.95); // Max 60% darkness
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile]);
  
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpened(true)
    // window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
  };
  
  // Mobile content
  if (isMobile) {
    return (
      <>
        <PageDarkenOverlay opacity={darkenAmount} />
        <HeroWrapper id="hero-section">
        <MobileContents>
          <CustomOverTitle>{t('home:hero.overTitle')}</CustomOverTitle>
          <Heading>{t('home:hero.heading')}</Heading>
          <Description>
            {t('home:hero.description')}
          </Description>
          <MobileDemoContainer ref={mobileDemoContainerRef} className="reader-demo-container">
            <ReaderDemoWidget useInlineSignup={true} isFullRegister={true} />
          </MobileDemoContainer>
        </MobileContents>

        <style jsx>{`
          span.wordWisePosition::before {
            content: attr(data-translation);
            position: absolute;
            top: -8px;
            color: #111010;
            font-size: 0.7em;
            white-space: normal;
            overflow: hidden;
            line-height: 0.8 !important;
            font-weight: 600;
          }
          
          span.wordWisePress::before {
            content: attr(data-translation);
            position: absolute;
            top: -8px;
            color: #111010;
            font-size: 0.7em;
            white-space: normal;
            overflow: hidden;
            line-height: 0.8 !important;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          
          span.wordWisePress:active::before {
            opacity: 1;
          }
        `}</style>
      </HeroWrapper>
      </>
    );
  }
  
  // Desktop content with two columns
  return (
    <>
      <PageDarkenOverlay opacity={darkenAmount} />
      <HeroWrapper id="hero-section">
      <TwoColumnLayout>
        <TextColumn>
          <CustomOverTitle>{t('home:hero.overTitle')}</CustomOverTitle>
          <Heading style={{ fontSize: '4rem' }}>{t('home:hero.heading')}</Heading>
          <Description style={{ lineHeight: '2' }}>
            {t('home:hero.description')}
          </Description>
          <CustomButtonGroup>
            <VibratingButton data-umami-event="Hero button" onClick={handleButtonClick}>
              {t('common:startReading')} <span>&rarr;</span>
            </VibratingButton>
            <NextLink href="/authors" passHref>
              <Button transparent>
                {t('common:areYouAuthor')} <span>&rarr;</span>
              </Button>
            </NextLink>
          </CustomButtonGroup>
        </TextColumn>
        
        <DemoColumn>
          <DemoContainer ref={demoContainerRef} className="reader-demo-container">
            <ReaderDemoWidget useInlineSignup={true} isFullRegister={true} />
          </DemoContainer>
        </DemoColumn>
      </TwoColumnLayout>

      <style jsx>{`
        span.wordWisePosition::before {
          content: attr(data-translation);
          position: absolute;
          top: -8px;
          color: #111010;
          font-size: 0.7em;
          white-space: normal;
          overflow: hidden;
          line-height: 0.8 !important;
          font-weight: 600;
        }
        
        span.wordWisePress::before {
          content: attr(data-translation);
          position: absolute;
          top: -8px;
          color: #111010;
          font-size: 0.7em;
          white-space: normal;
          overflow: hidden;
          line-height: 0.8 !important;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        span.wordWisePress:active::before {
          opacity: 1;
        }
      `}</style>
    </HeroWrapper>
    </>
  );
}

const HeroWrapper = styled(Container)`
  display: flex;
  padding-top: 5rem;

  ${media('<=desktop')} {
    padding-top: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

// Two column layout for desktop
const TwoColumnLayout = styled.div`
  display: flex;
  width: 100%;
  gap: 4rem;
  align-items: center;
`;

const TextColumn = styled.div`
  flex: 1;
  max-width: 50%;
`;

const DemoColumn = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileContents = styled.div`
  width: 100%;
  max-width: 100%;
`;

const CustomButtonGroup = styled(ButtonGroup)`
  margin-top: 4rem;
`;



const DemoContainer = styled.div.attrs({
  'data-demo-container': 'true'
})`
  width: 100%;
  max-width: 60rem;
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  position: relative;
  z-index: 15;
`;

const MobileDemoContainer = styled.div.attrs({
  'data-demo-container': 'true'
})`
  width: 100%;
  margin: 2rem 0;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
  position: relative;
  z-index: 15;
`;

const PageDarkenOverlay = styled.div<{ opacity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: ${props => props.opacity};
  pointer-events: none;
  z-index: 9;
  transition: opacity 0.3s ease-out;
`;



const Description = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;

  ${media('<=desktop')} {
    font-size: 1.5rem;
  }
`;

const MobileDescription = styled.p`
  font-size: 1.4rem;
  opacity: 0.8;
  line-height: 1.4;
  text-align: center;
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 7.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 4rem;
  letter-spacing: -0.03em;

  ${media('<=tablet')} {
    font-size: 4.6rem;
    margin-bottom: 2rem;
  }
`;

const MobileHeading = styled.h1`
  font-size: 3.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  text-align: center;
`;