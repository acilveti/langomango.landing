import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useEscClose from 'hooks/useEscKey';
import { media } from 'utils/media';
import CloseIcon from './CloseIcon';
import Container from './Container';
import Overlay from './Overlay';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';

// Component for demonstrating the e-reader functionality
export default function ReaderDemoModal({ onClose, selectedLanguage }) {
  const [currentPage, setCurrentPage] = useState(8);
  const [totalPages] = useState(511);
  const [pageInput, setPageInput] = useState('8');
  const pageRef = useRef(null);
  const longPressTimer = useRef(null);
  const [popup, setPopup] = useState({
    visible: false,
    text: '',
    translation: '',
    x: 0,
    y: 0
  });
  const [isLongPressing, setIsLongPressing] = useState(false);
  const popupJustOpened = useRef(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [translationIntensity, setTranslationIntensity] = useState(5);
  const [showSignupExpanded, setShowSignupExpanded] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEscClose({ onClose });

  // Debug log to check expansion state
  useEffect(() => {
    console.log('Signup expanded:', showSignupExpanded, 'Interaction count:', interactionCount);
  }, [showSignupExpanded, interactionCount]);

  // Book content
  const bookContent = {
    7: {
      paragraphs: [
        {
          segments: [
            {
              text: 'I had to release that stupid anchor that I hated so much. But I had no other choice, so I struck the coral again and again with all the force I could muster underwater.'
            }
          ]
        },
        {
          segments: [
            {
              text: '"But what the hell...?" I asked myself, startled, as the knife bounced back with a sharp vibration.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Where there was coral before'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Where there was coral before,',
              translation: 'Wo früher Korallen waren,',
              showTranslation: true
            },
            {
              text: ' now appeared a layer of green and hard substance, showing me that what I had struck was coral only on its surface. The anchor had caught on a rusty iron ring.'
            }
          ],
          indent: true
        }
      ]
    },
    8: {
      paragraphs: [
        {
          segments: [
            {
              text: 'He opened his eyes',
              translation: 'Er öffnete die Augen',
              showTranslation: true
            },
            {
              text: ' and found himself facing the boatswain who, a few inches away and with water running down his face, was shouting at him at the top of his lungs.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'The storm had grown worse',
              translation: 'Der Sturm war schlimmer geworden'
            },
            {
              text: ' during the night, and the waves crashed over the deck with tremendous force.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Joan struggled to his feet',
              translation: 'Joan kämpfte sich auf die Füße',
              showTranslation: true
            },
            {
              text: ', his body aching from being thrown against the bulkhead.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              translation: 'The door opened',
              text: 'Die Tür öffnete sich'
            },
            {
              text: ' against the howling wind, nearly knocking him backwards.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              translation: 'His eyes burned from the salt',
              text: 'Seine Augen brannten vom Salz'
            },
            {
              text: ' as he stumbled toward the companionway.'
            }
          ],
          indent: true
        }
      ]
    },
    9: {
      paragraphs: [
        {
          segments: [
            {
              text: 'The deck was chaos. Men ran in all directions, some trying to secure loose cargo while others fought to control the sails.'
            }
          ]
        },
        {
          segments: [
            {
              text: 'Through the spray and darkness',
              translation: 'Durch die Gischt und Dunkelheit'
            },
            {
              text: ', Joan could barely make out the torn mainsail flapping wildly in the wind like a wounded bird.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: '"Hold that line!" someone shouted.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'The ship groaned',
              translation: 'Das Schiff ächzte',
              showTranslation: true
            },
            {
              text: ' under the assault of wind and waves, its timbers creaking ominously.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Joan knew they were in mortal danger. If they lost the mainsail completely, they would be at the mercy of the storm.'
            }
          ],
          indent: true
        }
      ]
    }
  };

  // Memoize the handler to avoid dependency issues
  const handleReaderInteraction = useCallback(() => {
    if (!showSignupExpanded) {
      setInteractionCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= 2) {
          setShowSignupExpanded(true);
          trackRedditConversion(RedditEventTypes.VIEW_CONTENT, {
            content_type: 'reader_demo',
            engagement_type: 'signup_prompt'
          });
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
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'reader_demo_signup',
      email: email
    });
    onClose();
    // Redirect with email pre-filled
    window.location.href = `https://beta-app.langomango.com/sign-up?email=${encodeURIComponent(email)}`;
  }, [email, onClose]);

  const handleGoogleSignup = useCallback(() => {
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'reader_demo_google_signup'
    });
    // Implement Google signup logic here
    window.location.href = 'https://staging.langomango.com/auth/login-google?returnUrl=/sign-up&frontendRedirectUrl=https://beta-app.langomango.com/';
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInput((currentPage - 1).toString());
      hidePopup();
      handleReaderInteraction(); // Track interaction
    }
  }, [currentPage, handleReaderInteraction]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageInput((currentPage + 1).toString());
      hidePopup();
      handleReaderInteraction(); // Track interaction
    }
  }, [currentPage, totalPages, handleReaderInteraction]);

  const handlePageInputChange = useCallback((text) => {
    setPageInput(text);
  }, []);

  const handlePageInputSubmit = useCallback(() => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      hidePopup();
    } else {
      setPageInput(currentPage.toString());
    }
  }, [pageInput, totalPages, currentPage]);

  const hidePopup = useCallback(() => {
    if (!popupJustOpened.current) {
      setPopup(prev => ({ ...prev, visible: false }));
    }
  }, []);

  const handleLongPressStart = useCallback((e, segment) => {
    if ('touches' in e) {
      e.stopPropagation();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!segment.translation || segment.showTranslation) return;

    setIsLongPressing(true);
    
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const pageRect = pageRef.current?.getBoundingClientRect();
    
    if (!pageRect) return;

    const x = rect.left - pageRect.left + rect.width / 2;
    const y = rect.top - pageRect.top;

    longPressTimer.current = setTimeout(() => {
      popupJustOpened.current = true;
      setPopup({
        visible: true,
        text: segment.text,
        translation: segment.translation || '',
        x: x,
        y: y
      });
      setIsLongPressing(false);
      
      setTimeout(() => {
        popupJustOpened.current = false;
      }, 200);
    }, 500);
  }, []);

  const handleLongPressEnd = useCallback((e) => {
    if ('touches' in e) {
      e.stopPropagation();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsLongPressing(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // Global click handler
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target;
      
      if (!target.closest('.translation-popup') && !popupJustOpened.current && popup.visible) {
        hidePopup();
      }
      
      if (showSettingsMenu && !target.closest('.settings-menu') && !target.closest('.settings-button')) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [popup.visible, hidePopup, showSettingsMenu]);

  // Get language-specific content
  const getLanguageContent = () => {
    if (!selectedLanguage) return bookContent;
    
    // You can customize content based on selected language
    // For now, we'll use the same content but you can expand this
    switch (selectedLanguage.code) {
      case 'de': // German (already have content)
        return bookContent;
      case 'es': // Spanish example
        return {
          8: {
            paragraphs: [
              {
                segments: [
                  {
                    text: 'Abrió los ojos',
                    translation: 'He opened his eyes',
                    showTranslation: true
                  },
                  {
                    text: ' y se encontró frente al contramaestre que, a pocos centímetros de distancia y con agua corriendo por su rostro, le gritaba a todo pulmón.'
                  }
                ],
                indent: true
              },
              // Add more Spanish content...
            ]
          }
        };
      case 'fr': // French example
        return {
          8: {
            paragraphs: [
              {
                segments: [
                  {
                    text: 'Il ouvrit les yeux',
                    translation: 'He opened his eyes',
                    showTranslation: true
                  },
                  {
                    text: ' et se retrouva face au maître d\'équipage qui, à quelques centimètres de lui et avec de l\'eau coulant sur son visage, lui criait à pleins poumons.'
                  }
                ],
                indent: true
              },
              // Add more French content...
            ]
          }
        };
      default:
        return bookContent; // Default to German content
    }
  };

  const languageContent = getLanguageContent();
  const currentContent = languageContent[currentPage] || languageContent[8] || bookContent[8];

  return (
    <Overlay>
      <ModalContainer>
        <ReaderCard>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          <ReaderContainer $expanded={showSignupExpanded}>
            {/* Language indicator */}
            {selectedLanguage && (
              <LanguageIndicator>
                <span>{selectedLanguage.flag}</span>
                <span>{selectedLanguage.name}</span>
              </LanguageIndicator>
            )}
            
            {/* Left Navigation */}
            <NavButtonLeft 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
            >
              ‹
            </NavButtonLeft>

            {/* Book Content */}
            <BookContent ref={pageRef} onClick={handleReaderInteraction}>
              <ContentArea>
                {currentContent.paragraphs.map((paragraph, index) => (
                  <ParagraphContainer 
                    key={index} 
                    $indent={paragraph.indent}
                    $isLast={index === currentContent.paragraphs.length - 1}
                  >
                    {paragraph.segments.map((segment, segmentIndex) => {
                      const key = `${index}-${segmentIndex}`;
                      
                      if (segment.translation && !segment.showTranslation) {
                        return (
                          <TranslatableText
                            key={key}
                            onMouseDown={(e) => handleLongPressStart(e, segment)}
                            onMouseUp={handleLongPressEnd}
                            onMouseLeave={handleLongPressEnd}
                            onTouchStart={(e) => handleLongPressStart(e, segment)}
                            onTouchEnd={handleLongPressEnd}
                            onTouchCancel={handleLongPressEnd}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            {segment.text}
                          </TranslatableText>
                        );
                      } else if (segment.translation && segment.showTranslation) {
                        return (
                          <InlineTranslation key={key}>
                            <OriginalText>{segment.text}</OriginalText>
                            <TranslationText>{segment.translation}</TranslationText>
                          </InlineTranslation>
                        );
                      } else {
                        return <span key={key}>{segment.text}</span>;
                      }
                    })}
                  </ParagraphContainer>
                ))}
              </ContentArea>

              {/* Translation Popup */}
              {popup.visible && (
                <TranslationPopup
                  className="translation-popup"
                  style={{
                    left: Math.min(Math.max(20, popup.x), 400),
                    top: Math.max(20, popup.y - 60)
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <PopupText>{popup.translation}</PopupText>
                  <PopupArrow />
                </TranslationPopup>
              )}
            </BookContent>

            {/* Right Navigation */}
            <NavButtonRight 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
            >
              ›
            </NavButtonRight>
          </ReaderContainer>

          {/* Bottom Navigation Bar and Signup */}
          <BottomSection $expanded={showSignupExpanded}>
            <BottomBar>
              {/* Left controls */}
              <ControlGroup>
                <IconButton>☰</IconButton>
                <IconButton>?</IconButton>
              </ControlGroup>

              {/* Page navigation */}
              <PageNavigation>
                <PageNavButton 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                >
                  &lt;
                </PageNavButton>
                
                <PageInputContainer>
                  <PageInput
                    type="text"
                    value={pageInput}
                    onChange={(e) => handlePageInputChange(e.target.value)}
                    onBlur={handlePageInputSubmit}
                    onKeyPress={(e) => e.key === 'Enter' && handlePageInputSubmit()}
                    maxLength={3}
                  />
                  <PageTotal>/ {totalPages}</PageTotal>
                </PageInputContainer>

                <PageNavButton 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </PageNavButton>
              </PageNavigation>

              {/* Right controls */}
              <ControlGroup>
                <IconButton>⚙</IconButton>
                <IconButton 
                  className="settings-button"
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                >
                  ⋯
                </IconButton>
              </ControlGroup>
            </BottomBar>

            {/* Signup Section */}
            <SignupSection $expanded={showSignupExpanded}>
              {!showSignupExpanded ? (
                <SignupCompact>
                  <PromptText>📚 Continue reading with a free account</PromptText>
                  <CompactFormRow>
                    <EmailInputCompact
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
                    <SignupButtonCompact onClick={handleSignup}>Sign up free</SignupButtonCompact>
                  </CompactFormRow>
                  {emailError && <ErrorTextCompact>{emailError}</ErrorTextCompact>}
                  <DividerCompact>
                    <DividerLine />
                    <DividerText>or</DividerText>
                    <DividerLine />
                  </DividerCompact>
                  <GoogleButtonCompact onClick={handleGoogleSignup}>
                    <GoogleIcon>
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </GoogleIcon>
                    Continue with Google
                  </GoogleButtonCompact>
                </SignupCompact>
              ) : (
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
                      <GoogleIcon>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </GoogleIcon>
                      Continue with Google
                    </GoogleButton>
                  </ButtonContainer>
                  
                  <LoginPrompt>
                    Already have an account? <LoginLink href="https://beta-app.langomango.com/login">Log in</LoginLink>
                  </LoginPrompt>
                </SignupExpanded>
              )}
            </SignupSection>
          </BottomSection>

          {/* Settings Menu */}
          {showSettingsMenu && (
            <SettingsMenu className="settings-menu">
              <SettingRow>
                <SettingLabel>Translation intensity</SettingLabel>
                <SettingControls>
                  <SettingButton 
                    onClick={() => setTranslationIntensity(Math.max(0, translationIntensity - 1))}
                  >
                    -
                  </SettingButton>
                  <SettingValue>{translationIntensity}</SettingValue>
                  <SettingButton 
                    onClick={() => setTranslationIntensity(Math.min(10, translationIntensity + 1))}
                  >
                    +
                  </SettingButton>
                </SettingControls>
              </SettingRow>

              <SettingRow>
                <SettingLabel>Wordwise assistance</SettingLabel>
                <SettingControls>
                  <SettingButton>-</SettingButton>
                  <SettingValue>10</SettingValue>
                  <SettingButton>+</SettingButton>
                </SettingControls>
              </SettingRow>

              <FontControls>
                <FontButton>A-</FontButton>
                <FontButton>A+</FontButton>
              </FontControls>
            </SettingsMenu>
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
  width: 85vw;
  max-width: 65rem;
  height: 80vh;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media('<=tablet')} {
    width: 95vw;
    height: 90vh;
    max-height: 90vh;
  }
`;

const ReaderCard = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  background: rgb(var(--modalBackground));
  border-radius: 0.6rem;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: rgb(var(--text));
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 2rem;
  top: 2rem;
  z-index: 300;

  svg {
    cursor: pointer;
    width: 2rem;
  }
`;

const ReaderContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow: hidden;
  
  ${props => props.$expanded && `
    height: 30%;
  `}
`;

const NavButtonLeft = styled.button`
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  font-size: 2.4rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 1rem 0 0;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${media('<=tablet')} {
    padding: 0.8rem;
    font-size: 2rem;
    margin: 0 0.5rem 0 0;
  }
`;

const NavButtonRight = styled.button`
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  font-size: 2.4rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 0 0 1rem;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${media('<=tablet')} {
    padding: 0.8rem;
    font-size: 2rem;
    margin: 0 0 0 0.5rem;
  }
`;

const BookContent = styled.div`
  flex: 1;
  max-width: 50rem;
  height: 100%;
  background: white;
  border-radius: 0.8rem;
  padding: 3rem;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;

  ${media('<=tablet')} {
    padding: 2rem;
    max-width: 100%;
  }
`;

const ContentArea = styled.div`
  font-family: Georgia, serif;
  font-size: 1.6rem;
  line-height: 2.8rem;
  color: #1f2937;
  width: 100%;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ParagraphContainer = styled.div`
  margin-left: ${props => props.$indent ? '2rem' : '0'};
  margin-bottom: ${props => props.$isLast ? '0' : '1.6rem'};
  text-align: left;
  width: 100%;

  ${media('<=tablet')} {
    margin-left: ${props => props.$indent ? '1.2rem' : '0'};
  }
`;

const TranslatableText = styled.span`
  cursor: pointer;
  border-bottom: 1px dotted #cbd5e1;
  padding-bottom: 1px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  touch-action: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fef3c7;
  }
`;

const InlineTranslation = styled.span`
  display: inline-block;
`;

const OriginalText = styled.span`
  display: block;
  font-weight: bold;
  font-size: 1.3rem;
  line-height: 1.8rem;
`;

const TranslationText = styled.span`
  display: block;
  font-size: 1.3rem;
  line-height: 1.8rem;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 1px;
`;

const TranslationPopup = styled.div`
  position: absolute;
  background: white;
  color: black;
  padding: 1.2rem 1.6rem;
  border-radius: 0.8rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
  border: 1px solid #9ca3af;
  transform: translateX(-50%);
  min-width: 15rem;
  max-width: 30rem;
  pointer-events: auto;
`;

const PopupText = styled.p`
  margin: 0;
  font-size: 1.4rem;
  text-align: center;
`;

const PopupArrow = styled.div`
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #9ca3af;
  pointer-events: none;
`;

const BottomSection = styled.div`
  position: relative;
  background: white;
  transition: all 0.4s ease;
  overflow: hidden;
  
  ${props => props.$expanded ? `
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    z-index: 200;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
    border-radius: 2rem 2rem 0 0;
    overflow-y: auto;
    animation: slideUp 0.4s ease-out;
  ` : `
    flex-shrink: 0;
  `}
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.2rem 2rem;
  flex-shrink: 0;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const IconButton = styled.button`
  padding: 0.8rem;
  background: white;
  border: none;
  border-radius: 0.8rem;
  font-size: 2rem;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const PageNavButton = styled.button`
  background: white;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 1.6rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.4rem;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const PageInput = styled.input`
  width: 6rem;
  padding: 0.4rem 0.8rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  background: white;

  &:focus {
    outline: none;
    border-color: rgb(var(--primary));
  }
`;

const PageTotal = styled.span`
  font-size: 1.4rem;
  color: #6b7280;
`;

const SignupSection = styled.div`
  background: white;
  padding: ${props => props.$expanded ? '3rem' : '1.2rem'};
  border-top: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  
  ${media('<=tablet')} {
    padding: ${props => props.$expanded ? '2rem' : '1rem'};
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

const CompactFormRow = styled.div`
  display: flex;
  gap: 0.8rem;
  width: 100%;
  align-items: stretch;
  
  ${media('<=tablet')} {
    gap: 0.6rem;
  }
`;

const CompactFormContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: center;
  
  ${media('<=tablet')} {
    flex-direction: column;
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
    border-color: ${props => props.$hasError ? '#ef4444' : 'rgb(var(--primary))'};;
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

const ErrorTextCompact = styled.span`
  color: #ef4444;
  font-size: 1.1rem;
  text-align: left;
  width: 100%;
  margin-top: -0.5rem;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 1.4rem;
  text-align: center;
  width: 100%;
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
  
  ${media('<=tablet')} {
    padding: 0.8rem 1.2rem;
    font-size: 1.2rem;
  }
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

const SignupButton = styled.button`
  background: #ff9800;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  
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
    font-size: 1.3rem;
    padding: 0.8rem 1.5rem;
    width: 100%;
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

const GoogleIcon = styled.div`
  display: flex;
  align-items: center;
`;

const LoginPrompt = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  margin: 1rem 0 0;
`;

const LoginLink = styled.a`
  color: rgb(var(--primary));
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SettingsMenu = styled.div`
  position: absolute;
  bottom: 6rem;
  left: 0;
  right: 0;
  background: white;
  border-radius: 1.2rem 1.2rem 0 0;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 2.4rem;
  z-index: 50;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-of-type {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-size: 1.6rem;
  font-weight: 500;
  color: #374151;
`;

const SettingControls = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

const SettingButton = styled.button`
  padding: 1.2rem;
  background: white;
  border: none;
  border-radius: 0.8rem;
  font-size: 2rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const SettingValue = styled.span`
  font-size: 2rem;
  font-weight: 500;
  min-width: 3rem;
  text-align: center;
`;

const FontControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  margin-top: 2.4rem;
`;

const FontButton = styled.button`
  padding: 1.2rem 2.4rem;
  background: white;
  border: none;
  border-radius: 0.8rem;
  font-size: 2.4rem;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const LanguageIndicator = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  font-size: 1.2rem;
  color: #374151;
  
  ${media('<=tablet')} {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
`;
