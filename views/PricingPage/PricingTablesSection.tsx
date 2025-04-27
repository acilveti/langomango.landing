// views/PricingPage/PricingTablesSection.tsx
import React from 'react';
import styled from 'styled-components';
import AutofitGrid from 'components/AutofitGrid';
import PricingCard from 'components/PricingCard';
import SectionTitle from 'components/SectionTitle';
import { useTranslation } from 'next-i18next';

export default function PricingTablesSection() {
  const { t } = useTranslation(['common', 'home']);
  
  // Get the pricing benefits from translations
  const benefits = [
    t('home:pricing.beta.benefits.0'),
    t('home:pricing.beta.benefits.1'),
    t('home:pricing.beta.benefits.2')
  ];
  
  return (
    <Wrapper>
      <SectionTitle>{t('home:pricing.title')}</SectionTitle>
      <AutofitGrid>
        <PricingCard
          title={t('home:pricing.beta.title')}
          description={t('home:pricing.beta.description')}
          benefits={benefits}
        >
          {t('home:pricing.beta.price')}<span> {t('home:pricing.beta.period')}</span>
        </PricingCard>
      </AutofitGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  & > *:not(:first-child) {
    margin-top: 8rem;
  }
`;