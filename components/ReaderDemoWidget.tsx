import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { DEFAULT_LANGUAGES, Language, useVisitor } from 'contexts/VisitorContext';
import { getFallbackTranslation, readerTranslations } from 'data/readerTranslations';
import { apiService } from 'services/apiService';
import { media } from 'utils/media';

// Type definitions
interface ReaderDemoWidgetProps {
  selectedLanguage?: Language | null;
  onInteraction?: () => void;
  onLanguageChange?: (language: Language) => void;
  useInlineSignup?: boolean;
  signupMode?: 'panel' | 'fullscreen';
  onSignupVisibilityChange?: (isVisible: boolean) => void;
  isFullRegister?: boolean;
}

export default function ReaderDemoWidget({ 
  selectedLanguage: propSelectedLanguage, 
  onInteraction, 
  onLanguageChange, 
  useInlineSignup = false,
  signupMode = 'panel',
  onSignupVisibilityChange,
  isFullRegister = true
}: ReaderDemoWidgetProps) {
  const { 
    selectedLanguage: contextLanguage, 
    setSelectedLanguage: setContextLanguage, 
    nativeLanguage,
    hasSelectedLanguage,
    setHasSelectedLanguage 
  } = useVisitor();
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
  const [justUpdated, setJustUpdated] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showExpandedForm, setShowExpandedForm] = useState(true);
  const [isEditingNative, setIsEditingNative] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [hasSelectedTarget, setHasSelectedTarget] = useState(hasSelectedLanguage);
  const [showBookAnimation, setShowBookAnimation] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [isCalculatingWords, setIsCalculatingWords] = useState(false);
  const [shouldAnimateButton, setShouldAnimateButton] = useState(false);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const [showValidEmailIndicator, setShowValidEmailIndicator] = useState(false);
  const [hasAutoOpenedLanguage, setHasAutoOpenedLanguage] = useState(false);
  
  // Auto-open target language picker immediately when signup is shown
  useEffect(() => {
    if (showSignupExpanded && !hasSelectedTarget && !hasAutoOpenedLanguage) {
      setIsEditingTarget(true);
      setHasAutoOpenedLanguage(true);
    }
  }, [showSignupExpanded, hasSelectedTarget, hasAutoOpenedLanguage]);
  
  // Use context language as the source of truth, with fallback to prop or default
  const currentLanguage = contextLanguage || propSelectedLanguage || { code: 'de', name: 'German', flag: '🇩🇪' };
  
  // Initialize temp language states after currentLanguage is defined
  const [tempNativeLanguage, setTempNativeLanguage] = useState(nativeLanguage);
  const [tempTargetLanguage, setTempTargetLanguage] = useState(currentLanguage);
  
  // Update valid email state when email changes
  useEffect(() => {
    if (registrationEmail) {
      const isValid = validateEmail(registrationEmail);
      setHasValidEmail(isValid);
      
      // Show green border for 3 seconds when valid email is entered
      if (isValid) {
        setShowValidEmailIndicator(true);
        const timer = setTimeout(() => {
          setShowValidEmailIndicator(false);
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        setShowValidEmailIndicator(false);
      }
    } else {
      setHasValidEmail(false);
      setShowValidEmailIndicator(false);
    }
  }, [registrationEmail]);
  
  // Check if we should show the language as not selected (if it's still the default German and user hasn't actively selected)
  useEffect(() => {
    if (!hasSelectedLanguage && currentLanguage.code === 'de') {
      setHasSelectedTarget(false);
    } else if (hasSelectedLanguage) {
      setHasSelectedTarget(true);
    }
  }, [hasSelectedLanguage, currentLanguage.code]);
  
  // Update temp languages when context changes
  useEffect(() => {
    setTempNativeLanguage(nativeLanguage);
  }, [nativeLanguage]);
  
  useEffect(() => {
    setTempTargetLanguage(currentLanguage);
  }, [currentLanguage]);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const wordsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const readerWrapperRef = useRef<HTMLDivElement>(null);
  const { setIsModalOpened } = useNewsletterModalContext();
  const [popup, setPopup] = useState({
    visible: false,
    text: '',
    translation: '',
    x: 0,
    y: 0
  });

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  // Function to get translation based on selected language
  const getTranslation = (englishText: string) => {
    if (!currentLanguage || !englishText) return englishText;
    const langCode = currentLanguage.code;
    const langTranslations = readerTranslations[langCode];
    return langTranslations?.[englishText] || getFallbackTranslation(englishText);
  };

  // Handle language selection
  const handleLanguageSelect = (language: Language) => {
    // Update context language
    setContextLanguage(language);
    setIsLanguageDropdownOpen(false);
    setHasSelectedLanguage(true);
    
    // Reset ALL word counting related states
    setWordsRead(0);
    setShowWordCounts(false);
    setHasClicked(false);
    setJustUpdated(false);
    setShouldAnimateButton(true); // Reset button animation state
    
    // Clear any running timers
    if (wordsTimerRef.current) {
      clearTimeout(wordsTimerRef.current);
      wordsTimerRef.current = null;
    }
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current);
      visibilityTimerRef.current = null;
    }
    
    // Reset the visibility tracking
    hasStartedTimerRef.current = false;
    
    // Call parent callback if provided
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  // Define types for book content
  interface Segment {
    text: string;
    translationKey?: string;
    showTranslation?: boolean;
  }

  interface Paragraph {
    segments: Segment[];
    indent: boolean;
  }

  interface PageContent {
    paragraphs: Paragraph[];
  }

  interface BookContent {
    [pageNumber: number]: PageContent;
  }

  // Book content (base English content) - 3 paragraphs per page
  const bookContent: BookContent = {
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
              text: ' The storm had grown worse, during the night, and the waves crashed over the deck with tremendous force.'
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
              text: 'The deck was chaos',
              translationKey: 'The deck was chaos',
              showTranslation: true
            },
            {
              text: '. Men ran in all directions, some trying to secure loose cargo while others fought to control the sails.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Through the spray and darkness, Joan could barely make out the torn mainsail flapping wildly in the wind like a wounded bird.'
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
        if (onSignupVisibilityChange) {
          onSignupVisibilityChange(true);
        }
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
  }, [pageChangeCount, setIsModalOpened, onInteraction, useInlineSignup, showSignupExpanded, onSignupVisibilityChange]);

  // Calculate total words for current page translations
  const calculatePageWords = useCallback((pageNumber: number) => {
    console.log(`[calculatePageWords] Called for page ${pageNumber}`);
    const content = bookContent[pageNumber];
    if (!content) {
      console.log(`[calculatePageWords] No content found for page ${pageNumber}`);
      return 0;
    }
    
    let totalWords = 0;
    content.paragraphs.forEach((paragraph, pIndex) => {
      paragraph.segments.forEach((segment, sIndex) => {
        if (segment.translationKey && segment.showTranslation) {
          const translatedText = getTranslation(segment.translationKey!);
          const wordCount = getWordCount(translatedText);
          console.log(`[calculatePageWords] P${pIndex}S${sIndex}: "${segment.translationKey}" -> "${translatedText}" (${wordCount} words)`);
          totalWords += wordCount;
        }
      });
    });
    
    console.log(`[calculatePageWords] Total words for page ${pageNumber}: ${totalWords}`);
    return totalWords;
  }, [currentLanguage, getTranslation]);

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
        // Hide word counts temporarily
        setShowWordCounts(false);
        setIsCalculatingWords(true); // Start loading animation
        setShouldAnimateButton(false); // Stop button animation during loading
        // Wait 2.9 seconds (just before 3 seconds) to stop loading
        setTimeout(() => {
          setIsCalculatingWords(false); // Stop loading animation
          setShouldAnimateButton(true); // Start button animation after loading
          // Show word counts after a brief delay
          setTimeout(() => {
            setShowWordCounts(true);
            // Update global counter 1 second after word counts appear
            setTimeout(() => {
              // Calculate total words from both pages
              const page8Words = calculatePageWords(8);
              const page9Words = calculatePageWords(9);
              setWordsRead(page8Words + page9Words);
              setJustUpdated(true);
              setTimeout(() => setJustUpdated(false), 1000);
            }, 1000);
          }, 100); // Small delay after loading completes
        }, 2900); // Stop just before 3 seconds
      }
    }
  }, [currentPage, totalPages, handleInteraction, hasClicked, calculatePageWords]);

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

  const validateEmail = (email: string) => {
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
    // For the compact registration section in the main flow
    // We'll trigger the registration after Google auth completes
    window.location.href = 'https://staging.langomango.com/auth/login-google?returnUrl=/sign-up&frontendRedirectUrl=https://beta-app.langomango.com/';
  }, []);

  // Handle demo signup with level selection
  const handleLevelSelect = useCallback(async (level: string) => {
    if (!hasSelectedTarget || isEditingTarget) return;
    if (isFullRegister && !hasRegistered && !hasValidEmail) return;
    
    setSelectedLevel(level);
    setSignupError('');
    setIsLoadingSignup(true);
    setShowBookAnimation(true);
    
    try {
      if (isFullRegister && (hasRegistered || hasValidEmail)) {
        // Registered user flow - register with email and language preferences
        if (registrationEmail && hasValidEmail) {
          const response = await apiService.demoSignupWithEmail({
            email: registrationEmail,
            nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
            targetLanguage: tempTargetLanguage.code,
            level: level
          });
          
          if (response.success && response.token) {
            // Store token in localStorage
            localStorage.setItem('token', response.token);
            
            // Redirect to app
            if (response.redirectUrl) {
              setTimeout(() => {
                window.location.href = response.redirectUrl;
              }, 1500);
            } else {
              // Fallback redirect
              const appUrl = 'https://beta-app.langomango.com';
              setTimeout(() => {
                window.location.href = `${appUrl}/reader`;
              }, 1500);
            }
          }
        } else if (hasRegistered) {
          // Google signup flow - redirect to Google OAuth
          const googleUrl = apiService.getGoogleLoginUrl({
            nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
            targetLanguage: tempTargetLanguage.code,
            level: level
          });
          window.location.href = googleUrl;
        }
      } else {
        // Demo user flow
        const response = await apiService.demoSignup({
          nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
          targetLanguage: tempTargetLanguage.code,
          level: level
        });
        
        if (response.success && response.redirectUrl) {
          // Wait a bit for animation before redirecting
          setTimeout(() => {
            window.location.href = response.redirectUrl;
          }, 1500);
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
      setShowBookAnimation(false);
      setIsLoadingSignup(false);
      setSelectedLevel('');
    }
  }, [hasSelectedTarget, isEditingTarget, isFullRegister, hasRegistered, hasValidEmail, tempNativeLanguage, nativeLanguage, tempTargetLanguage, registrationEmail]);

  const hidePopup = useCallback(() => {
    setPopup(prev => ({ ...prev, visible: false }));
  }, []);

  const handleLongPressStart = useCallback((e: React.MouseEvent | React.TouchEvent, segment: Segment) => {
    if ('touches' in e) {
      e.stopPropagation();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!segment.translationKey || segment.showTranslation) return;
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const pageRect = pageRef.current?.getBoundingClientRect();
    
    if (!pageRect) return;

    const x = rect.left - pageRect.left + rect.width / 2;
    const y = rect.top - pageRect.top;

    longPressTimer.current = setTimeout(() => {
      setPopup({
        visible: true,
        text: segment.text,
        translation: getTranslation(segment.translationKey!),
        x: x,
        y: y
      });
    }, 500);
  }, [getTranslation]);

  const handleLongPressEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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

  // No need for this effect anymore since we're using context

  // Global click handler
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Close translation popup if clicking outside
      if (!target.closest('.translation-popup') && popup.visible) {
        hidePopup();
      }
      
      // Close language pickers when clicking outside
      if (!target.closest('.language-picker-container') && !target.closest('.language-box')) {
        setIsEditingNative(false);
        setIsEditingTarget(false);
      }
      
      // Close language dropdown if clicking outside
      if (!target.closest('.language-selector-container') && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [popup.visible, hidePopup, isLanguageDropdownOpen]);

  const calculatePageWordsRef = useRef<typeof calculatePageWords | undefined>();
  calculatePageWordsRef.current = calculatePageWords;

  const visibilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedTimerRef = useRef(false);

  // Smooth easing function for scroll animation
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // Custom smooth scroll implementation
  const smoothScrollTo = (targetY: number, duration: number = 300) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    let animationId: number | null = null;
    let isCancelled = false;

    // Disable user scrolling
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add listeners to prevent scrolling
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventScroll, { passive: false });
    
    // Also prevent scrollbar interaction
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const cleanup = () => {
      // Re-enable scrolling
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScroll);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };

    const animateScroll = (currentTime: number) => {
      if (isCancelled) {
        cleanup();
        return;
      }
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, startY + distance * easeProgress);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animateScroll);
      } else {
        // Animation complete, re-enable scrolling
        cleanup();
      }
    };
    
    animationId = requestAnimationFrame(animateScroll);
  };

  // Auto-scroll to reader when it becomes visible
  useEffect(() => {
    // Only auto-scroll if not in fullscreen mode and haven't scrolled yet
    if (!hasAutoScrolled && signupMode !== 'fullscreen' && readerWrapperRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Trigger when 10% is visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            const rect = entry.target.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const readerCenter = rect.top + (rect.height / 2);
            const viewportCenter = windowHeight / 2;
            const scrollOffset = readerCenter - viewportCenter;
            
            // Only scroll if not already centered
            if (Math.abs(scrollOffset) > 30) {
              const targetScrollY = window.scrollY + scrollOffset;
              
              // Start scrolling immediately with fast animation
              smoothScrollTo(targetScrollY, 300); // 0.3 seconds - very fast
            }
            
            setHasAutoScrolled(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1, // Trigger when 10% visible
          rootMargin: '0px'
        }
      );
      
      // Start observing immediately
      observer.observe(readerWrapperRef.current);
      
      return () => observer.disconnect();
    }
  }, [hasAutoScrolled, signupMode]);

  // Check if reader container is visible and start word counter
  useEffect(() => {
    console.log('[useEffect] Visibility effect mounted or language changed');
    
    // Reset the timer tracking when language changes
    hasStartedTimerRef.current = false;
    
    const checkVisibility = () => {
      console.log('[checkVisibility] Called, hasStartedTimer:', hasStartedTimerRef.current);
      
      if (readerContainerRef.current && !hasStartedTimerRef.current) {
        const rect = readerContainerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Check if the ENTIRE reader container is visible in viewport
        const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight;
        
        console.log('[checkVisibility] Reader rect:', {
          top: rect.top,
          bottom: rect.bottom,
          windowHeight: windowHeight,
          isFullyVisible: isFullyVisible
        });
        
        if (isFullyVisible) {
          console.log('[checkVisibility] Reader is fully visible! Starting timer...');
          // If not already timing, start the 2-second visibility timer
          if (!visibilityTimerRef.current) {
            console.log('[checkVisibility] Setting 2-second visibility timer');
            setIsCalculatingWords(true); // Start loading animation
            setShouldAnimateButton(false); // Stop button animation during loading
            visibilityTimerRef.current = setTimeout(() => {
              console.log('[visibilityTimer] 2 seconds elapsed, updating word counts');
              hasStartedTimerRef.current = true;
              // Stop loading animation just before showing word counts
              setIsCalculatingWords(false);
              setShouldAnimateButton(true); // Start button animation after loading
              // Show word counts after a brief delay
              setTimeout(() => {
                setShowWordCounts(true);
                console.log('[visibilityTimer] Word count badges shown');
                // Then update global counter 1 second later
                wordsTimerRef.current = setTimeout(() => {
                  const page8Words = calculatePageWordsRef.current?.(8) || 0;
                  console.log('[wordsTimer] Calculated page 8 words:', page8Words);
                  setWordsRead(page8Words);
                  setJustUpdated(true);
                  setTimeout(() => setJustUpdated(false), 1000);
                }, 1000); // 1 second after word counts appear
              }, 100); // Small delay after loading completes
            }, 2000); // Must be visible for 2 seconds
          }
        } else {
          // Reader container is not fully visible, clear the visibility timer
          if (visibilityTimerRef.current) {
            console.log('[checkVisibility] Reader not fully visible, clearing timer');
            clearTimeout(visibilityTimerRef.current);
            visibilityTimerRef.current = null;
            setIsCalculatingWords(false); // Stop loading animation if reader is scrolled away
            setShouldAnimateButton(true); // Re-enable button animation
          }
        }
      }
    };

    // Check visibility on mount and scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Also check after mount - with a longer delay to ensure proper initialization
    const mountTimer = setTimeout(() => {
      console.log('[mountTimer] Checking visibility after mount');
      checkVisibility();
    }, 1000);
    
    return () => {
      console.log('[useEffect] Cleaning up visibility effect');
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
      clearTimeout(mountTimer);
      // Clear timers on cleanup
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
        visibilityTimerRef.current = null;
      }
      if (wordsTimerRef.current) {
        clearTimeout(wordsTimerRef.current);
        wordsTimerRef.current = null;
      }
    };
  }, [currentLanguage.code]); // Only depend on language code to avoid object reference issues

  const currentContent = bookContent[currentPage] || bookContent[8];
  
  console.log('[ReaderDemoWidget] Rendering with wordsRead:', wordsRead, 'showWordCounts:', showWordCounts);

  return (
    <WidgetWrapper $expanded={showSignupExpanded} $isFullscreen={signupMode === 'fullscreen'} data-reader-widget="true">
      <ReaderWrapper 
        ref={readerWrapperRef}
        className={showSignupExpanded && signupMode !== 'fullscreen' ? 'reader-wrapper' : ''} 
        data-reader-wrapper="true"
        $inModal={signupMode === 'fullscreen'}
      >
        {/* Words Read Counter */}
        <WordsReadCounter $hasWords={wordsRead > 0} $justUpdated={justUpdated}>
          {justUpdated && (
            <>
              <SuccessParticle $color="#22c55e" $shape="circle" $delay={0} />
              <SuccessParticle $color="#3b82f6" $shape="square" $delay={0.1} />
              <SuccessParticle $color="#f59e0b" $shape="circle" $delay={0.2} />
              <SuccessParticle $color="#ef4444" $shape="square" $delay={0.3} />
              <SuccessParticle $color="#8b5cf6" $shape="circle" $delay={0.4} />
            </>
          )}
          <WordsNumber key={wordsRead}>{wordsRead}</WordsNumber>
          <WordsLabel>
            <span>words read</span>
            <span>in {currentLanguage.name}</span>
          </WordsLabel>
        </WordsReadCounter>
      <ReaderContainer ref={readerContainerRef} $inModal={signupMode === 'fullscreen'}>
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
          key={`nav-right-${currentPage}`}
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          aria-label="Next page"
          $shouldAnimate={shouldAnimateButton}
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
        {/* Language selector dropdown */}
        <LanguageSelectorContainer className="language-selector-container">
          <LanguageDropdown
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            $isOpen={isLanguageDropdownOpen}
          >
            <SelectedLanguage>
              <LanguageFlag>{currentLanguage.flag}</LanguageFlag>
              <LanguageName>{currentLanguage.name}</LanguageName>
              <ChevronIcon $isOpen={isLanguageDropdownOpen}>▼</ChevronIcon>
            </SelectedLanguage>
          </LanguageDropdown>
          
          {isLanguageDropdownOpen && (
            <LanguageList>
              {DEFAULT_LANGUAGES.map((language) => (
                <LanguageOption
                  key={language.code}
                  $isSelected={currentLanguage.code === language.code}
                  onClick={() => handleLanguageSelect(language)}
                >
                  <LanguageFlag>{language.flag}</LanguageFlag>
                  <LanguageName>{language.name}</LanguageName>
                </LanguageOption>
              ))}
            </LanguageList>
          )}
        </LanguageSelectorContainer>

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
                            {wordCount} words in {currentLanguage.name}
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
      <BottomBar $inModal={signupMode === 'fullscreen'} $isLoading={isCalculatingWords}>
        <PageNavigation>
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
        </PageNavigation>
      </BottomBar>
    </ReaderWrapper>
      
      {/* Inline Signup Section */}
      {useInlineSignup && showSignupExpanded && (
        <SignupSection $isFullscreen={signupMode === 'fullscreen'}>
          <CloseButton 
            onClick={() => {
              setShowSignupExpanded(false);
              if (onSignupVisibilityChange) {
                onSignupVisibilityChange(false);
              }
            }} 
            aria-label="Close signup"
            $isFullscreen={signupMode === 'fullscreen'}
          >
            ×
          </CloseButton>
          
          {showExpandedForm ? (
            <SignupExpandedWrapper>
              <SignupExpanded>
              <SignupTitle>Let&apos;s continue with a more customized reading for you</SignupTitle>
              <SignupSubtitle>We&apos;ll personalize your learning experience based on your language preferences</SignupSubtitle>
              
              <LanguageSetupContainer>
                <LanguageSetupRow>
                  <LanguageBox 
                    className="language-box"
                    onClick={() => setIsEditingNative(true)}
                    $isEditing={isEditingNative}
                  >
                    <LanguageBoxLabel>Your native language</LanguageBoxLabel>
                    <LanguageDisplay>
                      <LanguageFlag>{tempNativeLanguage?.flag || nativeLanguage?.flag || '🌐'}</LanguageFlag>
                      <LanguageName>{tempNativeLanguage?.name || nativeLanguage?.name || 'English'}</LanguageName>
                    </LanguageDisplay>
                    <LanguageNote>
                      {isEditingNative ? 'Select a language below' : 'Auto-detected from browser'}
                    </LanguageNote>
                  </LanguageBox>
                  
                  <LanguageBox 
                    className="language-box"
                    onClick={() => setIsEditingTarget(true)}
                    $isEditing={isEditingTarget}
                    $isPulsing={!hasSelectedTarget}
                  >
                    <LanguageBoxLabel>You&apos;re learning</LanguageBoxLabel>
                    <LanguageDisplay>
                      <LanguageFlag>{hasSelectedTarget ? tempTargetLanguage.flag : '🌐'}</LanguageFlag>
                      <LanguageName>{hasSelectedTarget ? tempTargetLanguage.name : 'Select language'}</LanguageName>
                    </LanguageDisplay>
                    <LanguageNote>
                      {isEditingTarget ? 'Select a language below' : ''}
                    </LanguageNote>
                  </LanguageBox>
                </LanguageSetupRow>
                
                {(isEditingNative || isEditingTarget) && (
                  <LanguagePickerContainer className="language-picker-container">
                    <LanguagePickerGrid>
                      {DEFAULT_LANGUAGES.map((language) => (
                        <LanguagePickerOption
                          key={language.code}
                          onClick={() => {
                            if (isEditingNative) {
                              setTempNativeLanguage(language);
                              setIsEditingNative(false);
                            } else if (isEditingTarget) {
                              setTempTargetLanguage(language);
                              setContextLanguage(language);
                              setIsEditingTarget(false);
                              setHasSelectedTarget(true);
                              setHasSelectedLanguage(true);
                            }
                          }}
                          $isSelected={
                            isEditingNative 
                              ? tempNativeLanguage?.code === language.code 
                              : tempTargetLanguage.code === language.code
                          }
                        >
                          <span>{language.flag}</span>
                          <span>{language.name}</span>
                        </LanguagePickerOption>
                      ))}
                    </LanguagePickerGrid>
                  </LanguagePickerContainer>
                )}
                
                {isFullRegister && hasSelectedTarget && !isEditingTarget && !hasRegistered && (
                  <CompactRegistrationSection $needsAttention={hasSelectedTarget && !hasValidEmail && !hasRegistered}>
                    <EmailRegistrationInputCompact
                      type="email"
                      placeholder="Email"
                      value={registrationEmail}
                      onChange={(e) => setRegistrationEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && registrationEmail && validateEmail(registrationEmail)) {
                          setHasRegistered(true);
                        }
                      }}
                      $needsAttention={hasSelectedTarget && !hasValidEmail && !hasRegistered}
                      $isValid={showValidEmailIndicator}
                    />
                    <OrDividerCompact>or</OrDividerCompact>
                    <GoogleSignupButtonCompact 
                      onClick={() => {
                        handleGoogleSignup();
                        setHasRegistered(true);
                      }}
                      $needsAttention={hasSelectedTarget && !hasValidEmail && !hasRegistered}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Google</span>
                    </GoogleSignupButtonCompact>
                  </CompactRegistrationSection>
                )}
                
                <LevelSelectorContainer $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail)}>
                  <LevelLabel>Select your {tempTargetLanguage.name} level:</LevelLabel>
                  <LevelButtons>
                    <LevelButton 
                      $isActive={selectedLevel === 'A1'}
                      onClick={() => handleLevelSelect('A1')}
                      $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail) || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel && (!isFullRegister || hasRegistered || hasValidEmail)}
                    >
                      <LevelEmoji>🌱</LevelEmoji>
                      <LevelName>A1</LevelName>
                      <LevelDesc>Beginner</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'A2'}
                      onClick={() => handleLevelSelect('A2')}
                      $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail) || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel && (!isFullRegister || hasRegistered || hasValidEmail)}
                    >
                      <LevelEmoji>🌿</LevelEmoji>
                      <LevelName>A2</LevelName>
                      <LevelDesc>Elementary</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'B1'}
                      onClick={() => handleLevelSelect('B1')}
                      $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail) || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel && (!isFullRegister || hasRegistered || hasValidEmail)}
                    >
                      <LevelEmoji>🍀</LevelEmoji>
                      <LevelName>B1</LevelName>
                      <LevelDesc>Intermediate</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'B2'}
                      onClick={() => handleLevelSelect('B2')}
                      $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail) || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel && (!isFullRegister || hasRegistered || hasValidEmail)}
                    >
                      <LevelEmoji>🌳</LevelEmoji>
                      <LevelName>B2</LevelName>
                      <LevelDesc>Upper Int.</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'C1'}
                      onClick={() => handleLevelSelect('C1')}
                      $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail) || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel && (!isFullRegister || hasRegistered || hasValidEmail)}
                    >
                      <LevelEmoji>🌲</LevelEmoji>
                      <LevelName>C1</LevelName>
                      <LevelDesc>Advanced</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'C2'}
                      onClick={() => handleLevelSelect('C2')}
                      $isDisabled={(!hasSelectedTarget || isEditingTarget) || (isFullRegister && !hasRegistered && !hasValidEmail) || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel && (!isFullRegister || hasRegistered || hasValidEmail)}
                    >
                      <LevelEmoji>🎯</LevelEmoji>
                      <LevelName>C2</LevelName>
                      <LevelDesc>Mastery</LevelDesc>
                    </LevelButton>
                  </LevelButtons>
                </LevelSelectorContainer>
                
                {showBookAnimation && (
                  <BookAnimationWrapper>
                    <BookAnimationOverlay>
                      <BookIcon>📖</BookIcon>
                      <BookText>Preparing your customized Alice in Wonderland...</BookText>
                    </BookAnimationOverlay>
                  </BookAnimationWrapper>
                )}
              </LanguageSetupContainer>
              
              {(!hasSelectedTarget || isEditingTarget) ? (
              <PromptMessage>
              <PromptIcon>👆</PromptIcon>
              Please select your target language to continue
              </PromptMessage>
              ) : (isFullRegister && !hasRegistered && !hasValidEmail) ? (
                <PromptMessage>
                  <PromptIcon>📧</PromptIcon>
                  Please enter your email or sign in with Google
                </PromptMessage>
              ) : (!selectedLevel && hasSelectedTarget) ? (
                  <PromptMessage>
                    <PromptIcon>🎯</PromptIcon>
                    Now select your level to start reading
                  </PromptMessage>
                ) : null}
              
              {signupError && (
                <ErrorMessage>
                  <ErrorIcon>⚠️</ErrorIcon>
                  {signupError}
                </ErrorMessage>
              )}
              
              {!isFullRegister && (
                <SecondarySection>
                  <SecondaryDivider>
                    <DividerLine />
                    <DividerText>or jump straight to the app</DividerText>
                    <DividerLine />
                  </SecondaryDivider>
                  
                  <SecondaryButtons>
                    <SecondaryButton onClick={() => setShowExpandedForm(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Sign up with Email
                    </SecondaryButton>
                    <SecondaryButton onClick={handleGoogleSignup}>
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </SecondaryButton>
                  </SecondaryButtons>
                </SecondarySection>
              )}
            </SignupExpanded>
            </SignupExpandedWrapper>
          ) : (
            <SignupExpandedWrapper>
              <SignupExpanded>
              <BackButton onClick={() => setShowExpandedForm(true)}>← Back</BackButton>
              <SignupTitle>✨ Create your free account</SignupTitle>
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
            </SignupExpandedWrapper>
          )}
        </SignupSection>
      )}
    </WidgetWrapper>
  );
}

