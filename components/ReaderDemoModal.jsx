import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import ReaderDemoWidget from './ReaderDemoWidget';
import CloseIcon from './CloseIcon';
import Overlay from './Overlay';
import useEscClose from 'hooks/useEscKey';

// Reader Demo Modal component
export default function ReaderDemoModal({ onClose, selectedLanguage }) {
  const [showSignupExpanded, setShowSignupExpanded] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEscClose({ onClose });

  // Track interactions
  const handleReaderInteraction = useCallback(() => {
    if (!showSignupExpanded) {
      setInteractionCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= 2) {
          setShowSignupExpanded(true);
        }
        return newCount;
      });
    }
  }, [showSignupExpanded]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = useCallback(() => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }
    
    setEmailError('');
    onClose();
    // Redirect with email pre-filled
    window.location.href = `https://beta-app.langomango.com/sign-up?email=${encodeURIComponent(email)}`;
  }, [email, onClose]);

  const handleGoogleSignup = useCallback(() => {
    window.location.href = 'https://staging.langomango.com/auth/login-google?returnUrl=/sign-up&frontendRedirectUrl=https://beta-app.langomango.com/';
  }, []);

  return (
    <Overlay>
      <ModalContainer>
        <ReaderCard>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          <ReaderDemoWidget selectedLanguage={selectedLanguage} onInteraction={handleReaderInteraction} />

          {/* Signup Section */}
          {showSignupExpanded && (
            <SignupSection>
              <SignupExpanded>
                <SignupTitle>✨ Create your free account to continue</SignupTitle>
                <SignupSubtitle>Start learning languages with interactive reading</SignupSubtitle>
                
                <ButtonContainer>
                  <EmailInputExpanded
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                    $hasError={!!emailError}
                  />
                  {emailError && <ErrorText>{emailError}</ErrorText>}
                  <PrimaryButton onClick={handleSignup}>
                    Sign up with Email
                  </PrimaryButton>
                  
                  <GoogleButton onClick={handleGoogleSignup}>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </GoogleButton>
                </ButtonContainer>
                
                <LoginPrompt>
                  Already have an account? <LoginLink href="https://beta-app.langomango.com/login">Log in</LoginLink>
                </LoginPrompt>
              </SignupExpanded>
            </SignupSection>
          )}
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

const SignupSection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  z-index: 200;
  background: white;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 2rem 2rem 0 0;
  overflow-y: auto;
  animation: slideUp 0.4s ease-out;
  padding: 3rem;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  ${media('<=tablet')} {
    padding: 2rem;
  }
`;

const SignupCompact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  max-width: 45rem;
  margin: 0 auto;
  width: 100%;
`;

const PromptText = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #374151;
  font-weight: 500;
  text-align: center;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const CompactFormRow = styled.div`
  display: flex;
  gap: 0.8rem;
  width: 100%;
  align-items: stretch;
  
  ${media('<=tablet')} {
    gap: 0.6rem;
  }
`;

const EmailInputCompact = styled.input`
  flex: 1;
  padding: 0.9rem 1.2rem;
  font-size: 1.3rem;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 0.6rem;
  outline: none;
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    border-color: ${props => props.$hasError ? '#ef4444' : 'rgb(var(--primary))'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(var(--primary), 0.1)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  ${media('<=tablet')} {
    padding: 0.8rem 1rem;
    font-size: 1.2rem;
  }
`;

const SignupButtonCompact = styled.button`
  background: #ff9800;
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    background: #f57c00;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    background: #e65100;
  }
  
  ${media('<=tablet')} {
    padding: 0.8rem 1.2rem;
    font-size: 1.2rem;
  }
`;

const ErrorTextCompact = styled.span`
  color: #ef4444;
  font-size: 1.1rem;
  text-align: left;
  width: 100%;
  margin-top: -0.5rem;
`;

const DividerCompact = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.8rem;
  margin: 0.2rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
`;

const DividerText = styled.span`
  color: #6b7280;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const GoogleButtonCompact = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 0.6rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SignupExpanded = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
`;

const SignupTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const SignupSubtitle = styled.p`
  font-size: 1.6rem;
  color: #6b7280;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 30rem;
`;

const EmailInputExpanded = styled.input`
  width: 100%;
  padding: 1.4rem 1.8rem;
  font-size: 1.6rem;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 0.8rem;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.$hasError ? '#ef4444' : 'rgb(var(--primary))'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(var(--primary), 0.1)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 1.4rem;
  text-align: center;
  width: 100%;
`;

const PrimaryButton = styled.button`
  background: #ff9800;
  color: white;
  border: none;
  padding: 1.4rem 2rem;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f57c00;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    background: #e65100;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1.4rem 2rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoginPrompt = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const LoginLink = styled.a`
  color: rgb(var(--primary));
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;
