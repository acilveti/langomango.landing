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
    t('home:pricing.beta.benefits.1'),
  ];
  
  return (
    <Wrapper>
      <SectionTitle>{t('home:pricing.title')}</SectionTitle>
      <AutofitGrid>
        <PricingCard
          title={t('home:pricing.monthly.title')}
          description={t('home:pricing.monthly.description')}
          benefits={benefits}
        >
          {t('home:pricing.monthly.price')}<span> {t('home:pricing.monthly.period')}</span>
        </PricingCard>
        <PricingCard
          title={t('home:pricing.quarterly.title')}
          description={t('home:pricing.quarterly.description')}
          benefits={benefits}
        >
          {t('home:pricing.quarterly.price')}<span> {t('home:pricing.quarterly.period')}</span>
        </PricingCard>
        <PricingCard
          title={t('home:pricing.yearly.title')}
          description={t('home:pricing.yearly.description')}
          benefits={benefits}
        >
          {t('home:pricing.yearly.price')}<span> {t('home:pricing.yearly.period')}</span>
        </PricingCard>
        <PricingCard
          title={t('home:pricing.threeyear.title')}
          description={t('home:pricing.threeyear.description')}
          benefits={benefits}
        >
          {t('home:pricing.threeyear.price')}<span> {t('home:pricing.threeyear.period')}</span>
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