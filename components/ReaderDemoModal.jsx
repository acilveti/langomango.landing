import React from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import ReaderDemoWidget from './ReaderDemoWidget';
import CloseIcon from './CloseIcon';
import Overlay from './Overlay';
import useEscClose from 'hooks/useEscKey';

// Reader Demo Modal component
export default function ReaderDemoModal({ onClose, selectedLanguage }) {
  useEscClose({ onClose });

  return (
    <Overlay>
      <ModalContainer>
        <ReaderCard>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          <ReaderDemoWidget 
            selectedLanguage={selectedLanguage} 
            useInlineSignup={true} 
          />
        </ReaderCard>
      </ModalContainer>
    </Overlay>
  );
}

// Styled Components
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: auto;
  max-width: 65rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media('<=tablet')} {
    width: 95vw;
  }
`;

const ReaderCard = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  background: transparent;
  width: 100%;
  height: fit-content;
  color: rgb(var(--text));
`;

const CloseIconContainer = styled.div`
  position: absolute;
  left: 1rem; /* Moved to left side to avoid overlap */
  top: 1rem;
  z-index: 350;

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