// Animation Keyframes
const loadingFill = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

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

const successBurst = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  20% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(20);
    opacity: 0;
  }
`;

const confetti = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(720deg);
    opacity: 0;
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
const WidgetWrapper = styled.div<{ $expanded: boolean; $isFullscreen: boolean }>`
  position: relative;
  width: 100%;
  ${props => props.$expanded && !props.$isFullscreen && `
    .reader-wrapper {
      transform: scale(0.85);
      transition: transform 0.4s ease;
    }
  `}
`;

const ReaderWrapper = styled.div<{ $inModal?: boolean }>`
  background: ${props => props.$inModal ? 'transparent' : 'white'};
  border-radius: ${props => props.$inModal ? '0' : '1.6rem'};
  overflow: ${props => props.$inModal ? 'visible' : 'hidden'};
  box-shadow: ${props => props.$inModal ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.2)'};
  max-width: ${props => props.$inModal ? 'none' : '90rem'};
  margin: 0 auto;
  position: relative;
  border: ${props => props.$inModal ? 'none' : '3px solid rgb(var(--secondary))'};
  transition: transform 0.4s ease;
  transform-origin: top center;
  width: 100%;
  height: ${props => props.$inModal ? 'auto' : 'auto'};
  z-index: 20;
  display: ${props => props.$inModal ? 'block' : 'block'};
  
  ${props => props.className === 'reader-wrapper' ? 'transform: scale(0.85);' : ''}
