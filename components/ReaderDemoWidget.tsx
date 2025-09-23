import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { DEFAULT_LANGUAGES, Language, useVisitor } from 'contexts/VisitorContext';
import { getFallbackTranslation, readerTranslations } from 'data/readerTranslations';
import { apiService,} from 'services/apiService';

import { bookContentSentences, bookContentWords } from './ReaderDemoWidget.content';
import {
  AlphabetLetter,
  AlphabetProgressContainer,
  ArrowIndicator,
  AutoAdvanceNote,
  BookContent,
  
  BottomBar,
  
  ChevronIcon,
  
  ContentArea,
  
  EducationalContent,
  
  HintText,
  InlineTranslation,
  
  LanguageDropdown,
  LanguageFlag,
  LanguageList,
  LanguageName,
  
  LanguageOption,
  
  LanguageSelectorContainer,
  
  MessageText,
  NavButtonLeft,
  NavButtonRight,
  OriginalText,
  PageInput,
  PageInputContainer,
  PageNavigation,
  PageTotal,
  ParagraphContainer,
  PopupArrow,
  PopupText,
  
  ProgressHint,
  ProgressMessage,
  
  PulseRing,
  ReaderContainer,
  ReaderWrapper,
  
  SelectedLanguage,
  
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
import SignupModal from './SignupModal';


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
    targetSelectedLanguage: contextLanguage,
    targetSelectedLanguageLevel: contextLanguageLevel,
    setTargetSelectedLanguage: setContextLanguage,
    nativeLanguage,
    hasTargetSelectedLanguage: hasSelectedLanguage,
    setHasTargetSelectedLanguage,
    hasTargetSelectedLevel: hasSelectedLevel,
    setHasSelectedLevel
  } = useVisitor();
  const [currentPage, setCurrentPage] = useState(8);
  const [totalPages] = useState(511);
  const [pageInput, setPageInput] = useState('8');
  const [showSignupExpanded, setShowSignupExpanded] = useState(false);

  const [wordsRead, setWordsRead] = useState(0);
  const [, setHasClicked] = useState(false);
  const [showWordCounts, setShowWordCounts] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('');

  const [, setIsEditingNative] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [hasSelectedTarget, setHasSelectedTarget] = useState(hasSelectedLanguage);
  
  
  const [, setSignupError] = useState('');
  const [isCalculatingWords, setIsCalculatingWords] = useState(false);
  const [shouldAnimateButton, setShouldAnimateButton] = useState(false);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [autoScrollPerformed, setAutoScrollPerformed] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const [, setHasStartedInitialAnimation] = useState(false);
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [hasRegistered, setHasRegistered] = useState(openSignupDirectly || false);
  
  const [hasAutoOpenedLanguage, setHasAutoOpenedLanguage] = useState(false);
  const [showEducationalMessage, setShowEducationalMessage] = useState(false);
  const [showSecondEducationalMessage, setShowSecondEducationalMessage] = useState(false);
  const [showThirdEducationalMessage, setShowThirdEducationalMessage] = useState(false);
  const [isHidingEducationalMessage, setIsHidingEducationalMessage] = useState(false);
  const [isHidingSecondEducationalMessage, setIsHidingSecondEducationalMessage] = useState(false);
  const [isHidingThirdEducationalMessage, setIsHidingThirdEducationalMessage] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const scrollLockCleanupRef = useRef<(() => void) | null>(null);
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);
  const bookContentRef = useRef<HTMLDivElement>(null);
  const [showAlphabetProgress, setShowAlphabetProgress] = useState(false);
  const [activeLetters, setActiveLetters] = useState<string[]>([]);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const alphabetArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [alphabetStage, setAlphabetStage] = useState(0); // 0: initial, 1-3: after clicks
  const [, setShowPricingPage] = useState(false);
  const [demoLevel, setDemoLevel] = useState<string>('A1'); // Default demo level is A1
  


  // Sync demo level with context level only if user has selected it
  useEffect(() => {
    if (contextLanguageLevel && hasSelectedLevel) {
      setDemoLevel(contextLanguageLevel);
      setSelectedLevel(contextLanguageLevel);
      sessionStorage.setItem('selectedLevel', contextLanguageLevel);
    } else if (contextLanguageLevel && !hasSelectedLevel) {
      // If there's a level but user hasn't selected it, use it for demo but not for selection
      setDemoLevel(contextLanguageLevel);
    }
  }, [contextLanguageLevel, hasSelectedLevel]);

  // Handle opening signup directly if prop is set OR if returning from OAuth
  useEffect(() => {
    console.log('ReaderDemoWidget mounted with props:', {
      openSignupDirectly,
      useInlineSignup,
      signupMode,
      isFullRegister
    });

    // Check for OAuth return with pricing flow
    const showPricingAfterAuth = localStorage.getItem('showPricingAfterAuth');
    const authToken = localStorage.getItem('token');
    const pendingPrefs = localStorage.getItem('pendingLanguagePrefs');

    if (showPricingAfterAuth === 'true' && authToken && pendingPrefs) {
      console.log('OAuth return detected, updating profile and showing pricing');

      // Parse stored preferences
      const prefs = JSON.parse(pendingPrefs);

      // Restore language selections in UI immediately
      setSelectedLevel(prefs.level);
      setDemoLevel(prefs.level);
      setHasSelectedLevel(true); // User had selected this level before OAuth
      sessionStorage.setItem('selectedLevel', prefs.level);

      if (prefs.targetLanguage) {
        const targetLang = DEFAULT_LANGUAGES.find(l => l.code === prefs.targetLanguage);
        if (targetLang) {
          setTempTargetLanguage(targetLang);
          setContextLanguage(targetLang, prefs.level);
          setHasSelectedTarget(true);
          setHasTargetSelectedLanguage(true);
        }
      }

      // Update user profile with language preferences
      apiService.updateUserProfile({
        nativeLanguage: prefs.nativeLanguage,
        targetLanguage: prefs.targetLanguage,
        level: prefs.level
      }, authToken).then(response => {
        if (response.success) {
          // Clean up localStorage
          localStorage.removeItem('showPricingAfterAuth');
          localStorage.removeItem('pendingLanguagePrefs');
          localStorage.removeItem('returnToWidget');

          // Mark as registered and show pricing
          setHasRegistered(true);
          setShowSignupExpanded(true);
          setShowPricingPage(true);

          if (onSignupVisibilityChange) {
            onSignupVisibilityChange(true);
          }
        }
      }).catch(error => {
        console.error('Failed to update profile after OAuth:', error);
        setSignupError('Failed to complete setup. Please try again.');
        // Still show signup form so user can see the error
        setShowSignupExpanded(true);
        if (onSignupVisibilityChange) {
          onSignupVisibilityChange(true);
        }
      });

      return; // Exit early to prevent normal flow
    }

    // Check sessionStorage for OAuth return (old flow)
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
          setHasTargetSelectedLanguage(true);
          setHasSelectedTarget(true);
        }

        // Also ensure level is properly set from context if user has selected it
        if (contextLanguageLevel && hasSelectedLevel) {
          setSelectedLevel(contextLanguageLevel);
          setDemoLevel(contextLanguageLevel);
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
  }, [openSignupDirectly, useInlineSignup, onSignupVisibilityChange, contextLanguage, contextLanguageLevel, hasSelectedLanguage, setHasTargetSelectedLanguage, hasSelectedLevel, nativeLanguage?.name, setContextLanguage, setHasSelectedLevel, signupMode, isFullRegister]);

  // Auto-open target language picker immediately when signup is shown
  useEffect(() => {
    if (showSignupExpanded && !hasSelectedTarget && !hasAutoOpenedLanguage) {
      setIsEditingTarget(true);
      setHasAutoOpenedLanguage(true);
    }
  }, [showSignupExpanded, hasSelectedTarget, hasAutoOpenedLanguage]);

  // Use context language as the source of truth, with fallback to prop or default
  const currentLanguage = React.useMemo(() => {
    return contextLanguage || propSelectedLanguage || { code: 'de', name: 'German', flag: '🇩🇪' };
  }, [contextLanguage, propSelectedLanguage]);

  // Initialize temp language states after currentLanguage is defined
  const [, setTempNativeLanguage] = useState(nativeLanguage);
  const [, setTempTargetLanguage] = useState(currentLanguage);

  // Reset animation states when language changes
  useEffect(() => {
    console.log('[Animation Reset] Language changed, resetting animation states');
    setHasStartedInitialAnimation(false);
    setIsInitialAnimationComplete(false);
    setShowWordCounts(false);
    setWordsRead(0);
    setJustUpdated(false);
    setShouldAnimateButton(false);
    setShowAlphabetProgress(false);
    setActiveLetters([]);
    setAlphabetStage(0);
    hasStartedTimerRef.current = false;
  }, [currentLanguage.code]);





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
  const getTranslation = useCallback((englishText: string) => {
    if (!currentLanguage || !englishText) return englishText;
    const langCode = currentLanguage.code;
    const langTranslations = readerTranslations[langCode];

    // Try to get translation from the main translations object
    if (langTranslations && langTranslations[englishText]) {
      return langTranslations[englishText];
    }

    // If not found, use the fallback function which will return the original text
    return getFallbackTranslation(englishText);
  }, [currentLanguage]);

  // Handle language selection
  const handleLanguageSelect = (language: Language) => {
    // Store the selected language temporarily
    setTempSelectedLanguage(language);
    // Show level selection dropdown
    setShowLevelDropdown(true);
    setIsLanguageDropdownOpen(false);
  };

  // Handle level selection
  const handleLevelSelectInDropdown = (level: string) => {
    if (tempSelectedLanguage) {
      // Update context language with level
      setContextLanguage(tempSelectedLanguage, level);
      setHasTargetSelectedLanguage(true);
      setHasSelectedLevel(true); // Mark level as explicitly selected by user

      // Store the selected level
      setSelectedLevel(level);
      setDemoLevel(level);
      sessionStorage.setItem('selectedLevel', level);

      // Close dropdowns
      setShowLevelDropdown(false);

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
        onLanguageChange(tempSelectedLanguage);
      }
    }
  };

  // Determine if we should show words only or sentences based on level
  const showWordsOnly = !demoLevel || demoLevel === 'A1' || demoLevel === 'A2';

  // Function to get random letters that haven't been added yet
  const getRandomLetters = useCallback((count: number, existing: string[]): string[] => {
    const availableLetters = alphabetArray.filter(letter => !existing.includes(letter));
    const selected: string[] = [];

    for (let i = 0; i < count && availableLetters.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      selected.push(availableLetters[randomIndex]);
      availableLetters.splice(randomIndex, 1);
    }

    return selected;
  }, [alphabetArray]);

  // Choose content based on level
  const bookContent = showWordsOnly ? bookContentWords : bookContentSentences;

  // hidePopup callback needs to be defined before other callbacks that use it
  const hidePopup = useCallback(() => {
    setPopup(prev => ({ ...prev, visible: false }));
  }, []);

  // Handle interactions - either use provided callback or default behavior
  const handleInteraction = useCallback(() => {
    if (onInteraction) {
      // If parent component provides interaction handler, use it
      onInteraction();
    }
    // Note: Signup is now triggered after the third educational message
    // See handleNextPage function for the logic
  }, [onInteraction]);

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
  }, [getTranslation, bookContent]);

  // Simple initial animation trigger
  useEffect(() => {
    // Only run once when component mounts and reader is ready
    if (!showWordCounts && wordsRead === 0) {
      console.log('[Initial Animation] Setting up initial word count animation');

      // Wait a bit for ref to be available
      const setupTimer = setTimeout(() => {
        if (!readerContainerRef.current) {
          console.log('[Initial Animation] Reader ref not available yet');
          return;
        }

        const runInitialAnimation = () => {
          const rect = readerContainerRef.current?.getBoundingClientRect();
          if (!rect) return false;

          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          const visibilityPercentage = visibleHeight / rect.height;
          const isVisible = visibilityPercentage >= 0.5;

          if (isVisible) {
            console.log('[Initial Animation] Reader is visible, starting animation');

            // Start loading animation
            setIsCalculatingWords(true);
            setShouldAnimateButton(false);

            // Show word counts after 2 seconds
            setTimeout(() => {
              setIsCalculatingWords(false);
              setShouldAnimateButton(true);

              requestAnimationFrame(() => {
                setTimeout(() => {
                  setShowWordCounts(true);
                  setShowAlphabetProgress(true);
                  const initialLetters = getRandomLetters(7, []);
                  setActiveLetters(initialLetters);
                  setAlphabetStage(0);

                  // Calculate initial words after 1 second
                  setTimeout(() => {
                    let totalWords = 0;
                    for (let i = 1; i <= currentPage; i++) {
                      totalWords += calculatePageWords(i);
                    }
                    console.log('[Initial Animation] Setting initial words:', totalWords);
                    setWordsRead(totalWords);
                    setJustUpdated(true);
                    setTimeout(() => {
                      setJustUpdated(false);
                      // Mark initial animation as complete and unlock scroll
                      setIsInitialAnimationComplete(true);
                      unlockScroll();
                    }, 1000);
                  }, 1000);
                }, 50);
              });
            }, 2000);

            return true; // Animation started
          }
          return false; // Not visible yet
        };

        // Try immediately
        if (!runInitialAnimation()) {
          // If not visible, check periodically
          const checkInterval = setInterval(() => {
            if (runInitialAnimation()) {
              clearInterval(checkInterval);
            }
          }, 100);

          // Store interval in closure
          const cleanup = () => clearInterval(checkInterval);
          return cleanup;
        }
      }, 200); // Wait 200ms for ref to be available

      return () => clearTimeout(setupTimer);
    }
  }, [showWordCounts, wordsRead, currentPage, calculatePageWords, getRandomLetters]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const newPageNumber = currentPage - 1;
      setCurrentPage(newPageNumber);
      setPageInput(newPageNumber.toString());
      hidePopup();
      handleInteraction();

      // Update word count when going back
      if (showWordCounts) {
        setTimeout(() => {
          let totalWords = 0;
          for (let i = 1; i <= newPageNumber; i++) {
            totalWords += calculatePageWords(i);
          }
          setWordsRead(totalWords);
          setJustUpdated(true);
          setTimeout(() => {
            setJustUpdated(false);
          }, 1000);
        }, 100);
      }
    }
  }, [currentPage, handleInteraction, hidePopup, showWordCounts, calculatePageWords]);

  const handleNextPage = useCallback(() => {
    // Check if we're currently showing an educational message
    if (showEducationalMessage || isHidingEducationalMessage) {
      // Hide first message immediately and show second message
      setShowEducationalMessage(false);
      setIsHidingEducationalMessage(false);
      setShowSecondEducationalMessage(true);

      // Add letters for second stage
      setAlphabetStage(2);
      const newLetters = getRandomLetters(7, activeLetters);
      setActiveLetters(prev => [...prev, ...newLetters]);

      // Set timer to hide second message
      setTimeout(() => {
        setIsHidingSecondEducationalMessage(true);
        setTimeout(() => {
          setShowSecondEducationalMessage(false);
          setIsHidingSecondEducationalMessage(false);
        }, 500);
      }, 4500);

      return; // Don't advance page
    } else if (showSecondEducationalMessage || isHidingSecondEducationalMessage) {
      // Hide second message immediately and show third message
      setShowSecondEducationalMessage(false);
      setIsHidingSecondEducationalMessage(false);
      setShowThirdEducationalMessage(true);

      // Add letters for third stage
      setAlphabetStage(3);
      const remainingLetters = getRandomLetters(6, activeLetters);
      setActiveLetters(prev => [...prev, ...remainingLetters]);

      // Show completion message
      setTimeout(() => {
        setShowCompletionMessage(true);
        setTimeout(() => {
          setShowCompletionMessage(false);
        }, 3000);
      }, 600);

      // Set timer to hide third message
      setTimeout(() => {
        setIsHidingThirdEducationalMessage(true);
        setTimeout(() => {
          setShowThirdEducationalMessage(false);
          setIsHidingThirdEducationalMessage(false);

          // Show signup after third educational message
          if (!showSignupExpanded && useInlineSignup) {
            setTimeout(() => {
              setShowSignupExpanded(true);
              if (onSignupVisibilityChange) {
                onSignupVisibilityChange(true);
              }
            }, 1500);
          } else if (!useInlineSignup) {
            setIsModalOpened(true);
          }
        }, 500);
      }, 4500);

      return; // Don't advance page
    } else if (showThirdEducationalMessage || isHidingThirdEducationalMessage) {
      // Just hide the third message immediately
      setShowThirdEducationalMessage(false);
      setIsHidingThirdEducationalMessage(false);

      // Show signup immediately
      if (!showSignupExpanded && useInlineSignup) {
        setShowSignupExpanded(true);
        if (onSignupVisibilityChange) {
          onSignupVisibilityChange(true);
        }
      } else if (!useInlineSignup) {
        setIsModalOpened(true);
      }

      return; // Don't advance page
    }

    // Normal page navigation logic
    if (currentPage < totalPages) {
      const newPageNumber = currentPage + 1;
      setCurrentPage(newPageNumber);
      setPageInput(newPageNumber.toString());
      hidePopup();
      handleInteraction();

      // Increment click count
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);

      // First click - add more letters (total: 7 + 6 = 13)
      if (newClickCount === 1) {
        setHasClicked(true);
        setAlphabetStage(1);

        // Add 6 more random letters on first click
        const newLetters = getRandomLetters(6, activeLetters);
        setActiveLetters(prev => [...prev, ...newLetters]);

        // Continue with educational message flow
        setShowEducationalMessage(true);
        // Only lock scroll if initial animation is not complete
        if (!isInitialAnimationComplete) {
          lockScroll();
        }

        // After 3.5 seconds, start hiding animation
        setTimeout(() => {
          setIsHidingEducationalMessage(true);
          // After fade-out animation completes, hide the message
          setTimeout(() => {
            setShowEducationalMessage(false);
            setIsHidingEducationalMessage(false);
            // Hide word counts temporarily
            // First hide word counts to ensure animation replays
            setShowWordCounts(false);
            setIsCalculatingWords(true); // Start loading animation
            setShouldAnimateButton(false); // Stop button animation during loading
            // Wait 2.9 seconds (just before 3 seconds) to stop loading
            setTimeout(() => {
              setIsCalculatingWords(false); // Stop loading animation
              setShouldAnimateButton(true); // Start button animation after loading
              // Force a small delay to ensure React re-renders
              requestAnimationFrame(() => {
                setTimeout(() => {
                  setShowWordCounts(true);
                  // Update global counter 1 second after word counts appear
                  setTimeout(() => {
                    // Calculate total words from all pages up to current
                    let totalWords = 0;
                    for (let i = 1; i <= newPageNumber; i++) {
                      totalWords += calculatePageWords(i);
                    }
                    setWordsRead(totalWords);
                    setJustUpdated(true);
                    setTimeout(() => {
                      setJustUpdated(false);
                      // Unlock scroll after the entire animation is complete
                      if (!isInitialAnimationComplete) {
                        unlockScroll();
                      }
                      // Mark initial animation as complete
                      setIsInitialAnimationComplete(true);
                    }, 1000);
                  }, 1000);
                }, 50); // Small delay after frame
              });
            }, 2900); // Stop just before 3 seconds
          }, 500); // 0.5 seconds for fade-out
        }, 3500); // 3.5 seconds to read the message
      } else if (newClickCount === 2) {
        // Second click - add more letters (total: 13 + 7 = 20)
        setAlphabetStage(2);
        const newLetters = getRandomLetters(7, activeLetters);
        setActiveLetters(prev => [...prev, ...newLetters]);

        // Show second educational message on second click
        setShowSecondEducationalMessage(true);
        // Don't lock scroll after initial animation is complete

        // Hide after 4.5 seconds
        setTimeout(() => {
          setIsHidingSecondEducationalMessage(true);
          // After fade-out animation completes
          setTimeout(() => {
            setShowSecondEducationalMessage(false);
            setIsHidingSecondEducationalMessage(false);

            // Update word count after second message
            setTimeout(() => {
              let totalWords = 0;
              for (let i = 1; i <= newPageNumber; i++) {
                totalWords += calculatePageWords(i);
              }
              setWordsRead(totalWords);
              setJustUpdated(true);
              setTimeout(() => {
                setJustUpdated(false);
              }, 1000);
            }, 500);
          }, 500); // 0.5 seconds for fade-out
        }, 4500); // 4.5 seconds to read
      } else if (newClickCount === 3) {
        // Third click - complete the alphabet (total: 20 + 6 = 26)
        setAlphabetStage(3);
        const remainingLetters = getRandomLetters(6, activeLetters);
        setActiveLetters(prev => [...prev, ...remainingLetters]);

        // Show completion message
        setTimeout(() => {
          setShowCompletionMessage(true);
          setTimeout(() => {
            setShowCompletionMessage(false);
          }, 3000);
        }, 600); // Show after letters animate in

        // Show third educational message on third click
        setShowThirdEducationalMessage(true);
        // Don't lock scroll after initial animation is complete

        // Hide after 4.5 seconds
        setTimeout(() => {
          setIsHidingThirdEducationalMessage(true);
          // After fade-out animation completes
          setTimeout(() => {
            setShowThirdEducationalMessage(false);
            setIsHidingThirdEducationalMessage(false);

            // Update word count after third message
            setTimeout(() => {
              let totalWords = 0;
              for (let i = 1; i <= newPageNumber; i++) {
                totalWords += calculatePageWords(i);
              }
              setWordsRead(totalWords);
              setJustUpdated(true);
              setTimeout(() => {
                setJustUpdated(false);
              }, 1000);
            }, 500);

            // Show signup after third educational message
            if (!showSignupExpanded && useInlineSignup) {
              setTimeout(() => {
                setShowSignupExpanded(true);
                if (onSignupVisibilityChange) {
                  onSignupVisibilityChange(true);
                }
              }, 1500); // Show signup 1.5 seconds after message disappears
            } else if (!useInlineSignup) {
              // For newsletter modal mode
              setTimeout(() => {
                setIsModalOpened(true);
              }, 1500);
            }
          }, 500); // 0.5 seconds for fade-out
        }, 4500); // 4.5 seconds to read
      } else {
        // After 3 clicks, alphabet is already complete
        // Ensure word counts are visible
        if (!showWordCounts) {
          setShowWordCounts(true);
        }
        // Always update word count for every page navigation
        // Use a small delay to ensure page content is updated
        setTimeout(() => {
          console.log('[handleNextPage] Calculating total words after navigation...');
          let totalWords = 0;
          for (let i = 1; i <= newPageNumber; i++) {
            const pageWords = calculatePageWords(i);
            console.log(`[handleNextPage] Page ${i} has ${pageWords} words`);
            totalWords += pageWords;
          }
          console.log(`[handleNextPage] Total words calculated: ${totalWords}, current wordsRead: ${wordsRead}`);
          // Always update the word count
          setWordsRead(totalWords);
          setJustUpdated(true);
          setTimeout(() => {
            setJustUpdated(false);
          }, 1000);
        }, 100); // Reduced delay for faster response
      }
    }
  }, [setHasClicked, currentPage, totalPages, handleInteraction, clickCount, calculatePageWords, wordsRead, showSignupExpanded, useInlineSignup, onSignupVisibilityChange, setIsModalOpened, isInitialAnimationComplete, activeLetters, showEducationalMessage, isHidingEducationalMessage, showSecondEducationalMessage, isHidingSecondEducationalMessage, showThirdEducationalMessage, isHidingThirdEducationalMessage, getRandomLetters, hidePopup, showWordCounts]);

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
  }, [pageInput, totalPages, currentPage, hidePopup]);


  
  // Ensure scroll is unlocked on mount and cleanup
  useEffect(() => {
    // Unlock any lingering scroll locks on mount
    unlockScroll();

    return () => {
      // Cleanup on unmount
      unlockScroll();
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

      // Close level dropdown if clicking outside
      if (!target.closest('.language-selector-container') && showLevelDropdown) {
        setShowLevelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [popup.visible, hidePopup, isLanguageDropdownOpen, showLevelDropdown]);

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
  const smoothScrollTo = useCallback((targetY: number, duration: number = 300) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();


    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutQuad(progress);

      window.scrollTo(0, startY + distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Auto-scroll to reader when it becomes visible
  useEffect(() => {
    // Only auto-scroll if not in fullscreen mode and haven't scrolled yet
    if (!hasAutoScrolled && !autoScrollPerformed && signupMode !== 'fullscreen' && readerWrapperRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Trigger when 10% is visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            // Lock scroll immediately before auto-scroll starts
            // Only lock if initial animation hasn't been completed yet
            if (!isInitialAnimationComplete) {
              lockScroll();
            }

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
            setAutoScrollPerformed(true);
            // Don't unlock scroll here - wait for word count animation to complete
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
  }, [hasAutoScrolled, autoScrollPerformed, signupMode, isInitialAnimationComplete, smoothScrollTo]);

  // Auto-focus email input when level is selected
  useEffect(() => {
    if (selectedLevel && hasSelectedTarget && !isEditingTarget && !hasRegistered && isFullRegister) {
      // Focus the email input after a short delay to ensure it's rendered
      setTimeout(() => {
        if (emailInputRef.current) {
          emailInputRef.current.focus();
          // Add a visual indicator that the input is ready
          emailInputRef.current.style.animation = 'focusFlash 0.5s ease-out';
          setTimeout(() => {
            if (emailInputRef.current) {
              emailInputRef.current.style.animation = '';
            }
          }, 500);
        }
      }, 300);
    }
  }, [selectedLevel, hasSelectedTarget, isEditingTarget, hasRegistered, isFullRegister]);


  const setBookContentRef = useCallback((el: HTMLDivElement | null) => {
    if (pageRef.current !== el) {
      (pageRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
    if (bookContentRef.current !== el) {
      (bookContentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  }, []);

  // Measure and fix the height once content is mounted
  useEffect(() => {
    if (bookContentRef.current && !fixedHeight) {
      // Wait a bit for content to fully render
      setTimeout(() => {
        if (bookContentRef.current) {
          const height = bookContentRef.current.offsetHeight;
          // Add 20px safety margin
          setFixedHeight(height + 20);
        }
      }, 100);
    }
  }, [fixedHeight]);

  const currentContent = bookContent[currentPage] || bookContent[8];

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
            disabled={currentPage >= 11} // Disable after page 11
            aria-label="Next page"
            $shouldAnimate={shouldAnimateButton && currentPage < 11}
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
            {!showLevelDropdown ? (
              <>
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
              </>
            ) : (
              <>
                <LanguageDropdown
                  onClick={() => setShowLevelDropdown(false)}
                  $isOpen={true}
                >
                  <SelectedLanguage>
                    <LanguageFlag>{tempSelectedLanguage?.flag}</LanguageFlag>
                    <LanguageName>Select {tempSelectedLanguage?.name} Level</LanguageName>
                    <ChevronIcon $isOpen={true}>▼</ChevronIcon>
                  </SelectedLanguage>
                </LanguageDropdown>

                <LanguageList>
                  <LanguageOption
                    onClick={() => handleLevelSelectInDropdown('A1')}
                    $isSelected={false}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🌱</span>
                    <LanguageName>A1 - Beginner</LanguageName>
                  </LanguageOption>
                  <LanguageOption
                    onClick={() => handleLevelSelectInDropdown('A2')}
                    $isSelected={false}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🌿</span>
                    <LanguageName>A2 - Elementary</LanguageName>
                  </LanguageOption>
                  <LanguageOption
                    onClick={() => handleLevelSelectInDropdown('B1')}
                    $isSelected={false}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🍀</span>
                    <LanguageName>B1 - Intermediate</LanguageName>
                  </LanguageOption>
                  <LanguageOption
                    onClick={() => handleLevelSelectInDropdown('B2')}
                    $isSelected={false}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🌳</span>
                    <LanguageName>B2 - Upper Int.</LanguageName>
                  </LanguageOption>
                  <LanguageOption
                    onClick={() => handleLevelSelectInDropdown('C1')}
                    $isSelected={false}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🌲</span>
                    <LanguageName>C1 - Advanced</LanguageName>
                  </LanguageOption>
                  <LanguageOption
                    onClick={() => handleLevelSelectInDropdown('C2')}
                    $isSelected={false}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🎯</span>
                    <LanguageName>C2 - Mastery</LanguageName>
                  </LanguageOption>
                </LanguageList>
              </>
            )}
          </LanguageSelectorContainer>

          {/* Book Content */}
          <BookContent
            ref={setBookContentRef}
            style={fixedHeight ? { height: `${fixedHeight}px`, minHeight: `${fixedHeight}px`, maxHeight: `${fixedHeight}px` } : {}}
          >
            {showEducationalMessage ? (
              <ContentArea>
                <EducationalContent $isHiding={isHidingEducationalMessage} style={{ '--duration': '5s' } as any}>
                  <MessageText style={{ fontSize: '2rem' }}>
                    Did you know? You need <strong>10-30 exposures</strong> to a word to learn it.
                  </MessageText>
                  <MessageText style={{ fontSize: '2rem' }}>
                    An average novel has 100.000 words.
                  </MessageText>
                  <AutoAdvanceNote>
                    Continuing in a moment...
                  </AutoAdvanceNote>
                </EducationalContent>
              </ContentArea>
            ) : showSecondEducationalMessage ? (
              <ContentArea>
                <EducationalContent $isHiding={isHidingSecondEducationalMessage} style={{ '--duration': '5s' } as any}>
                  <MessageText style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
                    With this method, with an average novel (100.000 words) you will be exposed to:
                  </MessageText>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    maxWidth: '300px',
                    margin: '0 auto',
                    fontSize: '1.4rem'
                  }}>
                    <div style={{
                      background: '#fee2e2',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: '#dc2626',
                      textAlign: 'center'
                    }}><strong>A1</strong> → 15,000 words</div>
                    <div style={{
                      background: '#ffedd5',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: '#ea580c',
                      textAlign: 'center'
                    }}><strong>A2</strong> → 30,000 words</div>
                    <div style={{
                      background: '#fef3c7',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: '#d97706',
                      textAlign: 'center'
                    }}><strong>B1</strong> → 50,000 words</div>
                    <div style={{
                      background: '#d1fae5',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      color: '#059669',
                      textAlign: 'center'
                    }}><strong>B2</strong> → 80,000 words</div>
                  </div>
                  <AutoAdvanceNote>
                    Continuing your journey...
                  </AutoAdvanceNote>
                </EducationalContent>
              </ContentArea>
            ) : showThirdEducationalMessage ? (
              <ContentArea>
                <EducationalContent $isHiding={isHidingThirdEducationalMessage} style={{ '--duration': '5s' } as any}>
                  <MessageText style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>
                    📚 Read anywhere, anytime
                  </MessageText>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    maxWidth: '350px',
                    margin: '0 auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '1.5rem',
                      color: '#374151'
                    }}>
                      <span style={{ fontSize: '2rem' }}>📱</span>
                      <span>Read on Kindle or smartphone</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '1.5rem',
                      color: '#374151'
                    }}>
                      <span style={{ fontSize: '2rem' }}>📤</span>
                      <span>Upload your own ebooks</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '1.5rem',
                      color: '#374151'
                    }}>
                      <span style={{ fontSize: '2rem' }}>📖</span>
                      <span>Access our book library</span>
                    </div>
                  </div>
                  <AutoAdvanceNote>
                    Let&apos;s continue reading...
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
                              key={`badge-${key}-${showWordCounts}`} // Add showWordCounts to key to force re-render
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

        {/* Alphabet Progress */}
        {showAlphabetProgress && (
          <AlphabetProgressContainer>
            <ProgressHint>
              {alphabetStage === 0 && "Your alphabet journey begins!"}
              {alphabetStage === 1 && "Keep going! More letters await..."}
              {alphabetStage === 2 && "Almost there! Just one more page..."}
              {alphabetStage === 3 && "Amazing! You&apos;ve collected the entire alphabet!"}
            </ProgressHint>
            {showCompletionMessage && (
              <ProgressMessage>
                🎉 Alphabet Complete! You&apos;ve unlocked all {currentLanguage.name} letters!
              </ProgressMessage>
            )}
            {alphabetArray.map((letter, index) => {
              const isActive = activeLetters.includes(letter);
              const activeIndex = activeLetters.indexOf(letter);
              // Stagger animations based on when the letter was added
              const animationDelay = isActive ? activeIndex * 0.05 : 0;

              return (
                <AlphabetLetter
                  key={letter}
                  $isActive={isActive}
                  $animationDelay={animationDelay}
                >
                  {letter}
                </AlphabetLetter>
              );
            })}
          </AlphabetProgressContainer>
        )}

        {/* Bottom Navigation Bar */}
        <BottomBar $inModal={signupMode === 'fullscreen'} $isLoading={isCalculatingWords}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative'
          }}>
            {/* Page Navigation - Left Side */}
            <PageNavigation style={{ position: 'static', margin: 0 }}>
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

            {/* Start Learning Button - Right Side */}
            {!showSignupExpanded && (
              <button
                onClick={() => {
                  setShowSignupExpanded(true);
                  if (onSignupVisibilityChange) {
                    onSignupVisibilityChange(true);
                  }
                }}
                style={{
                  padding: '8px 24px',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(255, 152, 0, 0.3)',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f57c00';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 152, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff9800';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(255, 152, 0, 0.3)';
                }}
              >
                Start Learning
              </button>
            )}
          </div>
        </BottomBar>
      </ReaderWrapper>

      {/* Inline Signup Section */}
      <SignupModal showSignup={false} />
    </WidgetWrapper>
  );
}
