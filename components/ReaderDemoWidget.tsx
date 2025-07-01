import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { DEFAULT_LANGUAGES, Language, useVisitor } from 'contexts/VisitorContext';
import { getFallbackTranslation, readerTranslations } from 'data/readerTranslations';
import { apiService } from 'services/apiService';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';

import {
  ArrowIcon,
  ArrowIndicator,
  AutoAdvanceNote,
  BackButton,
  BookAnimationOverlay,
  BookAnimationWrapper,
  BookContent,
  BookIcon,
  BookText,
  BottomBar,
  ButtonContainer,
  ChevronIcon,
  CloseButton,
  CompactFormRow,
  CompactRegistrationSection,
  ContentArea,
  ContinueButton,
  DividerCompact,
  DividerLine,
  DividerText,
  EducationalContent,
  EmailInputCompact,
  EmailInputExpanded,
  EmailRegistrationInput,
  EmailRegistrationInputCompact,
  EmailSignupButton,
  ErrorIcon,
  ErrorMessage,
  ErrorText,
  ErrorTextCompact,
  GoogleButton,
  GoogleButtonCompact,
  GoogleNote,
  GoogleSignupButton,
  GoogleSignupButtonCompact,
  HintText,
  InlineTranslation,
  LanguageBox,
  LanguageBoxLabel,
  LanguageDisplay,
  LanguageDropdown,
  LanguageFlag,
  LanguageList,
  LanguageName,
  LanguageNote,
  LanguageOption,
  LanguagePickerContainer,
  LanguagePickerGrid,
  LanguagePickerOption,
  LanguageSelectorContainer,
  LanguageSetupContainer,
  LanguageSetupRow,
  LevelButton,
  LevelButtons,
  LevelDesc,
  LevelEmoji,
  LevelLabel,
  LevelName,
  LevelSelectorContainer,
  LoginLink,
  LoginPrompt,
  MessageIcon,
  MessageText,
  MessageTitle,
  MethodLabel,
  NavButtonLeft,
  NavButtonRight,
  OrDivider,
  OrDividerCompact,
  OriginalText,
  OrText,
  PageInput,
  PageInputContainer,
  PageNavButton,
  PageNavigation,
  PageTotal,
  ParagraphContainer,
  PopupArrow,
  PopupText,
  PrimaryButton,
  PromptIcon,
  PromptMessage,
  PromptText,
  PulseRing,
  ReaderContainer,
  ReaderWrapper,
  RegistrationColumn,
  RegistrationHeader,
  RegistrationMethod,
  RegistrationOptions,
  RegistrationSection,
  RegistrationSubtitle,
  RegistrationTitle,
  ScientificNote,
  SecondaryButton,
  SecondaryButtons,
  SecondaryDivider,
  SecondarySection,
  SelectedLanguage,
  SignupButtonCompact,
  SignupCompact,
  SignupExpanded,
  SignupExpandedWrapper,
  SignupSection,
  SignupSubtitle,
  SignupTitle,
  SuccessParticle,
  TranslatableText,
  TranslationPopup,
  TranslationText,
  WidgetWrapper,
  WordCountBadge,
  WordsLabel,
  WordsNumber,
  WordsReadCounter
} from './ReaderDemoWidget.styles';

// Type definitions
interface ReaderDemoWidgetProps {
  selectedLanguage?: Language | null;
  onInteraction?: () => void;
  onLanguageChange?: (language: Language) => void;
  useInlineSignup?: boolean;
  signupMode?: 'panel' | 'fullscreen';
  onSignupVisibilityChange?: (isVisible: boolean) => void;
  isFullRegister?: boolean;
  openSignupDirectly?: boolean; // New prop to open signup immediately
}

