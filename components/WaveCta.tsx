'use client';
import { useTranslation } from 'next-i18next';
import React from 'react';
import styled from 'styled-components';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import ExpandingButton from 'components/ExpandingButton';
import SectionTitle from 'components/SectionTitle';
import { useSignupModalContext } from 'contexts/SignupModalContext';
import { media } from 'utils/media';

export default function WaveCta() {
  const { t } = useTranslation(['common', 'home']);
  const { setIsModalOpened } = useSignupModalContext();

  // Function to handle button click with proper type annotation for anchor elements
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // window.location.href = addReferralToUrl('https://beta-app.langomango.com/sign-up');
    setIsModalOpened(true)
  };

  return (
    <>
      <CtaWrapperBackground>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="rgb(var(--secondary))"
            fillOpacity="1"
            d="M0,64L80,58.7C160,53,320,43,480,80C640,117,800,203,960,197.3C1120,192,1280,96,1360,48L1440,0L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
        <CtaWrapper>
          <Container>
            <Title>{t('common:waveCta.title')}</Title>
            <Description>{t('common:waveCta.description')}</Description>
            <CustomButtonGroup>
              <ExpandingButton data-umami-event="wave cta button" onClick={handleButtonClick}>
                {t('common:waveCta.mainButton')} <span>&rarr;</span>
              </ExpandingButton>

              {/* <NextLink href="/authors" passHref>
                <OutlinedButton transparent>
                  {t('common:areYouAuthor')} <span>&rarr;</span>
                </OutlinedButton>
              </NextLink> */}
            </CustomButtonGroup>
          </Container>
        </CtaWrapper>
      </CtaWrapperBackground>
    </>
  );
}

const CtaWrapper = styled.div`
  background: rgb(var(--secondary));
  margin-top: -1rem;
  padding-bottom: 16rem;

  ${media('<=tablet')} {
    padding-top: 8rem;
  }
`;

const CtaWrapperBackground = styled.div`
  background: white;
`;

const Title = styled(SectionTitle)`
  color: rgb(var(--textSecondary));
  margin-bottom: 2rem;
`;

const Description = styled.div`
  font-size: 1.8rem;
  color: rgba(var(--textSecondary), 0.8);
  text-align: center;
  max-width: 60%;
  margin: 0 auto 4rem;

  ${media('<=tablet')} {
    max-width: 100%;
  }
`;

const CustomButtonGroup = styled(ButtonGroup)`
  justify-content: center;
  
  /* Match the Cta component button styling */
  & > * {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;