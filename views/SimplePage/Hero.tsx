import NextLink from 'next/link';
import styled, { keyframes } from 'styled-components';
import Button from 'components/Button';
import Container from 'components/Container';
import { media } from 'utils/media';
import Image from 'next/image';
import { useState } from 'react';
import LanguageSelectorModal from 'components/LanguageSelectorModal';
import { DEFAULT_LANGUAGES, Language, Levels, useVisitor } from 'contexts/VisitorContext';

export default function Hero() {
  const [isLanguageSelectorModalOpen, setIsLanguageSelectorModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { targetSelectedLanguage, targetSelectedLanguageLevel, hasTargetSelectedLanguage } = useVisitor();

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLanguageSelectorModalOpen(true);
  };

  const handleDeviceClick = () => {
    setIsLanguageSelectorModalOpen(true);
  };

  const handleLanguageSelect = (language: Language, level?: Levels) => {
    setSelectedLanguage(language);
    // Close the language selector modal
    setIsLanguageSelectorModalOpen(false);
  };

  return (
    <HeroWrapper>
      <ContentWrapper>
        <TextColumn>
          <Heading>Transform Books into <HighlightedText>Learning Experiences</HighlightedText></Heading>
          <Subheading>What language are you trying to learn now? Select one and try it yourself</Subheading>

          <CtaButton onClick={handleButtonClick}>
            Select Language
          </CtaButton>

          <PlatformAvailability>
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

        <DeviceColumn>
          <DeviceMockup onClick={handleDeviceClick}>
            <DeviceFrame>
              <DeviceScreen>
                <Image
                  src="/demo-reading.jpeg"
                  alt="Reading demo"
                  layout="fill"
                  objectFit="cover"
                />
              </DeviceScreen>
            </DeviceFrame>
          </DeviceMockup>
        </DeviceColumn>
      </ContentWrapper>

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
      />
    </HeroWrapper>
  );
}

const HeroWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8rem;
  padding-bottom: 8rem;
  min-height: 80vh;

  ${media('<=tablet')} {
    padding-top: 4rem;
    padding-bottom: 4rem;
    min-height: auto;
  }
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
  }
`;

const Heading = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;

  ${media('<=tablet')} {
    font-size: 3.6rem;
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

// Vibration animation
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

const CtaButton = styled(Button)`
  padding: 1.6rem 4rem;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 4rem;
  background: rgb(var(--primary));
  color: rgb(var(--textSecondary));
  border: 2px solid rgb(var(--primary));
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${vibrateWithIntervals} 6s infinite;
  animation-delay: 2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(var(--primary), 0.3);
    animation-play-state: paused;
  }

  &:focus {
    animation-play-state: paused;
  }

  ${media('<=tablet')} {
    padding: 1.4rem 3rem;
    font-size: 1.6rem;
    margin-bottom: 3rem;
  }
`;

const PlatformAvailability = styled.div`
  width: 100%;
  text-align: center;
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

const DeviceMockup = styled.div`
  width: 100%;
  max-width: 50rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  ${media('<=desktop')} {
    max-width: 40rem;
  }

  ${media('<=tablet')} {
    max-width: 32rem;
  }
`;

const DeviceFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
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
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;

  ${media('<=tablet')} {
    border-radius: 1.5rem;
  }
`;

const HighlightedText = styled.span`
  color: rgb(255, 152, 0);
`;