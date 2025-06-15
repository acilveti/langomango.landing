import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { media } from 'utils/media';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';

// Standalone Reader Demo Widget
export default function ReaderDemoWidget({ selectedLanguage, onInteraction, useInlineSignup = false }) {
  const [currentPage, setCurrentPage] = useState(8);
  const [totalPages] = useState(511);
  const [pageInput, setPageInput] = useState('8');
  const [pageChangeCount, setPageChangeCount] = useState(0);
  const [showSignupExpanded, setShowSignupExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [wordsRead, setWordsRead] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showWordCounts, setShowWordCounts] = useState(false);
  const pageRef = useRef(null);
  const longPressTimer = useRef(null);
  const wordsTimerRef = useRef(null);
  const widgetRef = useRef(null);
  const { setIsModalOpened } = useNewsletterModalContext();
  const [popup, setPopup] = useState({
    visible: false,
    text: '',
    translation: '',
    x: 0,
    y: 0
  });

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).length;
  };

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

  // Book content (base English content) - 3 paragraphs per page
  const bookContent = {
    7: {
      paragraphs: [
        {
          segments: [
            {
              text: 'The morning sun cast long shadows across the water as I dove beneath the waves. The anchor chain stretched taut below me, disappearing into the coral reef.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'I had been working for hours, my lungs burning with each dive. The coral had grown thick around the anchor over the years.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'I had to release that stupid anchor that I hated so much. But I had no other choice, so I struck the coral again and again with all the force I could muster underwater.'
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
          ],
          indent: true
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
              text: 'The ship groaned',
              translationKey: 'The ship groaned',
              showTranslation: true
            },
            {
              text: ' under the assault of wind and waves, its timbers creaking ominously.'
            }
          ],
          indent: true
        }
      ]
    }
  };

  // Handle interactions - either use provided callback or default behavior
  const handleInteraction = useCallback(() => {
    if (onInteraction) {
      // If parent component provides interaction handler, use it
      onInteraction();
    } else if (useInlineSignup) {
      // Use inline signup (sliding from bottom)
      const newCount = pageChangeCount + 1;
      setPageChangeCount(newCount);
      
      if (newCount >= 2 && !showSignupExpanded) {
        setShowSignupExpanded(true);
      }
    } else {
      // Default behavior: open newsletter modal after 2 interactions
      const newCount = pageChangeCount + 1;
      setPageChangeCount(newCount);
      
      if (newCount >= 2) {
        setIsModalOpened(true);
        setPageChangeCount(0);
      }
    }
  }, [pageChangeCount, setIsModalOpened, onInteraction, useInlineSignup, showSignupExpanded]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInput((currentPage - 1).toString());
      hidePopup();
      handleInteraction();
    }
  }, [currentPage, handleInteraction]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageInput((currentPage + 1).toString());
      hidePopup();
      handleInteraction();
      
      // Update words read on first click
      if (!hasClicked) {
        setHasClicked(true);
        setWordsRead(12); // Changed from 9 to 12
      }
    }
  }, [currentPage, totalPages, handleInteraction, hasClicked]);

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
    // Redirect with email pre-filled
    window.location.href = `https://beta-app.langomango.com/sign-up?email=${encodeURIComponent(email)}`;
  }, [email]);

  const handleGoogleSignup = useCallback(() => {
    window.location.href = 'https://staging.langomango.com/auth/login-google?returnUrl=/sign-up&frontendRedirectUrl=https://beta-app.langomango.com/';
  }, []);

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

  // Check if widget is visible and start word counter
  useEffect(() => {
    let hasStartedTimer = false;
    let visibilityTimer = null;
    
    const checkVisibility = () => {
      if (widgetRef.current && !hasStartedTimer) {
        const rect = widgetRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Check if the ENTIRE widget is visible in viewport
        const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight;
        
        if (isFullyVisible) {
          // If not already timing, start the 2-second visibility timer
          if (!visibilityTimer) {
            visibilityTimer = setTimeout(() => {
              hasStartedTimer = true;
              // Show word counts first
              setShowWordCounts(true);
              // Then update global counter 1 second later
              wordsTimerRef.current = setTimeout(() => {
                setWordsRead(9);
              }, 1000); // 1 second after word counts appear
            }, 2000); // Must be visible for 2 seconds
          }
        } else {
          // Widget is not fully visible, clear the visibility timer
          if (visibilityTimer) {
            clearTimeout(visibilityTimer);
            visibilityTimer = null;
          }
        }
      }
    };

    // Check visibility on mount and scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Also check after mount
    const mountTimer = setTimeout(checkVisibility, 500);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      clearTimeout(mountTimer);
      if (visibilityTimer) {
        clearTimeout(visibilityTimer);
      }
      if (wordsTimerRef.current) {
        clearTimeout(wordsTimerRef.current);
      }
    };
  }, []);

  const currentContent = bookContent[currentPage] || bookContent[8];

  return (
    <WidgetWrapper $expanded={showSignupExpanded} ref={widgetRef}>
      <ReaderWrapper className={showSignupExpanded ? 'reader-wrapper' : ''}>
      <ReaderContainer>
        {/* Left Navigation */}
        <NavButtonLeft 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          &#8249;
        </NavButtonLeft>

        {/* Right Navigation - Enhanced with animations */}
        <NavButtonRight 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          &#8250;
          <PulseRing />
          <HintText>NEXT</HintText>
          <ArrowIndicator>
            <span>→</span>
            <span>→</span>
            <span>→</span>
          </ArrowIndicator>
        </NavButtonRight>
        {/* Language indicator */}
        <LanguageIndicator>
          <span>{selectedLanguage ? selectedLanguage.flag : '🇩🇪'}</span>
          <span>{selectedLanguage ? selectedLanguage.name : 'German'}</span>
        </LanguageIndicator>
        
        {/* Words Read Counter */}
        <WordsReadCounter $hasWords={wordsRead > 0}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <WordsNumber key={wordsRead}>{wordsRead}</WordsNumber>
            <span>words read</span>
          </div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
            in {selectedLanguage ? selectedLanguage.name : 'German'}
          </div>
        </WordsReadCounter>

        {/* Book Content */}
        <BookContent ref={pageRef}>
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
                    const translatedText = getTranslation(segment.translationKey);
                    const wordCount = getWordCount(translatedText);
                    return (
                      <InlineTranslation key={key}>
                        {showWordCounts && (
                          <WordCountBadge key={`badge-${key}`}>
                            {wordCount} words in {selectedLanguage ? selectedLanguage.name : 'German'}
                          </WordCountBadge>
                        )}
                        <OriginalText>{segment.text}</OriginalText>
                        <TranslationText>{translatedText}</TranslationText>
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
      </ReaderContainer>

      {/* Bottom Navigation Bar */}
      <BottomBar>
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
    </ReaderWrapper>
      
      {/* Inline Signup Section */}
      {useInlineSignup && showSignupExpanded && (
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
    </WidgetWrapper>
  );
}

// Animation Keyframes
const vibrateWithIntervals = keyframes`
  0%, 2% { transform: translateY(-50%) translateX(0); }
  2.5% { transform: translateY(-50%) translateX(-3px); }
  3% { transform: translateY(-50%) translateX(3px); }
  3.5% { transform: translateY(-50%) translateX(-3px); }
  4% { transform: translateY(-50%) translateX(3px); }
  4.5% { transform: translateY(-50%) translateX(-2px); }
  5% { transform: translateY(-50%) translateX(2px); }
  5.5% { transform: translateY(-50%) translateX(0); }
  
  6%, 25% { transform: translateY(-50%) translateX(0); }
  
  25.5% { transform: translateY(-50%) translateX(-3px); }
  26% { transform: translateY(-50%) translateX(3px); }
  26.5% { transform: translateY(-50%) translateX(-3px); }
  27% { transform: translateY(-50%) translateX(3px); }
  27.5% { transform: translateY(-50%) translateX(-2px); }
  28% { transform: translateY(-50%) translateX(2px); }
  28.5% { transform: translateY(-50%) translateX(0); }
  
  29%, 50% { transform: translateY(-50%) translateX(0); }
  
  50.5% { transform: translateY(-50%) translateX(-3px); }
  51% { transform: translateY(-50%) translateX(3px); }
  51.5% { transform: translateY(-50%) translateX(-3px); }
  52% { transform: translateY(-50%) translateX(3px); }
  52.5% { transform: translateY(-50%) translateX(-2px); }
  53% { transform: translateY(-50%) translateX(2px); }
  53.5% { transform: translateY(-50%) translateX(0); }
  
  54%, 100% { transform: translateY(-50%) translateX(0); }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const arrowSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateX(10px);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 152, 0, 0);
  }
  50% {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 152, 0, 0.4);
  }
  100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 152, 0, 0);
  }
`;

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0;
  }
  20%, 80% {
    opacity: 1;
  }
`;

const popIn = keyframes`
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(10deg);
  }
  70% {
    transform: scale(0.9) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const countUp = keyframes`
  0% {
    transform: translateY(100%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateY(-20%) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const slideInFade = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const successGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
`;

// Styled Components
const WidgetWrapper = styled.div`
  position: relative;
  width: 100%;
  ${props => props.$expanded && `
    .reader-wrapper {
      transform: scale(0.85);
      transition: transform 0.4s ease;
    }
  `}
`;

const ReaderWrapper = styled.div`
  background: white;
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 90rem;
  margin: 0 auto;
  position: relative;
  border: 3px solid rgb(var(--secondary));
  transition: transform 0.4s ease;
  transform-origin: top center;
  width: 100%;
  z-index: 20;
  
  ${props => props.className === 'reader-wrapper' ? 'transform: scale(0.85);' : ''}
`;

const ReaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 7rem;
  position: relative;
  background: white;
  
  ${media('<=tablet')} {
    padding: 1.5rem 5rem;
    flex-direction: column;
    gap: 2rem;
  }
  
  ${media('<=phone')} {
    padding: 1.5rem 4rem;
  }
`;

const NavButtonLeft = styled.button`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  font-size: 2.8rem;
  font-weight: 300;
  line-height: 1;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${media('<=tablet')} {
    left: 0.8rem;
    width: 4rem;
    height: 4rem;
    font-size: 2.4rem;
  }

  ${media('<=phone')} {
    left: 0.5rem;
    width: 3.5rem;
    height: 3.5rem;
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
`;

const PulseRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 152, 0, 0.3);
  pointer-events: none;
`;

const HintText = styled.span`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff9800;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #ff9800;
  }
`;

const ArrowIndicator = styled.div`
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 3px;
  pointer-events: none;
  opacity: 0;
  
  span {
    color: #ff9800;
    font-size: 18px;
    font-weight: bold;
    opacity: 0;
    animation: ${arrowSlide} 1.5s ease-in-out infinite;
    
    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const NavButtonRight = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border: 2px solid #ff9800;
  border-radius: 50%;
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  overflow: visible;
  
  /* Always apply animations */
  animation: ${vibrateWithIntervals} 6s infinite, ${glow} 2s ease-in-out infinite;
  animation-delay: 1s, 1s;
  
  ${PulseRing} {
    animation: ${pulse} 2s ease-out infinite;
  }
  
  ${HintText} {
    animation: ${fadeInOut} 4s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  ${ArrowIndicator} {
    opacity: 1;
  }
  
  &:hover {
    animation-play-state: paused, paused;
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 8px 24px rgba(255, 152, 0, 0.4);
    
    ${PulseRing} {
      animation-play-state: paused;
    }
    
    ${HintText} {
      opacity: 1;
      animation: none;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
    background: white;
    border: 1px solid #e5e7eb;
    color: #4b5563;
    font-weight: 300;
    
    ${PulseRing}, ${HintText}, ${ArrowIndicator} {
      animation: none;
      opacity: 0;
    }
  }

  ${media('<=tablet')} {
    right: 0.8rem;
    width: 4rem;
    height: 4rem;
    font-size: 2.4rem;
    
    ${ArrowIndicator} {
      right: -35px;
      
      span {
        font-size: 16px;
      }
    }
  }

  ${media('<=phone')} {
    right: 0.5rem;
    width: 3.5rem;
    height: 3.5rem;
    font-size: 2rem;
    

    
    ${HintText} {
      display: none;
    }
    
    ${ArrowIndicator} {
      display: none;
    }
  }
`;

const BookContent = styled.div`
  flex: 1;
  max-width: 45rem;
  min-height: 40rem;
  background: white;
  border-radius: 0.8rem;
  padding: 3rem 2rem;
  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  ${media('<=tablet')} {
    padding: 1.5rem 0.5rem;
    max-width: 100%;
    min-height: 30rem;
  }
  
  ${media('<=phone')} {
    padding: 1.5rem 1rem;
    max-width: calc(100% - 8rem);
  }
`;

const ContentArea = styled.div`
  font-family: Georgia, serif;
  font-size: 1.8rem;
  line-height: 2.6rem;
  color: #1f2937;
  width: 100%;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 1rem;
  margin: 0 auto;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
`;

const ParagraphContainer = styled.div`
  padding-left: ${props => props.$indent ? '1rem' : '0'};
  padding-right: ${props => props.$indent ? '1rem' : '0'};
  margin-bottom: ${props => props.$isLast ? '0' : '2.8rem'};
  text-align: justify;
  text-justify: inter-word;
  width: 100%;
  hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;

  ${media('<=tablet')} {
    padding-left: ${props => props.$indent ? '0.1rem' : '0'};
    padding-right: ${props => props.$indent ? '0.1rem' : '0'};
    margin-bottom: ${props => props.$isLast ? '0' : '2rem'};
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
  position: relative;
`;

const TranslationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.2rem;
`;

const OriginalText = styled.span`
  display: block;
  font-weight: bold;
  font-size: 1.8rem;
  line-height: 3rem;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    line-height: 2.8rem;
  }
`;

const WordCountBadge = styled.span`
  display: block;
  font-size: 0.95rem;
  color: #2563eb;
  background: #dbeafe;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${slideInFade} 0.5s ease-out;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  white-space: nowrap;
  margin-bottom: 0.5rem;
  width: fit-content;
  
  &::before {
    content: '+';
    margin-right: 0.2rem;
    font-weight: 700;
  }
  
  ${media('<=tablet')} {
    font-size: 0.85rem;
    padding: 0.15rem 0.5rem;
    margin-bottom: 0.4rem;
  }
  
  ${media('<=phone')} {
    font-size: 0.8rem;
    padding: 0.1rem 0.4rem;
    margin-bottom: 0.3rem;
  }
`;

const TranslationText = styled.span`
  display: block;
  font-size: 1.8rem;
  line-height: 3rem;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 1px;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    line-height: 2.8rem;
  }
