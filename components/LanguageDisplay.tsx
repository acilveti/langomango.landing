import React from 'react';
import styled from 'styled-components';
import { useVisitor } from 'contexts/VisitorContext';

// Example component showing how to use the language context
export default function LanguageDisplay() {
  const { selectedLanguage, setSelectedLanguage, availableLanguages } = useVisitor();

  // Example: Show current language
  if (!selectedLanguage) {
    return <Container>No language selected</Container>;
  }

  return (
    <Container>
      <Title>Current Language</Title>
      <LanguageInfo>
        <Flag>{selectedLanguage.flag}</Flag>
        <Name>{selectedLanguage.name}</Name>
        <Code>({selectedLanguage.code})</Code>
      </LanguageInfo>
      
      {/* Example: Quick language switcher */}
      <QuickSwitcher>
        <SubTitle>Quick Switch:</SubTitle>
        <LanguageButtons>
          {availableLanguages.slice(0, 5).map((lang) => (
            <LanguageButton
              key={lang.code}
              onClick={() => setSelectedLanguage(lang)}
              isActive={selectedLanguage.code === lang.code}
              title={lang.name}
            >
              {lang.flag}
            </LanguageButton>
          ))}
        </LanguageButtons>
      </QuickSwitcher>
    </Container>
  );
}

// Styled components
const Container = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.8rem;
  border: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #374151;
`;

const SubTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #6b7280;
`;

const LanguageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const Flag = styled.span`
  font-size: 2rem;
`;

const Name = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: #1f2937;
`;

const Code = styled.span`
  font-size: 1.2rem;
  color: #6b7280;
`;

const QuickSwitcher = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const LanguageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LanguageButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem;
  font-size: 1.5rem;
  background: ${props => props.isActive ? 'rgba(255, 152, 0, 0.2)' : 'white'};
  border: 2px solid ${props => props.isActive ? 'rgb(255, 152, 0)' : '#e5e7eb'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: rgb(255, 152, 0);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
