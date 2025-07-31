// views/PricingPage/FaqSection.tsx
import styled from 'styled-components';
import Accordion from 'components/Accordion';
import SectionTitle from 'components/SectionTitle';
import OverTitle from 'components/OverTitle';
import Container from 'components/Container';
import { useTranslation } from 'next-i18next';
import { media } from 'utils/media';

export default function FaqSection() {
  const { t } = useTranslation(['common', 'home']);
  
  return (
    <FaqSectionWrapper>
      <Container>
        <HeaderContainer>
          {/* <CustomOverTitle>{t('faq.overTitle')}</CustomOverTitle> */}
          <Title>{t('faq.sectionTitle')}</Title>
        </HeaderContainer>
        
        <FaqContainer>
          <Accordion title={t('faq.languagesAvailable.title')}>
            {t('faq.languagesAvailable.content')}
          </Accordion>
        </FaqContainer>
      </Container>
    </FaqSectionWrapper>
  );
}

const FaqSectionWrapper = styled.div`
  padding-top: 5rem;
`;

const HeaderContainer = styled.div`
  margin-bottom: 6rem;
  overflow: hidden;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 4rem;
  letter-spacing: -0.03em;
  max-width: 100%;

  ${media('<=tablet')} {
    font-size: 4.6rem;
    margin-bottom: 2rem;
  }
`;

const FaqContainer = styled.div`
  & > *:not(:first-child) {
    margin-top: 3rem;
  }
`;