`;

const ReaderContainer = styled.div<{ $inModal?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 7rem;
  position: relative;
  background: ${props => props.$inModal ? 'transparent' : 'white'};
  
  ${media('<=tablet')} {
    padding: 1.5rem 5rem;
    flex-direction: column;
    gap: 2rem;
  }
  
  ${media('<=phone')} {
    padding: 1.5rem 4rem;
    flex-direction: column;
    gap: 2rem;
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

const NavButtonRight = styled.button<{ $shouldAnimate?: boolean }>`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  background: ${props => props.$shouldAnimate 
    ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' 
    : 'white'};
  border: ${props => props.$shouldAnimate ? '2px solid #ff9800' : '1px solid #e5e7eb'};
  border-radius: 50%;
  font-size: 2.8rem;
  font-weight: ${props => props.$shouldAnimate ? '600' : '300'};
  line-height: 1;
  color: ${props => props.$shouldAnimate ? 'white' : '#4b5563'};
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  overflow: visible;
  
  /* Apply animations conditionally based on $shouldAnimate prop */
  will-change: transform;
  animation: ${props => props.$shouldAnimate ? css`${vibrateWithIntervals} 6s infinite, ${glow} 2s ease-in-out infinite` : 'none'};
  animation-delay: ${props => props.$shouldAnimate ? '0.5s, 0.5s' : '0s'};
  animation-fill-mode: both;
  
  ${PulseRing} {
    animation: ${props => props.$shouldAnimate ? css`${pulse} 2s ease-out infinite` : 'none'};
    animation-delay: ${props => props.$shouldAnimate ? '0.5s' : '0s'};
  }
  
  ${HintText} {
    animation: ${props => props.$shouldAnimate ? css`${fadeInOut} 4s ease-in-out infinite` : 'none'};
    animation-delay: ${props => props.$shouldAnimate ? '1s' : '0s'};
  }
  
  ${ArrowIndicator} {
    opacity: ${props => props.$shouldAnimate ? '1' : '0'};
  }
  
  &:hover:not(:disabled) {
    animation-play-state: ${props => props.$shouldAnimate ? 'paused, paused' : 'running, running'};
    transform: translateY(-50%) scale(1.15);
    box-shadow: ${props => props.$shouldAnimate 
      ? '0 8px 24px rgba(255, 152, 0, 0.4)' 
      : '0 6px 16px rgba(0, 0, 0, 0.2)'};
    background: ${props => props.$shouldAnimate 
      ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' 
      : '#f3f4f6'};
    
    ${PulseRing} {
      animation-play-state: ${props => props.$shouldAnimate ? 'paused' : 'running'};
    }
    
    ${HintText} {
      opacity: ${props => props.$shouldAnimate ? '1' : '0'};
      animation: ${props => props.$shouldAnimate ? 'none' : 'none'};
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
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  margin: 0 auto;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
`;

const ParagraphContainer = styled.div<{ $indent: boolean; $isLast: boolean }>`
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

const BottomBar = styled.div<{ $inModal?: boolean; $isLoading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$inModal ? 'transparent' : 'white'};
  padding: 1.5rem 2rem;
  border-radius: ${props => props.$inModal ? '0' : '0 0 1.6rem 1.6rem'};
  border-top: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  
  /* Loading bar animation */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 2px;
    background: #22c55e;
    width: ${props => props.$isLoading ? '100%' : '0%'};
    animation: ${props => props.$isLoading ? css`${loadingFill} 2s ease-out forwards` : 'none'};
    transition: width 0.3s ease-out;
    opacity: ${props => props.$isLoading ? '0.8' : '0'};
  }
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

const LanguageSelectorContainer = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  min-width: 180px;
  
  ${media('<=tablet')} {
    top: 1rem;
    min-width: 160px;
  }
`;

const LanguageDropdown = styled.div<{ $isOpen: boolean }>`
  background: white;
  border: 2px solid ${props => props.$isOpen ? 'rgb(255, 152, 0)' : '#e5e7eb'};
  border-radius: ${props => props.$isOpen ? '0.8rem 0.8rem 0 0' : '2rem'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: rgb(255, 152, 0);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SelectedLanguage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 1.3rem;
  color: #374151;
  
  ${media('<=tablet')} {
    font-size: 1.1rem;
    padding: 0.5rem 1rem;
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.2rem;
  line-height: 1;
`;

const LanguageName = styled.span`
  flex: 1;
  font-weight: 500;
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 0.8rem;
  color: #6b7280;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const LanguageList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid rgb(255, 152, 0);
  border-top: none;
  border-radius: 0 0 0.8rem 0.8rem;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const LanguageOption = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$isSelected ? 'rgba(255, 152, 0, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 152, 0, 0.05);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
  
  ${media('<=tablet')} {
    padding: 0.6rem 1rem;
  }
`;

const SuccessParticle = styled.div<{ $color: string; $shape: string; $delay: number }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background: ${props => props.$color};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: ${props => props.$shape === 'circle' ? '50%' : '2px'};
  animation: ${confetti} 1s ease-out forwards;
  animation-delay: ${props => props.$delay}s;
  opacity: 0;
`;

const WordsReadCounter = styled.div<{ $hasWords: boolean; $justUpdated: boolean }>`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  font-size: 1.1rem;
  color: #2563eb;
  font-weight: 500;
  z-index: 15;
  animation: ${(props) => props.$hasWords ? successGlow : 'none'} 1s ease-out;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: #22c55e;
    border-radius: 50%;
    opacity: 0;
    z-index: -1;
    animation: ${(props) => props.$justUpdated ? successBurst : 'none'} 1s ease-out;
  }
  
  ${media('<=tablet')} {
    font-size: 1rem;
    right: 1.5rem;
    top: 1rem;
  }
  
  ${media('<=phone')} {
    font-size: 0.9rem;
    right: 1rem;
    gap: 0.3rem;
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
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #22c55e, #3b82f6);
    background-size: 200% 100%;
    animation: ${countUp} 0.8s ease-out;
    border-radius: 2px;
  }
  
  &::before {
    content: '✨';
    position: absolute;
    top: -12px;
    right: -12px;
    font-size: 1.4rem;
    animation: ${sparkle} 1s ease-out;
    animation-delay: 0.3s;
  }
  
  ${media('<=tablet')} {
    font-size: 1.3rem;
    padding: 0.2rem 0.5rem;
  }
  
  ${media('<=phone')} {
    font-size: 1.2rem;
    padding: 0.15rem 0.4rem;
    
    &::before {
      font-size: 1.2rem;
      top: -10px;
      right: -10px;
    }
  }
`;

const WordsLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  line-height: 1.2;
  
  span {
    font-size: 1rem;
    font-weight: 500;
  }
  
  ${media('<=tablet')} {
    span {
      font-size: 0.9rem;
    }
  }
  
  ${media('<=phone')} {
    span {
      font-size: 0.85rem;
    }
  }
`;

// Signup Section Styles
const SignupSection = styled.div<{ $isFullscreen: boolean }>`
  position: fixed;
  z-index: 200;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  ${props => props.$isFullscreen ? css`
    /* Fullscreen mode - for modal */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vw;
    height: 90vh;
    max-width: 65rem;
    max-height: 90vh;
    border-radius: 1.6rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    animation: scaleIn 0.3s ease-out;
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    ${media('<=tablet')} {
      width: 95vw;
      height: 95vh;
    }
  ` : css`
    /* Panel mode - slides from bottom */
    bottom: 0;
    left: 0;
    right: 0;
    height: 85vh;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
    border-radius: 2rem 2rem 0 0;
    animation: slideUp 0.4s ease-out;
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
    
    ${media('<=tablet')} {
      height: 90vh;
    }
  `}
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

const EmailInputCompact = styled.input<{ $hasError: boolean }>`
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

const SignupExpandedWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SignupExpanded = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  padding-bottom: 3rem;
  height: 100%;
  position: relative;
  justify-content: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  ${media('<=tablet')} {
    padding: 1.5rem;
    gap: 1.2rem;
  }
`;

const SignupTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  line-height: 1.2;
  margin-top: 1rem;
  
  ${media('<=tablet')} {
    font-size: 1.9rem;
    margin-top: 0.5rem;
  }
`;

const SignupSubtitle = styled.p`
  font-size: 1.5rem;
  color: #6b7280;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.3rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 30rem;
`;

const EmailInputExpanded = styled.input<{ $hasError: boolean }>`
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

const CloseButton = styled.button<{ $isFullscreen?: boolean }>`
  position: absolute;
  top: ${props => props.$isFullscreen ? '2rem' : '1.5rem'};
  right: ${props => props.$isFullscreen ? '2rem' : '1.5rem'};
  width: 3.6rem;
  height: 3.6rem;
  background: ${props => props.$isFullscreen ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  border: none;
  border-radius: 50%;
  font-size: 2.8rem;
  font-weight: 300;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 210;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${media('<=tablet')} {
    width: 3.2rem;
    height: 3.2rem;
    font-size: 2.4rem;
    top: ${props => props.$isFullscreen ? '1.5rem' : '1.2rem'};
    right: ${props => props.$isFullscreen ? '1.5rem' : '1.2rem'};
  }
  
  ${media('<=phone')} {
    width: 2.8rem;
    height: 2.8rem;
    font-size: 2.2rem;
    top: 1rem;
    right: 1rem;
  }
`;

// New styled components for customized signup
const LanguageSetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin: 0 auto;
  max-width: 700px;
  padding-bottom: 1rem;
`;

const LanguageSetupRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  
  ${media('<=tablet')} {
    gap: 1.5rem;
    max-width: 450px;
  }
  
  ${media('<=phone')} {
    flex-wrap: wrap;
    gap: 1.2rem;
  }
`;

// Add pulse glow animation for language selection prompt
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
  }
`;

const LanguageBox = styled.div<{ $isEditing?: boolean; $isPulsing?: boolean }>`
  background: ${props => props.$isEditing ? '#fff3cd' : '#f8f9fa'};
  border: 2px solid ${props => props.$isEditing ? '#ff9800' : props.$isPulsing ? '#ff9800' : '#e5e7eb'};
  border-radius: 1.2rem;
  padding: 1.8rem;
  min-width: 220px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  ${props => props.$isPulsing && css`
    animation: ${pulseGlow} 2s ease-in-out infinite;
  `}
  
  &::after {
    content: '✏️';
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    font-size: 1.4rem;
    opacity: 0.6;
    transition: all 0.2s ease;
  }
  
  &:hover {
    border-color: ${props => props.$isEditing ? '#ff9800' : '#ff9800'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: ${props => props.$isEditing ? '#fff3cd' : '#fefefe'};
    
    &::after {
      opacity: 1;
      transform: scale(1.1);
    }
  }
  
  ${media('<=tablet')} {
    min-width: 180px;
    padding: 1.4rem;
    
    &::after {
      font-size: 1.2rem;
      top: 0.6rem;
      right: 0.6rem;
    }
  }
  
  ${media('<=phone')} {
    min-width: 140px;
    padding: 1.2rem;
  }
`;

const LanguageBoxLabel = styled.div`
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 0.8rem;
  font-weight: 500;
`;

const LanguageDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
  padding: 0.6rem 1.2rem;
  background: white;
  border-radius: 0.8rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  ${LanguageFlag} {
    font-size: 2.4rem;
  }
  
  ${LanguageName} {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1f2937;
  }
`;

const LanguageNote = styled.div`
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 1.4rem;
  
  ${media('<=tablet')} {
    font-size: 1rem;
  }
`;

const ArrowIcon = styled.div`
  font-size: 2.4rem;
  color: #ff9800;
  font-weight: bold;
  
  ${media('<=tablet')} {
    font-size: 2rem;
    transform: rotate(90deg);
  }
`;

const LevelSelectorContainer = styled.div<{ $isDisabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
  opacity: ${props => props.$isDisabled ? '0.4' : '1'};
  transition: opacity 0.3s ease;
  position: relative;
  
  ${props => props.$isDisabled && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      cursor: not-allowed;
      z-index: 1;
    }
  `}
`;

// Book animation styles
const bookFloat = keyframes`
  0% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(-5deg);
  }
`;

const bookFadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
`;

const BookAnimationWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 100;
  border-radius: 2rem;
`;

const BookAnimationOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: ${bookFadeInOut} 2s ease-in-out;
`;

const BookIcon = styled.div`
  font-size: 5rem;
  animation: ${bookFloat} 1.5s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  
  ${media('<=tablet')} {
    font-size: 4rem;
  }
`;

const BookText = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #ff9800;
  text-align: center;
  background: white;
  padding: 1rem 2rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  
  ${media('<=tablet')} {
    font-size: 1.4rem;
    padding: 0.8rem 1.6rem;
  }
  
  ${media('<=phone')} {
    font-size: 1.2rem;
    white-space: normal;
    max-width: 250px;
    padding: 0.8rem 1.4rem;
  }
`;

const LevelLabel = styled.label`
  font-size: 1.6rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
`;

const LevelButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  justify-content: center;
  max-width: 420px;
  margin: 0 auto;
  
  ${media('<=tablet')} {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    max-width: 360px;
  }
  
  ${media('<=phone')} {
    grid-template-columns: repeat(2, 1fr);
    max-width: 280px;
  }
`;

// Add level selection animation
const levelPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
`;

const levelPulseRing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
`;

const LevelButton = styled.button<{ $isActive: boolean; $isDisabled?: boolean; $needsSelection?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.2rem 1.5rem;
  background: ${props => props.$isDisabled ? '#f3f4f6' : props.$isActive ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' : 'white'};
  border: 2px solid ${props => props.$isDisabled ? '#e5e7eb' : props.$isActive ? '#ff9800' : '#e5e7eb'};
  border-radius: 1rem;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  min-width: 100px;
  color: ${props => props.$isDisabled ? '#9ca3af' : props.$isActive ? 'white' : '#374151'};
  opacity: ${props => props.$isDisabled ? '0.6' : '1'};
  position: relative;
  
  ${props => props.$needsSelection && !props.$isDisabled && css`
    animation: ${levelPulse} 2s ease-in-out infinite;
    border-color: #ff9800;
    
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid #ff9800;
      border-radius: 1.2rem;
      opacity: 0;
      animation: ${levelPulseRing} 2s ease-in-out infinite;
    }
  `}
  
  &:hover:not(:disabled) {
    transform: ${props => props.$isDisabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isDisabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
    border-color: ${props => props.$isDisabled ? '#e5e7eb' : '#ff9800'};
  }
  
  ${media('<=tablet')} {
    padding: 1rem 1.2rem;
    min-width: 90px;
  }
`;

const LevelEmoji = styled.div`
  font-size: 2.4rem;
  line-height: 1;
`;

const LevelName = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const LevelDesc = styled.div`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const ContinueButton = styled.button`
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  padding: 1.6rem 3rem;
  font-size: 1.8rem;
  font-weight: 700;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondarySection = styled.div`
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const SecondaryDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const SecondaryButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 1.8rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #374151;
  }
`;

const PromptMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 1.6rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 1rem;
  padding: 1.2rem 2rem;
  background: rgba(255, 152, 0, 0.05);
  border: 2px dashed rgba(255, 152, 0, 0.3);
  border-radius: 0.8rem;
  
  ${media('<=tablet')} {
    font-size: 1.4rem;
    padding: 1rem 1.5rem;
  }
`;

const PromptIcon = styled.span`
  font-size: 2rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
  
  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  color: #dc2626;
  font-weight: 500;
  margin-top: 1rem;
  padding: 1.2rem 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.8rem;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
    padding: 1rem 1.5rem;
  }
`;

const ErrorIcon = styled.span`
  font-size: 1.8rem;
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const LanguagePickerContainer = styled.div`
  background: white;
  border: 2px solid #ff9800;
  border-radius: 1.2rem;
  padding: 1.5rem;
  margin-top: -1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LanguagePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.8rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  ${media('<=tablet')} {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    max-height: 250px;
  }
`;

const LanguagePickerOption = styled.button<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  background: ${props => props.$isSelected ? 'rgba(255, 152, 0, 0.1)' : 'white'};
  border: 1px solid ${props => props.$isSelected ? '#ff9800' : '#e5e7eb'};
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.3rem;
  color: #374151;
  text-align: left;
  
  &:hover {
    background: rgba(255, 152, 0, 0.05);
    border-color: #ff9800;
  }
  
  span:first-child {
    font-size: 1.6rem;
  }
  
  span:last-child {
    font-size: 1.2rem;
    font-weight: 500;
  }
  
  ${media('<=tablet')} {
    padding: 0.6rem 0.8rem;
    
    span:first-child {
      font-size: 1.4rem;
    }
    
    span:last-child {
      font-size: 1.1rem;
    }
  }
`;

// Registration Section Styles
const RegistrationSection = styled.div<{ $isComplete: boolean }>`
  background: ${props => props.$isComplete ? '#f0fdf4' : '#f8f9fa'};
  border: 2px solid ${props => props.$isComplete ? '#22c55e' : '#e5e7eb'};
  border-radius: 1.2rem;
  padding: 2rem;
  margin: 1rem 0;
  transition: all 0.3s ease;
  
  ${media('<=tablet')} {
    padding: 1.5rem;
  }
`;

const RegistrationHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const RegistrationTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const RegistrationSubtitle = styled.p`
  font-size: 1.3rem;
  color: #6b7280;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
`;

const RegistrationOptions = styled.div`
  display: flex;
  gap: 2rem;
  align-items: stretch;
  
  ${media('<=tablet')} {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const RegistrationColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RegistrationMethod = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const MethodLabel = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmailRegistrationInput = styled.input`
  padding: 1.2rem 1.5rem;
  font-size: 1.4rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.8rem;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #ff9800;
    box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const EmailSignupButton = styled.button`
  background: #ff9800;
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  font-size: 1.4rem;
  font-weight: 600;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    background: #f57c00;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1px;
    height: 100%;
    background: #e5e7eb;
  }
  
  ${media('<=tablet')} {
    &::before {
      width: 100%;
      height: 1px;
    }
  }
`;

const OrText = styled.span`
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  color: #6b7280;
  font-size: 1.2rem;
  font-weight: 500;
  z-index: 1;
  position: relative;
`;

const GoogleSignupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1.2rem 2rem;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 0.8rem;
  font-size: 1.4rem;
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
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const GoogleNote = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  text-align: center;
`;

// Compact Registration Section Styles
const OrDividerCompact = styled.span`
  color: #6b7280;
  font-size: 1.2rem;
  font-weight: 500;
  flex-shrink: 0;
  padding: 0 0.5rem;
  transition: opacity 0.3s ease;
  
  ${media('<=tablet')} {
    font-size: 1.1rem;
    padding: 0 0.3rem;
  }
  
  ${media('<=phone')} {
    font-size: 1rem;
    padding: 0 0.2rem;
  }
`;

const GoogleSignupButtonCompact = styled.button<{ $needsAttention?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 1.4rem;
  background: white;
  border: 2px solid ${props => props.$needsAttention ? '#ff9800' : '#e1e5e9'};
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  width: 160px;
  position: relative;
  
  ${props => props.$needsAttention && css`
    animation: ${levelPulse} 2s ease-in-out infinite;
    animation-delay: 0.5s;
    border-color: #ff9800;
    
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid #ff9800;
      border-radius: 0.8rem;
      opacity: 0;
      animation: ${levelPulseRing} 2s ease-in-out infinite;
      animation-delay: 0.5s;
      pointer-events: none;
    }
  `}
  
  &:hover {
    background: #f8f9fa;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    animation-play-state: paused;
    
    &::after {
      animation-play-state: paused;
    }
  }
  
  svg {
    flex-shrink: 0;
  }
  
  ${media('<=tablet')} {
    width: 140px;
    padding: 0.8rem 1rem;
    font-size: 1.2rem;
    gap: 0.5rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  ${media('<=phone')} {
    width: 120px;
    padding: 0.7rem 0.8rem;
    font-size: 1.1rem;
    gap: 0.4rem;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const CompactRegistrationSection = styled.div<{ $needsAttention?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 500px;
  
  &:focus-within {
    ${OrDividerCompact} {
      opacity: 0;
      pointer-events: none;
    }
    
    ${GoogleSignupButtonCompact} {
      opacity: 0;
      pointer-events: none;
    }
  }
  
  ${media('<=tablet')} {
    gap: 0.8rem;
    padding: 1rem 0.5rem;
    max-width: 400px;
  }
  
  ${media('<=phone')} {
    gap: 0.6rem;
    max-width: 100%;
  }
`;

const EmailRegistrationInputCompact = styled.input<{ $needsAttention?: boolean; $isValid?: boolean }>`
  width: 160px;
  padding: 0.9rem 1.2rem;
  font-size: 1.3rem;
  border: 2px solid ${props => props.$isValid ? '#22c55e' : props.$needsAttention ? '#ff9800' : '#e5e7eb'};
  border-radius: 0.8rem;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  z-index: 20;
  
  ${props => props.$needsAttention && !props.$isValid && css`
    animation: ${levelPulse} 2s ease-in-out infinite;
    border-color: #ff9800;
    
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid #ff9800;
      border-radius: 0.8rem;
      opacity: 0;
      animation: ${levelPulseRing} 2s ease-in-out infinite;
      pointer-events: none;
    }
  `}
  
  ${props => props.$isValid && css`
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  `}
  
  &:focus {
    border-color: ${props => props.$isValid ? '#22c55e' : '#ff9800'};
    box-shadow: 0 0 0 3px ${props => props.$isValid ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 152, 0, 0.1)'};
    width: calc(100% - 2rem);
    position: absolute;
    left: 1rem;
    animation: none;
    
    &::after {
      display: none;
    }
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  ${media('<=tablet')} {
    width: 140px;
    padding: 0.8rem 1rem;
    font-size: 1.2rem;
    
    &:focus {
      width: calc(100% - 1rem);
      left: 0.5rem;
    }
  }
  
  ${media('<=phone')} {
    width: 120px;
    padding: 0.7rem 0.8rem;
    font-size: 1.1rem;
    
    &:focus {
      width: calc(100% - 1rem);
      left: 0.5rem;
    }
    
    &::placeholder {
      font-size: 1rem;
    }
  }
`;
