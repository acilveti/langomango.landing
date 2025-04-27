// views/PricingPage/FaqSection.tsx
import styled from 'styled-components';
import Accordion from 'components/Accordion';
import SectionTitle from 'components/SectionTitle';
import { useTranslation } from 'next-i18next';

export default function FaqSection() {
  const { t } = useTranslation(['common', 'home']);
  
  return (
    <Wrapper>
      <SectionTitle>{t('home:faq.title')}</SectionTitle>
      <Accordion title={t('home:faq.languages.title')}>
        {t('home:faq.languages.content')}
      </Accordion>
      
      {/* Add more FAQ items here as needed */}
      {/* Example:
      <Accordion title={t('home:faq.pricing.title')}>
        {t('home:faq.pricing.content')}
      </Accordion>
      */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 15rem;
  & > *:not(:first-child) {
    margin-top: 3rem;
  }
`;