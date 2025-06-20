import React, { useCallback } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import CloseIcon from './CloseIcon';
import Overlay from './Overlay';
import Portal from './Portal';
import useEscClose from 'hooks/useEscKey';
import { Language } from 'contexts/VisitorContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  languages: Language[];
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
  isDark?: boolean;
  hasUserSelected?: boolean;
}

export default function LanguageSelectorModal({
  isOpen,
  onClose,
  languages,
  selectedLanguage,
  onLanguageSelect,
  isDark = false,
  hasUserSelected = false
}: LanguageSelectorModalProps) {
  
  useEscClose({ onClose: isOpen ? onClose : () => {} });

  const handleLanguageSelect = useCallback((language: Language) => {
    onLanguageSelect(language);
    onClose();
  }, [onLanguageSelect, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <Overlay onClick={onClose} />
      <ModalContainer>
        <ModalCard isDark={isDark} onClick={(e) => e.stopPropagation()}>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>
          
          <ModalHeader>
            <ModalTitle isDark={isDark}>Select Your Language</ModalTitle>
            <ModalSubtitle isDark={isDark}>Choose the language you want to learn</ModalSubtitle>
          </ModalHeader>
          
          <LanguageGrid>
            {languages.map((language) => (
              <LanguageOption
                key={language.code}
                isSelected={hasUserSelected && selectedLanguage?.code === language.code}
                onClick={() => handleLanguageSelect(language)}
                isDark={isDark}
              >
                <LanguageFlag>{language.flag}</LanguageFlag>
                <LanguageName isDark={isDark}>{language.name}</LanguageName>
                {hasUserSelected && selectedLanguage?.code === language.code && (
                  <SelectedBadge isDark={isDark}>Selected</SelectedBadge>
                )}
              </LanguageOption>
            ))}
          </LanguageGrid>
        </ModalCard>
      </ModalContainer>
    </Portal>
  );
}

// Styled Components
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  pointer-events: none;

  ${media('<=tablet')} {
    padding: 1rem;
  }
`;

const ModalCard = styled.div<{ isDark?: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  background: ${props => props.isDark ? '#1a1a1a' : 'white'};
  width: 100%;
  max-width: 80rem;
  height: auto;
  max-height: calc(100vh - 4rem);
  color: ${props => props.isDark ? 'white' : 'rgb(var(--text))'};
  overflow: hidden;
  border-radius: 1.6rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  
  ${media('<=tablet')} {
    max-height: calc(100vh - 2rem);
    max-width: 100%;
  }
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 100001;

  svg {
    cursor: pointer;
    width: 2.4rem;
    height: 2.4rem;
    background: white;
    border-radius: 50%;
    padding: 0.4rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  padding: 3rem 2rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2<{ isDark?: boolean }>`
  font-size: 2.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${props => props.isDark ? 'white' : '#1f2937'};
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const ModalSubtitle = styled.p<{ isDark?: boolean }>`
  font-size: 1.4rem;
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.7)' : '#6b7280'};
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.8rem;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  
  ${media('<=desktop')} {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 0.7rem;
  }
  
  ${media('<=tablet')} {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.6rem;
    padding: 1.5rem;
  }
  
  ${media('<=phone')} {
    grid-template-columns: repeat(3, 1fr);
    padding: 1rem;
    gap: 0.5rem;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const LanguageOption = styled.div<{ isSelected: boolean; isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.2rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => {
    if (props.isSelected) {
      return props.isDark ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.1)';
    }
    return props.isDark ? 'rgba(255, 255, 255, 0.05)' : '#f9fafb';
  }};
  border-radius: 0.8rem;
  border: 2px solid ${props => {
    if (props.isSelected) {
      return props.isDark ? 'rgba(255,152,0,0.5)' : 'rgba(255,152,0,0.3)';
    }
    return props.isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
  }};
  text-align: center;
  position: relative;

  &:hover {
    background: ${props => props.isDark ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.08)'};
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.isDark ? 'rgba(255, 152, 0, 0.5)' : 'rgba(255, 152, 0, 0.4)'};
  }
  
  ${media('<=tablet')} {
    padding: 1rem 0.6rem;
    gap: 0.4rem;
  }
  
  ${media('<=phone')} {
    padding: 0.8rem 0.4rem;
  }
`;

const LanguageFlag = styled.span`
  font-size: 2.2rem;
  line-height: 1;
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
  
  ${media('<=phone')} {
    font-size: 1.8rem;
  }
`;

const LanguageName = styled.span<{ isDark?: boolean }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.isDark ? 'white' : '#374151'};
  line-height: 1.2;
  
  ${media('<=tablet')} {
    font-size: 1rem;
  }
  
  ${media('<=phone')} {
    font-size: 0.9rem;
  }
`;

const SelectedBadge = styled.span<{ isDark?: boolean }>`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: ${props => props.isDark ? 'rgba(255, 152, 0, 0.9)' : 'rgb(255, 152, 0)'};
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${media('<=phone')} {
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    top: 0.3rem;
    right: 0.3rem;
  }
`;
