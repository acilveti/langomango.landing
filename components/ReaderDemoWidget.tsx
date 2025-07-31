import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { DEFAULT_LANGUAGES, Language, useVisitor } from 'contexts/VisitorContext';
import { getFallbackTranslation, readerTranslations } from 'data/readerTranslations';
import { apiService, CreateCheckoutSessionRequest, createEnhancedCheckoutSession } from 'services/apiService';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';
import { config } from '../config/environment';

import {
  AlphabetLetter,
  AlphabetProgressContainer,
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
  ProgressHint,
  ProgressMessage,
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
    selectedLanguageLevel: contextLanguageLevel,
    setSelectedLanguage: setContextLanguage, 
    nativeLanguage,
    hasSelectedLanguage,
    setHasSelectedLanguage,
    hasSelectedLevel,
    setHasSelectedLevel 
  } = useVisitor();
  const [currentPage, setCurrentPage] = useState(8);
  const [totalPages] = useState(511);
  const [pageInput, setPageInput] = useState('8');
  const [showSignupExpanded, setShowSignupExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [wordsRead, setWordsRead] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showWordCounts, setShowWordCounts] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [demoLevel, setDemoLevel] = useState<string>('A1'); // Default demo level is A1
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
  const [autoScrollPerformed, setAutoScrollPerformed] = useState(false);
  const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
  const [hasStartedInitialAnimation, setHasStartedInitialAnimation] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [hasRegistered, setHasRegistered] = useState(openSignupDirectly || false);
  const [hasValidEmail, setHasValidEmail] = useState(false);
  const [showValidEmailIndicator, setShowValidEmailIndicator] = useState(false);
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
  const [pendingUserData, setPendingUserData] = useState<{
    email?: string;
    nativeLanguage: string;
    targetLanguage: string;
    level: string;
  } | null>(null);
  
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
          setHasSelectedLanguage(true);
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
          
          // Mark as registered and redirect to checkout
          setHasRegistered(true);
          
          // Redirect to checkout page
          window.location.href = '/checkout';
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
          setHasSelectedLanguage(true);
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
  }, [openSignupDirectly, useInlineSignup, onSignupVisibilityChange, contextLanguage, contextLanguageLevel, hasSelectedLanguage, setHasSelectedLanguage]);
  
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
    console.log('Registration email state updated:', registrationEmail);
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
    
    // Try to get translation from the main translations object
    if (langTranslations && langTranslations[englishText]) {
      return langTranslations[englishText];
    }
    
    // If not found, use the fallback function which will return the original text
    return getFallbackTranslation(englishText);
  };

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
      setHasSelectedLanguage(true);
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

  // Determine if we should show words only or sentences based on level
  const showWordsOnly = !demoLevel || demoLevel === 'A1' || demoLevel === 'A2';
  
  // Function to get random letters that haven't been added yet
  const getRandomLetters = (count: number, existing: string[]): string[] => {
    const availableLetters = alphabetArray.filter(letter => !existing.includes(letter));
    const selected: string[] = [];
    
    for (let i = 0; i < count && availableLetters.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      selected.push(availableLetters[randomIndex]);
      availableLetters.splice(randomIndex, 1);
    }
    
    return selected;
  };

  // Book content for WORDS ONLY (A1, A2, or unset)
  const bookContentWords: BookContent = {
    8: {
      paragraphs: [
        {
          segments: [
            {
              text: 'He opened his',
            },
            {
              text: ' eyes',
              translationKey: 'eyes',
              showTranslation: true
            },
            {
              text: ' and found himself facing the boatswain who, a few inches away and with water running down his face.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'The',
            },
            {
              text: ' storm',
              translationKey: 'storm',
              showTranslation: true
            },
            {
              text: ' had grown worse during the night, and the waves crashed over the deck with tremendous force.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Joan struggled to his',
            },
            {
              text: ' feet',
              translationKey: 'feet',
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
              text: 'The',
            },
            {
              text: ' deck',
              translationKey: 'deck',
              showTranslation: true
            },
            {
              text: ' was chaos. Men ran in all directions, some trying to secure loose cargo while others fought to control the sails.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Through the spray and',
            },
            {
              text: ' darkness',
              translationKey: 'darkness',
              showTranslation: true
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
              text: 'The',
            },
            {
              text: ' ship',
              translationKey: 'ship',
              showTranslation: true
            },
            {
              text: ' groaned under the assault of wind and waves.'
            }
          ],
          indent: true
        }
      ]
    },
    10: {
      paragraphs: [
        {
          segments: [
            {
              text: 'Lightning',
              translationKey: 'lightning',
              showTranslation: true
            },
            {
              text: ' split the sky, illuminating the mountainous waves that surrounded them.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'The',
            },
            {
              text: ' captain',
              translationKey: 'captain',
              showTranslation: true
            },
            {
              text: ' appeared on deck, his weathered face grim but determined.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: '"All hands on',
            },
            {
              text: ' deck',
              translationKey: 'deck', 
              showTranslation: true
            },
            {
              text: '!" he roared, and even the most exhausted sailors found new strength.'
            }
          ],
          indent: true
        }
      ]
    },
    11: {
      paragraphs: [
        {
          segments: [
            {
              text: 'Joan grabbed a',
            },
            {
              text: ' rope',
              translationKey: 'rope',
              showTranslation: true
            },
            {
              text: ' and joined the others in securing the cargo.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'A massive',
            },
            {
              text: ' wave',
              translationKey: 'wave',
              showTranslation: true
            },
            {
              text: ' crashed over the bow, sending torrents of seawater across the deck.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Time',
              translationKey: 'time',
              showTranslation: true
            },
            {
              text: ' seemed to slow as Joan watched a young sailor lose his grip and begin sliding toward the rails.'
            }
          ],
          indent: true
        }
      ]
    }
  };

  // Book content for SENTENCES (B1, B2, C1, C2)
  const bookContentSentences: BookContent = {
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
              text: 'The',
            },
            {
              text: ' storm',
              translationKey: 'storm',
              showTranslation: true
            },
            {
              text: ' had grown worse during the night, and the waves crashed over the deck with tremendous force.'
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
              text: 'Through the spray and',
            },
            {
              text: ' darkness',
              translationKey: 'darkness',
              showTranslation: true
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
              text: 'The',
            },
            {
              text: ' ship',
              translationKey: 'ship',
              showTranslation: true
            },
            {
              text: ' groaned under the assault of wind and waves, its timbers creaking ominously.'
            }
          ],
          indent: true
        }
      ]
    },
    10: {
      paragraphs: [
        {
          segments: [
            {
              text: 'Lightning split the sky',
              translationKey: 'Lightning split the sky',
              showTranslation: true
            },
            {
              text: ', illuminating the mountainous waves that surrounded them.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'The',
            },
            {
              text: ' captain',
              translationKey: 'captain',
              showTranslation: true
            },
            {
              text: ' appeared on deck, his weathered face grim but determined.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: '"All hands on deck!"',
              translationKey: '"All hands on deck!"',
              showTranslation: true
            },
            {
              text: ' he roared, and even the most exhausted sailors found new strength.'
            }
          ],
          indent: true
        }
      ]
    },
    11: {
      paragraphs: [
        {
          segments: [
            {
              text: 'Joan grabbed a rope',
              translationKey: 'Joan grabbed a rope',
              showTranslation: true
            },
            {
              text: ' and joined the others in securing the cargo.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'A massive',
            },
            {
              text: ' wave',
              translationKey: 'wave',
              showTranslation: true
            },
            {
              text: ' crashed over the bow, sending torrents of seawater across the deck.'
            }
          ],
          indent: true
        },
        {
          segments: [
            {
              text: 'Time seemed to slow',
              translationKey: 'Time seemed to slow',
              showTranslation: true
            },
            {
              text: ' as Joan watched a young sailor lose his grip and begin sliding toward the rails.'
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
      setCurrentPage(currentPage + 1);
      setPageInput((currentPage + 1).toString());
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
                // Calculate total words from all pages up to current
                let totalWords = 0;
                for (let i = 1; i <= currentPage + 1; i++) {
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
                }, 1000);
              }, 1000);
            }, 100); // Small delay after loading completes
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
            for (let i = 1; i <= currentPage + 1; i++) {
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
            for (let i = 1; i <= currentPage + 1; i++) {
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
        // Just update word count
        setTimeout(() => {
          let totalWords = 0;
          for (let i = 1; i <= currentPage + 1; i++) {
            totalWords += calculatePageWords(i);
          }
          if (totalWords > wordsRead) {
            setWordsRead(totalWords);
            setJustUpdated(true);
            setTimeout(() => {
              setJustUpdated(false);
            }, 1000);
          }
        }, 300);
      }
    }
  }, [currentPage, totalPages, handleInteraction, clickCount, hasClicked, calculatePageWords, wordsRead, showSignupExpanded, useInlineSignup, onSignupVisibilityChange, setIsModalOpened, isInitialAnimationComplete, activeLetters, showEducationalMessage, isHidingEducationalMessage, showSecondEducationalMessage, isHidingSecondEducationalMessage, showThirdEducationalMessage, isHidingThirdEducationalMessage]);

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
    window.location.href = `${config.appUrl}/sign-up?email=${encodeURIComponent(email)}`;
  }, [email]);

  const handleGoogleSignup = useCallback(() => {
    // For the secondary signup flow
    const baseUrl = config.apiUrl;
    const returnUrl = encodeURIComponent('/sign-up');
    const frontendRedirectUrl = encodeURIComponent(config.appUrl);
    const googleAuthUrl = `${baseUrl}/auth/login-google?returnUrl=${returnUrl}&frontendRedirectUrl=${frontendRedirectUrl}`;
    
    console.log('Redirecting to Google OAuth (secondary flow):', googleAuthUrl);
    window.location.href = googleAuthUrl;
  }, []);

  // Handle demo signup with level selection
  const handleLevelSelect = useCallback(async (level: string) => {
    if (!hasSelectedTarget || isEditingTarget) return;
    
    // For full register mode, ensure user has registered first
    if (isFullRegister && !hasRegistered && !hasValidEmail) {
      return;
    }
    
    setSelectedLevel(level);
    setDemoLevel(level); // Update demo level for content display
    setHasSelectedLevel(true); // Mark level as selected by user
    sessionStorage.setItem('selectedLevel', level);
    setSignupError('');
    setIsLoadingSignup(true);
    setShowBookAnimation(true);
    
    try {
      // Full registration flow - user has email or Google auth
      if (isFullRegister && (hasRegistered || hasValidEmail)) {
        // Track Reddit pixel signup event for full registration
        trackRedditConversion(RedditEventTypes.SIGNUP, {
          signup_type: 'full',
          native_language: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
          target_language: tempTargetLanguage.code,
          level: level,
          source: 'reader_widget'
        });
        
        if (hasValidEmail && registrationEmail) {
          // Email registration flow
          const response = await apiService.signupWithEmail({
            email: registrationEmail,
            nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
            targetLanguage: tempTargetLanguage.code,
            level: level
          });
          
          if (response.success && response.token) {
            // Store token
            localStorage.setItem('token', response.token);
            
            // Redirect to app
            setTimeout(() => {
              window.location.href = response.redirectUrl || `${config.appUrl}/reader`;
            }, 1500);
          } else {
            throw new Error('Failed to create account');
          }
        } else if (hasRegistered) {
          // Google OAuth flow - update existing user profile
          const token = localStorage.getItem('token');
          
          if (token) {
            const response = await apiService.updateUserProfile({
              nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
              targetLanguage: tempTargetLanguage.code,
              level: level
            }, token);
            
            if (response.success) {
              setTimeout(() => {
                window.location.href = response.redirectUrl || `${config.appUrl}/reader`;
              }, 1500);
            } else {
              throw new Error('Failed to update profile');
            }
          } else {
            throw new Error('No authentication token found');
          }
        }
      } else {
        // Demo flow (when isFullRegister is false)
        // Track Reddit pixel signup event for demo
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
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
      setShowBookAnimation(false);
      setIsLoadingSignup(false);
      setSelectedLevel('');
    }
  }, [hasSelectedTarget, isEditingTarget, isFullRegister, hasRegistered, hasValidEmail, tempNativeLanguage, nativeLanguage, tempTargetLanguage, registrationEmail, setHasSelectedLevel]);

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
  }, [hasAutoScrolled, autoScrollPerformed, signupMode]);

  // Check if reader container is visible and start word counter
  useEffect(() => {
    console.log('[useEffect] Visibility effect mounted or language changed');
    
    // Reset the timer tracking when language changes
    hasStartedTimerRef.current = false;
    
    // Clear any existing timer when language changes
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current);
      visibilityTimerRef.current = null;
    }
    
    const checkVisibility = () => {
      console.log('[checkVisibility] Called, hasStartedTimer:', hasStartedTimerRef.current);
      
      if (readerContainerRef.current && !hasStartedTimerRef.current && !hasStartedInitialAnimation) {
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
          if (!visibilityTimerRef.current && !hasStartedInitialAnimation) {
            console.log('[checkVisibility] Setting 2-second visibility timer');
            // Only lock scroll if initial animation hasn't been completed
            if (!isInitialAnimationComplete) {
                  lockScroll();
                }
                setIsCalculatingWords(true); // Start loading animation
            setShouldAnimateButton(false); // Stop button animation during loading
            visibilityTimerRef.current = setTimeout(() => {
              console.log('[visibilityTimer] 2 seconds elapsed, updating word counts');
              hasStartedTimerRef.current = true;
              setHasStartedInitialAnimation(true); // Mark that initial animation has started
              // Stop loading animation just before showing word counts
              setIsCalculatingWords(false);
              setShouldAnimateButton(true); // Start button animation after loading
              // Show word counts after a brief delay
              setTimeout(() => {
                setShowWordCounts(true);
                console.log('[visibilityTimer] Word count badges shown');
                
                // Show alphabet progress with initial letters (25% of alphabet = 6-7 letters)
                setShowAlphabetProgress(true);
                const initialLetters = getRandomLetters(7, []);
                setActiveLetters(initialLetters);
                setAlphabetStage(0);
                
                // Then update global counter 1 second later
                wordsTimerRef.current = setTimeout(() => {
                  const page8Words = calculatePageWordsRef.current?.(8) || 0;
                  console.log('[wordsTimer] Calculated page 8 words:', page8Words);
                  setWordsRead(page8Words);
                  setJustUpdated(true);
                  setTimeout(() => {
                    setJustUpdated(false);
                    // Mark initial animation as complete and unlock scroll
                    setIsInitialAnimationComplete(true);
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
            // Don't unlock scroll here - only unlock after initial animation completes
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
  }, [currentLanguage.code, autoScrollPerformed, isInitialAnimationComplete]); // Only depend on language code to avoid object reference issues

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
  
  // Handle pricing plan selection
  const handlePricingPlanSelect = useCallback(async (planId: string) => {
    console.log('Selected pricing plan:', planId);
    
    setIsPricingLoading(true);
    
    try {
      // User is already authenticated at this point
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('No authentication token found. Please sign in again.');
      }
      
      // Map plan IDs to Stripe price lookup keys
      const priceLookupKey = {
        '1month': 'price_monthly',
        'yearly': 'price_yearly', 
        '3year': 'price_3year'
      }[planId] || 'price_monthly';
      
      // Create Stripe checkout session with the auth token
      const checkoutRequest: CreateCheckoutSessionRequest = {
        priceLookupKey: priceLookupKey,
        planType: planId === '1month' ? 'monthly' : planId === 'yearly' ? 'yearly' : '3year',
        includeTrial: true, // New users always get trial
        returnUrl: `${config.appUrl}/payment-room`
      };
      
      const checkoutData = await createEnhancedCheckoutSession(checkoutRequest, authToken);
      
      if (!checkoutData || !checkoutData.url) {
        throw new Error('Failed to create checkout session');
      }
      
      // Store session ID for tracking
      if (checkoutData.sessionId) {
        localStorage.setItem('stripe-session-id', checkoutData.sessionId);
      }
      
      // Track conversion event
      trackRedditConversion(RedditEventTypes.PURCHASE, {
        plan: planId,
        source: 'reader_widget_pricing'
      });
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
      setIsPricingLoading(false);
    }
  }, []);

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

  // Choose content based on level
  const bookContent = showWordsOnly ? bookContentWords : bookContentSentences;
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
                              setContextLanguage(language); // Don't pass level here, keep existing level
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
                
                {/* Level selector - comes AFTER language selection and BEFORE registration */}
                <LevelSelectorContainer $isDisabled={!hasSelectedTarget || isEditingTarget}>
                  <LevelLabel>Select your {tempTargetLanguage.name} level:</LevelLabel>
                  {/* If user has selected a level, show only that level */}
                  {hasSelectedLevel && selectedLevel ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '1.5rem'
                    }}>
                      <LevelButton 
                        $isActive={true}
                        onClick={() => {
                          if (isFullRegister) {
                            // Don't do anything yet, just visual selection
                            setSelectedLevel(selectedLevel);
                          } else {
                            handleLevelSelect(selectedLevel);
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        style={{ width: '120px' }}
                      >
                        <LevelEmoji>
                          {selectedLevel === 'A1' && '🌱'}
                          {selectedLevel === 'A2' && '🌿'}
                          {selectedLevel === 'B1' && '🍀'}
                          {selectedLevel === 'B2' && '🌳'}
                          {selectedLevel === 'C1' && '🌲'}
                          {selectedLevel === 'C2' && '🎯'}
                        </LevelEmoji>
                        <LevelName>{selectedLevel}</LevelName>
                        <LevelDesc>
                          {selectedLevel === 'A1' && 'Beginner'}
                          {selectedLevel === 'A2' && 'Elementary'}
                          {selectedLevel === 'B1' && 'Intermediate'}
                          {selectedLevel === 'B2' && 'Upper Int.'}
                          {selectedLevel === 'C1' && 'Advanced'}
                          {selectedLevel === 'C2' && 'Mastery'}
                        </LevelDesc>
                      </LevelButton>
                    </div>
                  ) : (
                    /* Show full grid if no level is selected */
                    <LevelButtons>
                      <LevelButton 
                        $isActive={selectedLevel === 'A1'}
                        onClick={() => {
                          if (isFullRegister) {
                            setSelectedLevel('A1');
                            setHasSelectedLevel(true);
                          } else {
                            handleLevelSelect('A1');
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        $needsSelection={hasSelectedTarget && !selectedLevel}
                      >
                        <LevelEmoji>🌱</LevelEmoji>
                        <LevelName>A1</LevelName>
                        <LevelDesc>Beginner</LevelDesc>
                      </LevelButton>
                      <LevelButton 
                        $isActive={selectedLevel === 'A2'}
                        onClick={() => {
                          if (isFullRegister) {
                            setSelectedLevel('A2');
                            setHasSelectedLevel(true);
                          } else {
                            handleLevelSelect('A2');
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        $needsSelection={hasSelectedTarget && !selectedLevel}
                      >
                        <LevelEmoji>🌿</LevelEmoji>
                        <LevelName>A2</LevelName>
                        <LevelDesc>Elementary</LevelDesc>
                      </LevelButton>
                      <LevelButton 
                        $isActive={selectedLevel === 'B1'}
                        onClick={() => {
                          if (isFullRegister) {
                            setSelectedLevel('B1');
                            setHasSelectedLevel(true);
                          } else {
                            handleLevelSelect('B1');
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        $needsSelection={hasSelectedTarget && !selectedLevel}
                      >
                        <LevelEmoji>🍀</LevelEmoji>
                        <LevelName>B1</LevelName>
                        <LevelDesc>Intermediate</LevelDesc>
                      </LevelButton>
                      <LevelButton 
                        $isActive={selectedLevel === 'B2'}
                        onClick={() => {
                          if (isFullRegister) {
                            setSelectedLevel('B2');
                            setHasSelectedLevel(true);
                          } else {
                            handleLevelSelect('B2');
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        $needsSelection={hasSelectedTarget && !selectedLevel}
                      >
                        <LevelEmoji>🌳</LevelEmoji>
                        <LevelName>B2</LevelName>
                        <LevelDesc>Upper Int.</LevelDesc>
                      </LevelButton>
                      <LevelButton 
                        $isActive={selectedLevel === 'C1'}
                        onClick={() => {
                          if (isFullRegister) {
                            setSelectedLevel('C1');
                            setHasSelectedLevel(true);
                          } else {
                            handleLevelSelect('C1');
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        $needsSelection={hasSelectedTarget && !selectedLevel}
                      >
                        <LevelEmoji>🌲</LevelEmoji>
                        <LevelName>C1</LevelName>
                        <LevelDesc>Advanced</LevelDesc>
                      </LevelButton>
                      <LevelButton 
                        $isActive={selectedLevel === 'C2'}
                        onClick={() => {
                          if (isFullRegister) {
                            setSelectedLevel('C2');
                            setHasSelectedLevel(true);
                          } else {
                            handleLevelSelect('C2');
                          }
                        }}
                        $isDisabled={!hasSelectedTarget || isEditingTarget || isLoadingSignup}
                        $needsSelection={hasSelectedTarget && !selectedLevel}
                      >
                        <LevelEmoji>🎯</LevelEmoji>
                        <LevelName>C2</LevelName>
                        <LevelDesc>Mastery</LevelDesc>
                      </LevelButton>
                    </LevelButtons>
                  )}
                </LevelSelectorContainer>
                
                {/* Registration section - shown AFTER level selection */}
                {isFullRegister && hasSelectedTarget && !isEditingTarget && !hasRegistered && (
                  <>

                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      width: '100%',
                      maxWidth: '400px',
                      margin: '0 auto',
                      padding: '1rem',
                      animation: (hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                      borderRadius: '12px',
                      position: 'relative',
                      background: (hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? 'rgba(255, 152, 0, 0.05)' : 'transparent',
                      border: (hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? '2px dashed rgba(255, 152, 0, 0.3)' : '2px dashed transparent',
                      transition: 'all 0.3s ease'
                    }}>
                      <style>
                        {`
                          @keyframes pulseGlow {
                            0% {
                              box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
                            }
                            50% {
                              box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
                            }
                            100% {
                              box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
                            }
                          }
                          
                          @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                            20%, 40%, 60%, 80% { transform: translateX(2px); }
                          }
                          
                          @keyframes focusFlash {
                            0% {
                              box-shadow: 0 0 0 3px rgba(255, 152, 0, 0);
                            }
                            50% {
                              box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.4);
                            }
                            100% {
                              box-shadow: 0 0 0 3px rgba(255, 152, 0, 0);
                            }
                          }
                          
                          .email-input-wrapper {
                            display: flex;
                            gap: 8px;
                            align-items: center;
                            width: 100%;
                            animation: ${(hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? 'shake 0.5s ease-in-out' : 'none'};
                            animation-delay: 0.5s;
                          }
                          
                          .email-input {
                            flex: 1;
                            padding: 12px 16px;
                            font-size: 14px;
                            border: 2px solid ${showValidEmailIndicator ? '#22c55e' : (hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? '#ff9800' : '#e5e7eb'};
                            border-radius: 8px;
                            outline: none;
                            background-color: white !important;
                            color: #1f2937 !important;
                            -webkit-text-fill-color: #1f2937 !important;
                            opacity: 1 !important;
                            transition: all 0.3s ease;
                            animation: ${(hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? 'borderPulse 2s ease-in-out infinite' : 'none'};
                          }
                          
                          @keyframes borderPulse {
                            0%, 100% {
                              border-color: #ff9800;
                            }
                            50% {
                              border-color: #ffc107;
                            }
                          }
                          
                          .email-input:focus {
                            border-color: #ff9800;
                            box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
                            background-color: white !important;
                            color: #1f2937 !important;
                            -webkit-text-fill-color: #1f2937 !important;
                          }
                          
                          .email-input::placeholder {
                            color: #9ca3af;
                            opacity: 1;
                          }
                          
                          .email-input:-webkit-autofill,
                          .email-input:-webkit-autofill:hover,
                          .email-input:-webkit-autofill:focus {
                            -webkit-text-fill-color: #1f2937 !important;
                            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
                            background-color: white !important;
                          }
                          
                          .google-button {
                            animation: ${(hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? 'subtle-pulse 2s ease-in-out infinite' : 'none'};
                            animation-delay: 0.5s;
                          }
                          
                          @keyframes subtle-pulse {
                            0%, 100% {
                              transform: scale(1);
                            }
                            50% {
                              transform: scale(1.02);
                            }
                          }
                        `}
                      </style>
                    
                    <div className="email-input-wrapper">
                      <input
                        ref={emailInputRef}
                        className="email-input"
                        type="email"
                        placeholder="Email"
                        value={registrationEmail}
                        onChange={(e) => {
                          console.log('Email typed:', e.target.value);
                          setRegistrationEmail(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && registrationEmail && validateEmail(registrationEmail) && selectedLevel) {
                            document.querySelector<HTMLButtonElement>('.submit-button')?.click();
                          }
                        }}
                        style={{
                          color: '#1f2937',
                          backgroundColor: 'white',
                          WebkitTextFillColor: '#1f2937',
                          WebkitAppearance: 'none'
                        }}
                        autoComplete="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      <button
                        className="submit-button"
                        onClick={async () => {
                          console.log('Button clicked with email:', registrationEmail);
                          if (registrationEmail && validateEmail(registrationEmail) && selectedLevel) {
                            setIsLoadingSignup(true);
                            setSignupError('');
                            try {
                              // Create account immediately with email
                              const response = await apiService.signupWithEmail({
                                email: registrationEmail,
                                nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
                                targetLanguage: tempTargetLanguage.code,
                                level: selectedLevel
                              });
                              
                              if (response.success && response.token) {
                                // Store token - user is now authenticated
                                localStorage.setItem('token', response.token);
                                localStorage.setItem('userEmail', registrationEmail);
                                
                                // Mark as registered
                                setHasRegistered(true);
                                
                                // Track signup event
                                trackRedditConversion(RedditEventTypes.SIGNUP, {
                                  signup_type: 'email',
                                  native_language: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
                                  target_language: tempTargetLanguage.code,
                                  level: selectedLevel,
                                  source: 'reader_widget'
                                });
                                
                                // Redirect to checkout page - user is already authenticated
                                window.location.href = '/checkout';
                              } else {
                                throw new Error('Failed to create account');
                              }
                            } catch (error) {
                              console.error('Signup error:', error);
                              setSignupError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
                            } finally {
                              setIsLoadingSignup(false);
                            }
                          }
                        }}
                        disabled={!registrationEmail || !validateEmail(registrationEmail) || !selectedLevel || isLoadingSignup}
                        style={{ 
                          padding: '12px 20px',
                          backgroundColor: (!registrationEmail || !validateEmail(registrationEmail) || !selectedLevel || isLoadingSignup) ? '#ccc' : '#ff9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: (!registrationEmail || !validateEmail(registrationEmail) || !selectedLevel || isLoadingSignup) ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isLoadingSignup ? '...' : '→'}
                      </button>
                    </div>
                    
                    <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>or</div>
                    
                    <button
                      className="google-button"
                      onClick={() => {
                        if (selectedLevel) {
                          setIsLoadingSignup(true);
                          // For Google OAuth, store preferences and redirect
                          localStorage.setItem('pendingLanguagePrefs', JSON.stringify({
                            nativeLanguage: tempNativeLanguage?.code || nativeLanguage?.code || 'en',
                            targetLanguage: tempTargetLanguage.code,
                            level: selectedLevel
                          }));
                          
                          // Set flag to show pricing after OAuth return
                          localStorage.setItem('showPricingAfterAuth', 'true');
                          localStorage.setItem('returnToWidget', 'true');
                          
                          // Redirect to Google OAuth
                          const baseUrl = config.apiUrl;
                          const returnUrl = encodeURIComponent('/sign-up');
                          const frontendRedirectUrl = encodeURIComponent(window.location.origin);
                          const googleAuthUrl = `${baseUrl}/auth/login-google?returnUrl=${returnUrl}&frontendRedirectUrl=${frontendRedirectUrl}`;
                          
                          window.location.href = googleAuthUrl;
                        }
                      }}
                      disabled={!selectedLevel || isLoadingSignup}
                      style={{ 
                        width: '100%',
                        padding: '12px 20px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: `2px solid ${(hasSelectedTarget && !hasValidEmail && !hasRegistered && !!selectedLevel) ? '#ff9800' : '#e1e5e9'}`,
                        borderRadius: '8px',
                        cursor: (!selectedLevel || isLoadingSignup) ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        opacity: (!selectedLevel || isLoadingSignup) ? 0.5 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    
                    {hasValidEmail && (
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#22c55e', 
                        fontSize: '12px',
                        marginTop: '-8px',
                        animation: 'fadeIn 0.3s ease-in'
                      }}>
                        <style>
                          {`
                            @keyframes fadeIn {
                              from { opacity: 0; transform: translateY(-5px); }
                              to { opacity: 1; transform: translateY(0); }
                            }
                          `}
                        </style>
                        ✓ Valid email entered
                      </div>
                    )}
                  </div>
                  </>
                )}
                
                {isFullRegister && hasSelectedTarget && !isEditingTarget && hasRegistered && (
                  <CompactRegistrationSection $isCompleted={true}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#22c55e',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Signed in with Google</span>
                    </div>
                  </CompactRegistrationSection>
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
              Now select your level
              </PromptMessage>
              ) : (isFullRegister && !hasRegistered && !hasValidEmail && selectedLevel) ? (
              <PromptMessage>
              <PromptIcon>📧</PromptIcon>
              Please enter your email or sign in with Google
              </PromptMessage>
              ) : null}
              
              {signupError && (
                <ErrorMessage>
                  <ErrorIcon>⚠️</ErrorIcon>
                  {signupError}
                </ErrorMessage>
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
                Already have an account? <LoginLink href={`${config.appUrl}/login`}>Log in</LoginLink>
              </LoginPrompt>
              </SignupExpanded>
            </SignupExpandedWrapper>
          )}
        </SignupSection>
      )}
    </WidgetWrapper>
  );
}
