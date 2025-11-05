import NextLink from 'next/link';
import styled, { keyframes } from 'styled-components';
import ExpandingButton from 'components/ExpandingButton';
import Container from 'components/Container';
import { media } from 'utils/media';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import LanguageSelectorModal from 'components/LanguageSelectorModal';
import { DEFAULT_LANGUAGES, Language, Levels, useVisitor } from 'contexts/VisitorContext';
import Logo from 'components/Logo';
import { log } from 'console';

export default function Hero() {
  const [isLanguageSelectorModalOpen, setIsLanguageSelectorModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { targetSelectedLanguage, targetSelectedLanguageLevel, hasTargetSelectedLanguage } = useVisitor();

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = Math.min(currentScroll / scrollHeight, 1);
      setScrollProgress(progress);
      console.log(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLanguageSelectorModalOpen(true);
  };

  const handleDeviceClick = () => {
    // Show full-screen image
    setShowFullScreenImage(true);

    // After 2 seconds, hide image and show language modal
    setTimeout(() => {
      setShowFullScreenImage(false);
      setIsLanguageSelectorModalOpen(true);
    }, 2000);
  };

  const handleLanguageSelect = (language: Language, level?: Levels) => {
    setSelectedLanguage(language);
    // Close the language selector modal
    setIsLanguageSelectorModalOpen(false);
  };

  return (
    <>
      <HeroBackground>
        <HeroWrapper>
          <ContentWrapper>
          <TextColumn>
            <LogoWrapper>
              <Logo />
            </LogoWrapper>
            <Heading>Transform Books into <OrangeText>Language Learning Experiences</OrangeText></Heading>
            <Subheading>What language are you trying to learn now? Select one and try it yourself</Subheading>

            <CtaButton onClick={handleButtonClick}>
              Select Language
            </CtaButton>

            <PlatformAvailability>
              <PlatformText>Use it from anywhere</PlatformText>
              <PlatformIconsRow>
                <PlatformIconItem>
                  <IconWrapper>
                    <Image src="/kindle-icon.svg" alt="Kindle" width={64} height={64} />
                  </IconWrapper>
                </PlatformIconItem>
                <PlatformIconItem>
                  <IconWrapper>
                    <Image src="/android-icon.svg" alt="Android" width={64} height={64} />
                  </IconWrapper>
                </PlatformIconItem>
                <PlatformIconItem>
                  <IconWrapper>
                    <Image src="/apple-icon.svg" alt="Apple" width={64} height={64} />
                  </IconWrapper>
                </PlatformIconItem>
              </PlatformIconsRow>
            </PlatformAvailability>
          </TextColumn>

        </ContentWrapper>
        </HeroWrapper>
          <DeviceColumn>
            <DeviceMockup onClick={handleDeviceClick} scrollProgress={scrollProgress}>
              <DeviceFrame>
                <DeviceScreen>
                  <Image
                    src="/reading-image-v2.jpeg"
                    alt="Reading demo"
                    layout="fill"
                    objectFit="cover"
                  />
                </DeviceScreen>
              </DeviceFrame>
            </DeviceMockup>
          </DeviceColumn>
      </HeroBackground>

      {/* Full Screen Image Preview */}
      {showFullScreenImage && (
        <FullScreenImageOverlay>
          <FullScreenImageContainer>
            <Image
              src="/demo-reading.jpeg"
              alt="Reading demo preview"
              layout="fill"
              objectFit="contain"
            />
          </FullScreenImageContainer>
        </FullScreenImageOverlay>
      )}

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageSelectorModalOpen}
        onClose={() => setIsLanguageSelectorModalOpen(false)}
        languages={DEFAULT_LANGUAGES}
        selectedLanguage={targetSelectedLanguage}
        selectedLevel={targetSelectedLanguageLevel}
        onLanguageSelect={handleLanguageSelect}
        isDark={false}
        hasUserSelected={hasTargetSelectedLanguage}
        requireLevel={true}
        onCompleteSignup={true}
      />
    </>
  );
}

const HeroBackground = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(1, 60, 88, 0.15) 0%,
    rgba(48, 132, 161, 0.20) 50%,
    rgba(245, 162, 1, 0.15) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  
  ${media('<=tablet')} {
    padding-top: 3rem;
    padding-right: 0px;
    padding-bottom: 0rem;
    padding-left: 0px;
  }
`;

const HeroWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 6rem;
  align-items: center;
  justify-content: space-between;

  ${media('<=desktop')} {
    flex-direction: column;
    gap: 4rem;
  }
`;

const TextColumn = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${media('<=desktop')} {
    max-width: 100%;
  }
`;

const DeviceColumn = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media('<=desktop')} {
    max-width: 100%;
    width: 100%;
    margin-top: -2rem;
  }

  ${media('<=tablet')} {
    margin-top: -8rem;
  }
`;

const LogoWrapper = styled.div`
  margin-bottom: 3rem;

  svg {
    width: 40rem;
    height: auto;
  }

  ${media('<=tablet')} {
    margin-bottom: 2rem;

    svg {
      width: 24rem;
    }
  }
`;

const Heading = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;

  ${media('<=tablet')} {
    font-size: 3.2rem;
    margin-bottom: 1.5rem;
  }
`;

const Subheading = styled.p`
  font-size: 2rem;
  line-height: 1.5;
  margin-bottom: 3rem;
  opacity: 0.7;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }
`;

const CtaButton = styled(ExpandingButton)`
  padding: 1.6rem 4rem;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 4rem;
  background: rgb(var(--primary));
  color: rgb(var(--textSecondary));
  border: 2px solid rgb(var(--primary));
  cursor: pointer;

  ${media('<=tablet')} {
    padding: 1rem 3rem;
    font-size: 1.2rem;
    margin-bottom: 3rem;
  }
`;

const PlatformAvailability = styled.div`
  width: 100%;
  text-align: center;
`;

const PlatformText = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  opacity: 1;

  ${media('<=tablet')} {
    font-size: 1.2rem;
    margin-bottom: 0rem;
  }
`;

const PlatformIconsRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  ${media('<=tablet')} {
    gap: 2rem;
  }
`;

const PlatformIconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 8rem;
  border-radius: 1.2rem;
  background: rgba(var(--textSecondary), 0.05);
  padding: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(var(--textSecondary), 0.1);
  }

  ${media('<=tablet')} {
    width: 6rem;
    height: 6rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

interface DeviceMockupProps {
  scrollProgress: number;
}

const DeviceMockup = styled.div<DeviceMockupProps>`
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.15s ease-out;

  ${(props) => {
    const progress = props.scrollProgress;
    const scale = 0.8 + (progress*0.2);;
    return `
      transform: scale(${scale});
    `;
  }}

  &:hover {
    ${(props) => props.scrollProgress <= 0.3 && 'transform: scale(1.02);'}
  }
`;

const DeviceFrame = styled.div`
  position: relative;
  height: 80%;
  width: 100%;
  background: linear-gradient(145deg, #2c3e50, #34495e);
  border-radius: 3rem;
  padding: 1.5rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;

  ${media('<=tablet')} {
    border-radius: 2rem;
    padding: 1rem;
  }
`;

const DeviceScreen = styled.div`
  position: relative;
  height: 100vh;
  border-radius: 2rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;

  ${media('<=tablet')} {
    border-radius: 1.5rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #F5A201 0%, #3084A1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
`;

const OrangeText = styled.span`
  color: #F5A201;
  font-weight: bold;
`;

// Full screen image overlay animations and styles
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const FullScreenImageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const FullScreenImageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  animation: ${zoomIn} 0.4s ease-out;
`;