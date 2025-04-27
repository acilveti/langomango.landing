// views/PricingPage/FaqSection.tsx
import styled from 'styled-components';
import Accordion from 'components/Accordion';
import SectionTitle from 'components/SectionTitle';
import { useTranslation } from 'next-i18next';

export default function FaqSection() {
  const { t } = useTranslation(['common', 'home']);
  
  return (
    <Wrapper>
  <SectionTitle>{t('faq.sectionTitle')}</SectionTitle>
  <Accordion title={t('faq.languagesAvailable.title')}>
      {t('faq.languagesAvailable.content')}
  </Accordion>
</Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 15rem;
  & > *:not(:first-child) {
    margin-top: 3rem;
  }
`;