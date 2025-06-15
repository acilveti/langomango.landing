// views/HomePage/Hero.tsx
import NextLink from 'next/link';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import VibratingButton from 'components/VibratingButton';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { media } from 'utils/media';
import { addReferralToUrl } from 'utils/referral';
import { useTranslation } from 'next-i18next';
import ReaderDemoWidget from 'components/ReaderDemoWidget';

export default function Hero() {
  const { t } = useTranslation(['common', 'home']);
  const { setIsModalOpened } = useNewsletterModalContext();
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpened(true)
    // window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
  };
  
  // Mobile content
  if (isMobile) {
    return (
      <HeroWrapper>
        <MobileContents>
          <CustomOverTitle>{t('home:hero.overTitle')}</CustomOverTitle>
          <Heading>{t('home:hero.heading')}</Heading>
          <Description>
            {t('home:hero.description')}
          </Description>
          <MobileDemoContainer>
            <ReaderDemoWidget selectedLanguage={{ code: 'es', name: 'Spanish', flag: '🇪🇸' }} useInlineSignup={true} />
          </MobileDemoContainer>
          <MobileButtonGroup>
            <VibratingButton data-umami-event="Hero button" onClick={handleButtonClick}>
              {t('common:startReading')} <span>&rarr;</span>
            </VibratingButton>
            {/* <NextLink href="/authors" passHref>
              <Button transparent>
                {t('common:areYouAuthor')} <span>&rarr;</span>
              </Button>
            </NextLink> */}
          </MobileButtonGroup>
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
    );
  }
  
  // Desktop content with two columns
  return (
    <HeroWrapper>
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
          <DemoContainer>
            <ReaderDemoWidget selectedLanguage={{ code: 'es', name: 'Spanish', flag: '🇪🇸' }} useInlineSignup={true} />
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

const MobileButtonGroup = styled(ButtonGroup)`
  margin-top: 2rem;
`;

const DemoContainer = styled.div`
  width: 100%;
  max-width: 60rem;
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
`;

const MobileDemoContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
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