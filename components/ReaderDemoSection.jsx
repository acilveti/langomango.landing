import React from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import Container from './Container';
import OverTitle from './OverTitle';
import ReaderDemoWidget from './ReaderDemoWidget';

// Component for demonstrating the e-reader functionality as a section
export default function ReaderDemoSection({ selectedLanguage }) {
  return (
    <SectionWrapper>
      <Container>
        <HeaderContainer>
          <OverTitle style={{ color: '#ffa500' }}>📖 TRY THE SMART READER</OverTitle>
          <SectionTitle>Start your free trial</SectionTitle>
          <SectionSubtitle>
            It takes less time to jump straight to the free trial than to keep wondering what it will be like
          </SectionSubtitle>
        </HeaderContainer>

        <ReaderDemoWidget selectedLanguage={selectedLanguage} useInlineSignup={true} />
      </Container>
    </SectionWrapper>
  );
}

// Styled Components
const SectionWrapper = styled.section`
  padding: 8rem 0;
  background: #2c7a7b; /* Teal/turquoise background like in the CTA */
  position: relative;
  overflow: hidden;

  ${media('<=tablet')} {
    padding: 5rem 0;
  }
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 5rem;

  ${media('<=tablet')} {
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -0.03em;
  color: white;

  ${media('<=tablet')} {
    font-size: 4rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.8rem;
  color: white;
  max-width: 60rem;
  margin: 0 auto;
  opacity: 0.9;

  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;
