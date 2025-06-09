import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import Container from './Container';
import OverTitle from './OverTitle';

// Component for demonstrating the e-reader functionality as a section
export default function ReaderDemoSection({ selectedLanguage }) {
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

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageInput((currentPage - 1).toString());
      hidePopup();
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageInput((currentPage + 1).toString());
      hidePopup();
    }
  }, [currentPage, totalPages]);

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
    <SectionWrapper>
      <Container>
        <HeaderContainer>
          <OverTitle style={{ color: '#ffa500' }}>📖 TRY THE SMART READER</OverTitle>
          <SectionTitle>Start your free trial</SectionTitle>
          <SectionSubtitle>
            It takes less time to jump straight to the free trial than to keep wondering what it will be like
          </SectionSubtitle>
        </HeaderContainer>

        <ReaderWrapper>
          {/* Left Navigation */}
          <NavButtonLeft 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &#8249;
          </NavButtonLeft>

          {/* Right Navigation */}
          <NavButtonRight 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            &#8250;
          </NavButtonRight>

          <ReaderContainer>
            {/* Language indicator */}
            <LanguageIndicator>
              <span>{selectedLanguage ? selectedLanguage.flag : '🇩🇪'}</span>
              <span>{selectedLanguage ? selectedLanguage.name : 'German'}</span>
            </LanguageIndicator>

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

const ReaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  background: white;
  
  ${media('<=tablet')} {
    padding: 2rem;
    flex-direction: column;
    gap: 2rem;
  }
`;

const NavButtonLeft = styled.button`
  position: absolute;
  left: 2rem;
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
    left: 1.5rem;
    width: 4rem;
    height: 4rem;
    font-size: 2.4rem;
  }

  ${media('<=phone')} {
    left: 1rem;
    width: 3.5rem;
    height: 3.5rem;
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
`;

const NavButtonRight = styled.button`
  position: absolute;
  right: 2rem;
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
    right: 1.5rem;
    width: 4rem;
    height: 4rem;
    font-size: 2.4rem;
  }

  ${media('<=phone')} {
    right: 1rem;
    width: 3.5rem;
    height: 3.5rem;
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
`;

const BookContent = styled.div`
  flex: 1;
  max-width: 55rem;
  min-height: 65rem;
  background: white;
  border-radius: 0.8rem;
  padding: 4rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  ${media('<=tablet')} {
    padding: 2.5rem;
    max-width: 100%;
    min-height: 50rem;
  }
`;

const ContentArea = styled.div`
  font-family: Georgia, serif;
  font-size: 1.8rem;
  line-height: 3rem;
  color: #1f2937;
  width: 100%;
  max-width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 2rem;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    line-height: 2.8rem;
  }
`;

const ParagraphContainer = styled.div`
  margin-left: ${props => props.$indent ? '2rem' : '0'};
  margin-bottom: ${props => props.$isLast ? '0' : '2.8rem'};
  text-align: left;
  width: 100%;

  ${media('<=tablet')} {
    margin-left: ${props => props.$indent ? '1.2rem' : '0'};
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

const ReaderWrapper = styled.div`
  background: white;
  border-radius: 1.6rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 90rem;
  margin: 0 auto;
  position: relative;
`;
