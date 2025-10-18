import NextLink from 'next/link';
import styled from 'styled-components';
import Button from 'components/Button';
import Container from 'components/Container';
import { useTranslation } from 'next-i18next';
import { useSignupModalContext } from 'contexts/SignupModalContext';
import { media } from 'utils/media';
import Image from 'next/image';

export default function Hero() {
  const { t } = useTranslation('common');
  const { setIsModalOpened } = useSignupModalContext();

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpened(true);
  };

  return (
    <HeroWrapper>
      <ContentWrapper>
        <TextColumn>
          <Heading>Transform Books into <HighlightedText>Learning Experiences</HighlightedText></Heading>
          <Subheading>{t('simplePage.hero.subheading')}</Subheading>

          <CtaButton onClick={handleButtonClick}>
            {t('simplePage.hero.ctaButton')}
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
          <DeviceMockup>
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
  color: rgb(var(--textSecondary));

  ${media('<=tablet')} {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }
`;

const CtaButton = styled(Button)`
  padding: 1.6rem 4rem;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 4rem;
  background: #ff6b35;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5722;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
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