export default function ReaderDemoWidget({ 
  selectedLanguage: propSelectedLanguage, 
  onInteraction, 
  onLanguageChange, 
  useInlineSignup = false,
  signupMode = 'panel',
  onSignupVisibilityChange,
  isFullRegister = true,
  openSignupDirectly = false // New prop with default value
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
  const [hasRegistered, setHasRegistered] = useState(openSignupDirectly || false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const [showValidEmailIndicator, setShowValidEmailIndicator] = useState(false);
  const [hasAutoOpenedLanguage, setHasAutoOpenedLanguage] = useState(false);
  const [showEducationalMessage, setShowEducationalMessage] = useState(false);
  const scrollLockCleanupRef = useRef<(() => void) | null>(null);
  
  // Handle opening signup directly if prop is set OR if returning from OAuth
  useEffect(() => {
    console.log('ReaderDemoWidget mounted with props:', {
      openSignupDirectly,
      useInlineSignup,
      signupMode,
      isFullRegister
    });
    
    // Check sessionStorage for OAuth return
    const returnToWidget = sessionStorage.getItem('returnToWidget');
    const registrationFlow = sessionStorage.getItem('registrationFlow');
    
    console.log('OAuth return check:', {
      returnToWidget,
      registrationFlow,
      openSignupDirectly
    });
    
    const shouldOpenSignup = openSignupDirectly || returnToWidget === 'true' || registrationFlow === 'google';
    
    if (shouldOpenSignup && useInlineSignup) {
      console.log('ReaderDemoWidget: Opening signup (prop or OAuth return)');
      console.log('Current language from context:', {
        nativeLanguage: nativeLanguage?.name,
        selectedLanguage: contextLanguage?.name,
        hasSelectedLanguage
      });
      
      // If OAuth return, handle the data
      if (openSignupDirectly || returnToWidget === 'true' || registrationFlow === 'google') {
        console.log('Setting hasRegistered to true');
        // Clear the flags
        sessionStorage.removeItem('returnToWidget');
        sessionStorage.removeItem('registrationFlow');
        
        // Mark as registered
        setHasRegistered(true);
        
        // Language preferences are already restored from localStorage by VisitorContext
        // Just ensure we have the selected language marked as selected
        if (contextLanguage && !hasSelectedLanguage) {
          setHasSelectedLanguage(true);
          setHasSelectedTarget(true);
        }
      }
      
      // Add a small delay to ensure component is fully mounted
      setTimeout(() => {
        console.log('Setting showSignupExpanded to true');
        setShowSignupExpanded(true);
        if (onSignupVisibilityChange) {
          onSignupVisibilityChange(true);
        }
      }, 300); // Increased delay
    }
  }, [openSignupDirectly, useInlineSignup, onSignupVisibilityChange]);
  
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
    } else if (hasSelectedLanguage || openSignupDirectly) {
      setHasSelectedTarget(true);
    }
  }, [hasSelectedLanguage, currentLanguage.code, openSignupDirectly]);
  
  // Update temp languages when context changes
  useEffect(() => {
    if (nativeLanguage) {
      setTempNativeLanguage(nativeLanguage);
    }
  }, [nativeLanguage]);
  
  useEffect(() => {
    if (currentLanguage) {
      setTempTargetLanguage(currentLanguage);
      // If we have a selected language from context, ensure it's marked as selected
      if (hasSelectedLanguage && currentLanguage.code !== 'de') {
        setHasSelectedTarget(true);
      }
    }
  }, [currentLanguage, hasSelectedLanguage]);
  
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
        // Show educational message in place of content
        setShowEducationalMessage(true);
        lockScroll();
        
        // After 4 seconds, hide message and continue with word counting
        setTimeout(() => {
          setShowEducationalMessage(false);
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
                setTimeout(() => {
                  setJustUpdated(false);
                  // Unlock scroll after the entire animation is complete
                  unlockScroll();
                }, 1000);
              }, 1000);
            }, 100); // Small delay after loading completes
          }, 2900); // Stop just before 3 seconds
        }, 4000); // 4 seconds to read the message
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
    // For the secondary signup flow
    const baseUrl = 'https://staging.langomango.com';
    const returnUrl = encodeURIComponent('/sign-up');
    const frontendRedirectUrl = encodeURIComponent('https://beta-app.langomango.com/');
    const googleAuthUrl = `${baseUrl}/auth/login-google?returnUrl=${returnUrl}&frontendRedirectUrl=${frontendRedirectUrl}`;
    
    console.log('Redirecting to Google OAuth (secondary flow):', googleAuthUrl);
    window.location.href = googleAuthUrl;
  }, []);

  // Handle demo signup with level selection
  const handleLevelSelect = useCallback(async (level: string) => {
    if (!hasSelectedTarget || isEditingTarget) return;
    
    setSelectedLevel(level);
    setSignupError('');
    setIsLoadingSignup(true);
    setShowBookAnimation(true);
    
    try {
      // Track Reddit pixel signup event
      trackRedditConversion(RedditEventTypes.SIGNUP, {
        signup_type: 'demo',
        native_language: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
        target_language: tempTargetLanguage.code,
        level: level,
        source: 'reader_widget'
      });
      
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
    } catch (error) {
      console.error('Demo signup error:', error);
      setSignupError(error instanceof Error ? error.message : 'Failed to create demo account. Please try again.');
      setShowBookAnimation(false);
      setIsLoadingSignup(false);
      setSelectedLevel('');
    }
  }, [hasSelectedTarget, isEditingTarget, tempNativeLanguage, nativeLanguage, tempTargetLanguage]);

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

  // Simple scroll lock function
  const lockScroll = () => {
    // Prevent scrolling events
    const preventScroll = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Add listeners
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('keydown', preventScroll, { passive: false });
    
    // Store cleanup function
    scrollLockCleanupRef.current = () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventScroll);
      scrollLockCleanupRef.current = null;
    };
  };

  const unlockScroll = () => {
    if (scrollLockCleanupRef.current) {
      scrollLockCleanupRef.current();
    }
  };

  // Custom smooth scroll implementation
  const smoothScrollTo = (targetY: number, duration: number = 300) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    let animationId: number | null = null;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, startY + distance * easeProgress);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animateScroll);
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
            // Lock scroll immediately before auto-scroll starts
            lockScroll();
            
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
            // Don't lock scroll here - it's already locked from auto-scroll
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
                  setTimeout(() => {
                    setJustUpdated(false);
                    // Unlock scroll after the entire animation is complete
                    unlockScroll();
                  }, 1000);
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
            // Unlock scroll if it was locked
            unlockScroll();
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
      // Ensure scroll is unlocked on cleanup
      unlockScroll();
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
          {showEducationalMessage ? (
            <ContentArea>
              <EducationalContent>
                <MessageText>
                  You will be exposed to your target language while you read.
                </MessageText>
                <MessageText>
                  Did you know that there are required <strong>10-30</strong> exposures to a word to learn it?
                </MessageText>
                <AutoAdvanceNote>
                  Continuing in a moment...
                </AutoAdvanceNote>
              </EducationalContent>
            </ContentArea>
          ) : (
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
                    // Calculate animation delay based on segment position
                    const animationDelay = index * 0.15 + segmentIndex * 0.1;
                    return (
                      <InlineTranslation key={key}>
                        <WordCountBadge 
                          key={`badge-${key}`}
                          $isVisible={showWordCounts}
                          $animationDelay={animationDelay}
                          style={{ opacity: showWordCounts ? 1 : 0, visibility: showWordCounts ? 'visible' : 'hidden' }}
                        >
                          {wordCount} words in {currentLanguage.name}
                        </WordCountBadge>
                        <OriginalText $isVisible={showWordCounts} $animationDelay={animationDelay}>{segment.text}</OriginalText>
                        <TranslationText $isVisible={showWordCounts} $animationDelay={animationDelay}>{translatedText}</TranslationText>
                      </InlineTranslation>
                    );
                  } else {
                    return <span key={key}>{segment.text}</span>;
                  }
                })}
              </ParagraphContainer>
            ))}
              </ContentArea>
          )}

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
                

                
                <LevelSelectorContainer $isDisabled={!hasSelectedTarget || isEditingTarget}>
                  <LevelLabel>Select your {tempTargetLanguage.name} level:</LevelLabel>
                  <LevelButtons>
                    <LevelButton 
                      $isActive={selectedLevel === 'A1'}
                      onClick={() => handleLevelSelect('A1')}
                      $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel}
                    >
                      <LevelEmoji>🌱</LevelEmoji>
                      <LevelName>A1</LevelName>
                      <LevelDesc>Beginner</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'A2'}
                      onClick={() => handleLevelSelect('A2')}
                      $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel}
                    >
                      <LevelEmoji>🌿</LevelEmoji>
                      <LevelName>A2</LevelName>
                      <LevelDesc>Elementary</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'B1'}
                      onClick={() => handleLevelSelect('B1')}
                      $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel}
                    >
                      <LevelEmoji>🍀</LevelEmoji>
                      <LevelName>B1</LevelName>
                      <LevelDesc>Intermediate</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'B2'}
                      onClick={() => handleLevelSelect('B2')}
                      $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel}
                    >
                      <LevelEmoji>🌳</LevelEmoji>
                      <LevelName>B2</LevelName>
                      <LevelDesc>Upper Int.</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'C1'}
                      onClick={() => handleLevelSelect('C1')}
                      $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel}
                    >
                      <LevelEmoji>🌲</LevelEmoji>
                      <LevelName>C1</LevelName>
                      <LevelDesc>Advanced</LevelDesc>
                    </LevelButton>
                    <LevelButton 
                      $isActive={selectedLevel === 'C2'}
                      onClick={() => handleLevelSelect('C2')}
                      $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                      $needsSelection={hasSelectedTarget && !selectedLevel}
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
