import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useEscClose from 'hooks/useEscKey';
import { media } from 'utils/media';
import CloseIcon from './CloseIcon';
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
  const [showSignupExpanded, setShowSignupExpanded] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  useEscClose({ onClose });

  // Translations for different languages
  const translations = {
    de: {
      'Where there was coral before,': 'Wo früher Korallen waren,',
      'He opened his eyes': 'Er öffnete die Augen',
      'The storm had grown worse': 'Der Sturm war schlimmer geworden',
      'Joan struggled to his feet': 'Joan kämpfte sich auf die Füße',
      'The door opened': 'Die Tür öffnete sich',
      'His eyes burned from the salt': 'Seine Augen brannten vom Salz',
      'Through the spray and darkness': 'Durch die Gischt und Dunkelheit',
      'The ship groaned': 'Das Schiff ächzte'
    },
    es: {
      'Where there was coral before,': 'Donde antes había coral,',
      'He opened his eyes': 'Abrió los ojos',
      'The storm had grown worse': 'La tormenta había empeorado',
      'Joan struggled to his feet': 'Joan luchó para ponerse de pie',
      'The door opened': 'La puerta se abrió',
      'His eyes burned from the salt': 'Sus ojos ardían por la sal',
      'Through the spray and darkness': 'A través del rocío y la oscuridad',
      'The ship groaned': 'El barco crujió'
    },
    fr: {
      'Where there was coral before,': 'Là où il y avait du corail avant,',
      'He opened his eyes': 'Il ouvrit les yeux',
      'The storm had grown worse': 'La tempête avait empiré',
      'Joan struggled to his feet': 'Joan se leva avec difficulté',
      'The door opened': 'La porte s\'ouvrit',
      'His eyes burned from the salt': 'Ses yeux brûlaient à cause du sel',
      'Through the spray and darkness': 'À travers les embruns et l\'obscurité',
      'The ship groaned': 'Le navire gémit'
    },
    it: {
      'Where there was coral before,': 'Dove prima c\'era il corallo,',
      'He opened his eyes': 'Aprì gli occhi',
      'The storm had grown worse': 'La tempesta era peggiorata',
      'Joan struggled to his feet': 'Joan si alzò a fatica',
      'The door opened': 'La porta si aprì',
      'His eyes burned from the salt': 'I suoi occhi bruciavano per il sale',
      'Through the spray and darkness': 'Attraverso gli spruzzi e l\'oscurità',
      'The ship groaned': 'La nave gemette'
    },
    pt: {
      'Where there was coral before,': 'Onde antes havia coral,',
      'He opened his eyes': 'Ele abriu os olhos',
      'The storm had grown worse': 'A tempestade havia piorado',
      'Joan struggled to his feet': 'Joan lutou para se levantar',
      'The door opened': 'A porta se abriu',
      'His eyes burned from the salt': 'Seus olhos ardiam do sal',
      'Through the spray and darkness': 'Através do spray e da escuridão',
      'The ship groaned': 'O navio gemeu'
    },
    zh: {
      'Where there was coral before,': '以前有珊瑚的地方，',
      'He opened his eyes': '他睁开了眼睛',
      'The storm had grown worse': '暴风雨变得更糟了',
      'Joan struggled to his feet': '琼挣扎着站起来',
      'The door opened': '门打开了',
      'His eyes burned from the salt': '他的眼睛被盐灼伤',
      'Through the spray and darkness': '穿过浪花和黑暗',
      'The ship groaned': '船呻吟着'
    },
    ja: {
      'Where there was coral before,': '以前サンゴがあった場所に、',
      'He opened his eyes': '彼は目を開いた',
      'The storm had grown worse': '嵐はさらに悪化していた',
      'Joan struggled to his feet': 'ジョアンは立ち上がろうと奮闘した',
      'The door opened': 'ドアが開いた',
      'His eyes burned from the salt': '彼の目は塩で焼けるようだった',
      'Through the spray and darkness': '飛沫と暗闇を通して',
      'The ship groaned': '船がうめいた'
    },
    ko: {
      'Where there was coral before,': '이전에 산호가 있던 곳에,',
      'He opened his eyes': '그는 눈을 떴다',
      'The storm had grown worse': '폭풍은 더욱 심해졌다',
      'Joan struggled to his feet': '조안은 일어서려고 애썼다',
      'The door opened': '문이 열렸다',
      'His eyes burned from the salt': '그의 눈은 소금으로 타는 듯했다',
      'Through the spray and darkness': '물보라와 어둠을 통해',
      'The ship groaned': '배가 신음했다'
    },
    ru: {
      'Where there was coral before,': 'Там, где раньше были кораллы,',
      'He opened his eyes': 'Он открыл глаза',
      'The storm had grown worse': 'Шторм усилился',
      'Joan struggled to his feet': 'Жоан с трудом поднялся на ноги',
      'The door opened': 'Дверь открылась',
      'His eyes burned from the salt': 'Его глаза жгла соль',
      'Through the spray and darkness': 'Сквозь брызги и темноту',
      'The ship groaned': 'Корабль застонал'
    }
  };

  // Function to get translation based on selected language
  const getTranslation = (englishText) => {
    if (!selectedLanguage || !englishText) return englishText;
    const langCode = selectedLanguage.code;
    const langTranslations = translations[langCode];
    return langTranslations?.[englishText] || translations.de[englishText] || englishText;
  };

  // Book content (base English content)
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
              translationKey: 'Where there was coral before,',
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
              translationKey: 'He opened his eyes',
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
              translationKey: 'The storm had grown worse'
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
              translationKey: 'Joan struggled to his feet',
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
              text: 'The door opened',
              translationKey: 'The door opened'
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
              text: 'His eyes burned from the salt',
              translationKey: 'His eyes burned from the salt'
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
              translationKey: 'Through the spray and darkness'
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
              translationKey: 'The ship groaned',
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
    setPopup(prev => ({ ...prev, visible: false }));
  }, []);

  const handleLongPressStart = useCallback((e, segment) => {
    if ('touches' in e) {
      e.stopPropagation();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!segment.translationKey || segment.showTranslation) return;
    
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const pageRect = pageRef.current?.getBoundingClientRect();
    
    if (!pageRect) return;

    const x = rect.left - pageRect.left + rect.width / 2;
    const y = rect.top - pageRect.top;

    longPressTimer.current = setTimeout(() => {
      setPopup({
        visible: true,
        text: segment.text,
        translation: getTranslation(segment.translationKey),
        x: x,
        y: y
      });
    }, 500);
  }, [getTranslation]);

  const handleLongPressEnd = useCallback((e) => {
    if ('touches' in e) {
      e.stopPropagation();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
    
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
      
      if (!target.closest('.translation-popup') && popup.visible) {
        hidePopup();
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [popup.visible, hidePopup]);

  const currentContent = bookContent[currentPage] || bookContent[8];

  return (
    <Overlay>
      <ModalContainer>
        <ReaderCard>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          <ReaderContainer $expanded={showSignupExpanded}>
            {/* Language indicator */}
            <LanguageIndicator>
              <span>{selectedLanguage ? selectedLanguage.flag : '🇩🇪'}</span>
              <span>{selectedLanguage ? selectedLanguage.name : 'German'}</span>
            </LanguageIndicator>
            
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
                      
                      if (segment.translationKey && !segment.showTranslation) {
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
                      } else if (segment.translationKey && segment.showTranslation) {
                        return (
                          <InlineTranslation key={key}>
                            <OriginalText>{segment.text}</OriginalText>
                            <TranslationText>{getTranslation(segment.translationKey)}</TranslationText>
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
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
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
              )}
            </SignupSection>
          </BottomSection>
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
  justify-content: center;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.2rem 2rem;
  flex-shrink: 0;
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
