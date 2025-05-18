// views/HomePage/Cta.tsx
import NextLink from 'next/link';
import React from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import SectionTitle from 'components/SectionTitle';
import { media } from 'utils/media';
import { useTranslation } from 'next-i18next';
import { addReferralToUrl } from 'utils/referral';

export default function Cta() {
  const { t } = useTranslation(['common', 'home']);
  
  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = "https://beta-app.langomango.com/sign-up";
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

          <ButtonGroup>
            <Button data-umami-event="cta button" onClick={handleButtonClick}>
              {t('common:cta.button')} <span>&rarr;</span>
            </Button>
            <NextLink href="/authors" passHref>
              <OutlinedButton transparent>
                {t('common:areYouAuthor')} <span>&rarr;</span>
              </OutlinedButton>
            </NextLink>
          </ButtonGroup>
        </Stack>
      </Container>
    </CtaWrapper>
  );
}

export function CtaAuthors() {
  const { t } = useTranslation(['common', 'home']);
  
  return (
    <CtaWrapper>
      <Container>
        <Stack>
          <OverTitle>{t('authorCta.title')}</OverTitle>
          <SectionTitle>{t('authorCta.subtitle')}</SectionTitle>
          <Description>
            {t('authorCta.description')}
          </Description>
  
          <ButtonGroup>
            <NextLink href="https://beta-app.langomango.com/sign-up" passHref>
              <Button data-umami-event="cta button">
                {t('authorCta.button')} <span>&rarr;</span>
              </Button>
            </NextLink>
            <NextLink href="/" passHref>
              <OutlinedButton transparent>
                {t('authorCta.secondaryButton')} <span>&rarr;</span>
              </OutlinedButton>
            </NextLink>
          </ButtonGroup>
        </Stack>
      </Container>
    </CtaWrapper>
  );
}

const Description = styled.div`
  font-size: 1.8rem;
  color: rgba(var(--textSecondary), 0.8);
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12.5rem 0;
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