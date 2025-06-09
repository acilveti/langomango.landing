import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useEscClose from 'hooks/useEscKey';
import { media } from 'utils/media';
import CloseIcon from './CloseIcon';
import Container from './Container';
import Overlay from './Overlay';

// Component for demonstrating the e-reader functionality

export default function ReaderDemoModal({ onClose }) {
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

  useEscClose({ onClose });

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

  const handlePageInputChange = useCallback((text: string) => {
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

  const currentContent = bookContent[currentPage] || bookContent[8];

  return (
    <Overlay>
      <Container>
        <ReaderCard>
          <CloseIconContainer>
            <CloseIcon onClick={onClose} />
          </CloseIconContainer>

          <ReaderContainer>
            {/* Left Navigation */}
            <NavButton 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              position="left"
            >
              ‹
            </NavButton>

            {/* Book Content */}
            <BookContent ref={pageRef}>
              <ContentArea>
                {currentContent.paragraphs.map((paragraph, index) => (
                  <ParagraphContainer 
                    key={index} 
                    indent={paragraph.indent}
                    isLast={index === currentContent.paragraphs.length - 1}
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
            <NavButton 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              position="right"
            >
              ›
            </NavButton>
          </ReaderContainer>

          {/* Bottom Navigation Bar */}
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
      </Container>
    </Overlay>
  );
}

// Styled Components
const ReaderCard = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin: auto;
  background: rgb(var(--modalBackground));
  border-radius: 0.6rem;
  max-width: 90rem;
  width: 90vw;
  height: 80vh;
  overflow: hidden;
  color: rgb(var(--text));

  ${media('<=tablet')} {
    width: 95vw;
    height: 90vh;
  }
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 2rem;
  top: 2rem;
  z-index: 100;

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
  padding: 2rem;
  overflow: hidden;
`;

const NavButton = styled.button`
  padding: 1.2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  font-size: 2.4rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: ${props => props.position === 'left' ? '0 2rem 0 0' : '0 0 0 2rem'};

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
    margin: ${props => props.position === 'left' ? '0 1rem 0 0' : '0 0 0 1rem'};
  }
`;

const BookContent = styled.div`
  flex: 1;
  max-width: 65rem;
  height: 100%;
  background: white;
  border-radius: 0.8rem;
  padding: 4rem;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  ${media('<=tablet')} {
    padding: 2rem;
  }
`;

const ContentArea = styled.div`
  font-family: Georgia, serif;
  font-size: 1.6rem;
  line-height: 2.8rem;
  color: #1f2937;
`;

const ParagraphContainer = styled.div`
  margin-left: ${props => props.indent ? '3.2rem' : '0'};
  margin-bottom: ${props => props.isLast ? '0' : '1.6rem'};
  text-align: justify;

  ${media('<=tablet')} {
    margin-left: ${props => props.indent ? '2rem' : '0'};
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