`;

const TranslationPopup = styled.div`
  position: absolute;
  background: white;
  color: black;
  padding: 1.2rem 1.6rem;
  border-radius: 0.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 50;
  border: 1px solid #e5e7eb;
  transform: translateX(-50%);
  min-width: 15rem;
  max-width: 30rem;
  pointer-events: auto;
`;

const PopupText = styled.p`
  margin: 0;
  font-size: 1.4rem;
  text-align: center;
  color: #1f2937;
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
  border-top: 6px solid #e5e7eb;
  pointer-events: none;
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 0 0 1.6rem 1.6rem;
  border-top: 1px solid #e5e7eb;
`;

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const PageNavButton = styled.button`
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.6rem 1.2rem;
  font-size: 1.6rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.6rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #d1d5db;
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
  padding: 0.6rem 0.8rem;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.6rem;
  font-size: 1.4rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgb(var(--primary));
    box-shadow: 0 0 0 3px rgba(var(--primary), 0.1);
  }
`;

const PageTotal = styled.span`
  font-size: 1.4rem;
  color: #6b7280;
`;

const LanguageIndicator = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  z-index: 10;
  font-size: 1.3rem;
  color: #374151;
  
  ${media('<=tablet')} {
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
    top: 1rem;
  }
`;

const WordsReadCounter = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  font-size: 1.1rem;
  color: #2563eb;
  font-weight: 500;
  z-index: 10;
  animation: ${(props) => props.$hasWords ? successGlow : 'none'} 1s ease-out;
  text-align: right;
  max-width: 12rem;
  
  ${media('<=tablet')} {
    font-size: 1rem;
    right: 1.5rem;
    top: 1rem;
    max-width: 10rem;
  }
  
  ${media('<=phone')} {
    font-size: 0.9rem;
    right: 1rem;
    max-width: 8rem;
  }
`;

const WordsNumber = styled.span`
  display: inline-block;
  font-weight: 700;
  font-size: 1.4rem;
  color: #1d4ed8;
  animation: ${popIn} 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  padding: 0.2rem 0.6rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 0.4rem;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #22c55e, #3b82f6);
    background-size: 200% 100%;
    animation: ${countUp} 0.8s ease-out;
  }
  
  &::before {
    content: '✨';
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 1.2rem;
    animation: ${sparkle} 1s ease-out;
    animation-delay: 0.3s;
  }
  
  ${media('<=tablet')} {
    font-size: 1.3rem;
  }
  
  ${media('<=phone')} {
    font-size: 1.2rem;
    
    &::before {
      font-size: 1rem;
      top: -8px;
      right: -8px;
    }
  }
`;

// Signup Section Styles
const SignupSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70vh;
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
    height: 80vh;
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
