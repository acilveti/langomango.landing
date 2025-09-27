import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSignupModalContext } from 'contexts/SignupModalContext';
import { DEFAULT_LANGUAGES, DEFAULT_LEVELS, useVisitor } from 'contexts/VisitorContext';
import { apiService, } from 'services/apiService';
import { RedditEventTypes, trackRedditConversion } from 'utils/redditPixel';

import {
    CloseButton,
    CompactRegistrationSection,
    ErrorIcon,
    ErrorMessage,
    LanguageBox,
    LanguageBoxLabel,
    LanguageDisplay,
    LanguageFlag,
    LanguageName,
    LanguageNote,
    LanguagePickerContainer,
    LanguagePickerGrid,
    LanguagePickerOption,
    LanguageSetupContainer,
    LanguageSetupRow,
    LevelButton,
    LevelButtons,
    LevelDesc,
    LevelEmoji,
    LevelLabel,
    LevelName,
    LevelSelectorContainer,
    PromptIcon,
    PromptMessage,
    SignupExpanded,
    SignupExpandedWrapper,
    SignupSection,
    SignupTitle
} from './ReaderDemoWidget.styles';

interface SignupModalProps {
    showSignup: boolean;
}

// Reader Demo Modal component
export default function SignupModal({ showSignup }: SignupModalProps) {
    const {
        targetSelectedLanguage,
        nativeLanguage,
        targetSelectedLanguageLevel,
        hasTargetSelectedLanguage,
        hasTargetSelectedLevel,
        setNativeSelectedLanguage,
        setTargetSelectedLanguage,
        setHasTargetSelectedLanguage,
    } = useVisitor();

    const emailInputRef = useRef<HTMLInputElement>(null);
    const [isEditingNative, setIsEditingNative] = useState(false);
    const [isEditingTarget, setIsEditingTarget] = useState(false);
    const [hasValidEmail, setHasValidEmail] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [registrationEmail, setRegistrationEmail] = useState('');
    // const [email, ] = useState('');
    // const [, setEmailError] = useState('');
    const router = useRouter();

    //temporal, delete
    const [isLoadingSignup, setIsLoadingSignup] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);
    const { setIsModalOpened } = useSignupModalContext()
    const [showValidEmailIndicator, setShowValidEmailIndicator] = useState(false);

    // Define validateEmail function before its first use
    const validateEmail = useCallback((email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }, []);
    // const handleSignup = useCallback(() => {
    //     if (!email) {
    //         setEmailError('Email is required');
    //         return;
    //     }
    //     if (!validateEmail(email)) {
    //         setEmailError('Invalid email format');
    //         return;
    //     }

    //     setEmailError('');
    //     // Redirect with email pre-filled
    //     window.location.href = `https://beta-app.langomango.com/sign-up?email=${encodeURIComponent(email)}`;
    // }, [email, validateEmail]);

    // const handleGoogleSignup = useCallback(() => {
    //     // For the secondary signup flow
    //     const baseUrl = 'https://staging.langomango.com';
    //     const returnUrl = encodeURIComponent('/sign-up');
    //     const frontendRedirectUrl = encodeURIComponent('https://beta-app.langomango.com/');
    //     const googleAuthUrl = `${baseUrl}/auth/login-google?returnUrl=${returnUrl}&frontendRedirectUrl=${frontendRedirectUrl}`;

    //     console.log('Redirecting to Google OAuth (secondary flow):', googleAuthUrl);
    //     window.location.href = googleAuthUrl;
    // }, []);

    // Handle demo signup with level selection
    // const handleLevelSelect = useCallback(async (level: string) => {
    //     if (!hasSelectedTarget || isEditingTarget) return;

    //     // For full register mode, ensure user has registered first
    //     if (!hasRegistered && !hasValidEmail) {
    //         return;
    //     }

    //     settargetSelectedLanguageLevel(level);
    //     setHastargetSelectedLanguageLevel(true); // Mark level as selected by user
    //     sessionStorage.setItem('targetSelectedLanguageLevel', level);
    //     setSignupError('');
    //     setIsLoadingSignup(true);

    //     try {
    //         // Full registration flow - user has email or Google auth
    //         if ((hasRegistered || hasValidEmail)) {
    //             // Track Reddit pixel signup event for full registration
    //             trackRedditConversion(RedditEventTypes.SIGNUP, {
    //                 signup_type: 'full',
    //                 native_language: tempNativeSelectedLanguage?.code || nativeLanguage?.code || 'en',
    //                 target_language: tempTargetSelectedLanguage?.code,
    //                 level: level,
    //                 source: 'reader_widget'
    //             });

    //             if (hasValidEmail && registrationEmail) {
    //                 // Email registration flow
    //                 const response = await apiService.signupWithEmail({
    //                     email: registrationEmail,
    //                     nativeLanguage: tempNativeSelectedLanguage?.code || nativeLanguage?.code || 'en',
    //                     targetLanguage: tempTargetSelectedLanguage?.code!,
    //                     level: level
    //                 });

    //                 if (response.success && response.token) {
    //                     // Store token
    //                     localStorage.setItem('token', response.token);

    //                     // Redirect to app
    //                     setTimeout(() => {
    //                         window.location.href = response.redirectUrl || 'https://beta-app.langomango.com/reader';
    //                     }, 1500);
    //                 } else {
    //                     throw new Error('Failed to create account');
    //                 }
    //             } else if (hasRegistered) {
    //                 // Google OAuth flow - update existing user profile
    //                 const token = localStorage.getItem('token');

    //                 if (token) {
    //                     const response = await apiService.updateUserProfile({
    //                         nativeLanguage: tempNativeSelectedLanguage?.code || nativeLanguage?.code || 'en',
    //                         targetLanguage: tempTargetSelectedLanguage?.code!,
    //                         level: level
    //                     }, token);

    //                     if (response.success) {
    //                         setTimeout(() => {
    //                             window.location.href = response.redirectUrl || 'https://beta-app.langomango.com/reader';
    //                         }, 1500);
    //                     } else {
    //                         throw new Error('Failed to update profile');
    //                     }
    //                 } else {
    //                     throw new Error('No authentication token found');
    //                 }
    //             }
    //         } else {
    //             // Demo flow (when isFullRegister is false)
    //             // Track Reddit pixel signup event for demo
    //             trackRedditConversion(RedditEventTypes.SIGNUP, {
    //                 signup_type: 'demo',
    //                 native_language: tempNativeSelectedLanguage?.code || nativeLanguage?.code || 'en',
    //                 target_language: tempTargetSelectedLanguage?.code!,
    //                 level: level,
    //                 source: 'reader_widget'
    //             });

    //             const response = await apiService.demoSignup({
    //                 nativeLanguage: tempNativeSelectedLanguage?.code || nativeLanguage?.code || 'en',
    //                 targetLanguage: tempTargetSelectedLanguage?.code!,
    //                 level: level
    //             });

    //             if (response.success && response.redirectUrl) {
    //                 // Wait a bit for animation before redirecting
    //                 setTimeout(() => {
    //                     window.location.href = response.redirectUrl;
    //                 }, 1500);
    //             } else {
    //                 throw new Error('Invalid response from server');
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Signup error:', error);
    //         setSignupError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
    //         setIsLoadingSignup(false);
    //         settargetSelectedLanguageLevel('');
    //     }
    // }, [hasSelectedTarget, isEditingTarget, hasRegistered, hasValidEmail, tempNativeSelectedLanguage, nativeLanguage, tempTargetSelectedLanguage, registrationEmail, setHastargetSelectedLanguageLevel]);

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
    }, [registrationEmail, validateEmail]);

    if (!showSignup) return null
    return (
        <SignupSection>
            <CloseButton
                onClick={() => {
                    setIsModalOpened(false)
                }}
                aria-label="Close signup"
            >
                ×
            </CloseButton>
            <SignupExpandedWrapper>
                <SignupExpanded>
                    <SignupTitle>Let&apos;s customize your reading</SignupTitle>
                    {/* <SignupSubtitle>We&apos;ll personalize your learning experience based on your language preferences</SignupSubtitle> */}

                    <LanguageSetupContainer>
                        <LanguageSetupRow>
                            <LanguageBox
                                className="language-box"
                                onClick={() => setIsEditingNative(true)}
                                $isEditing={isEditingNative}
                            >
                                <LanguageBoxLabel>Your native language</LanguageBoxLabel>
                                <LanguageDisplay>
                                    <LanguageFlag>{nativeLanguage?.flag || '🌐'}</LanguageFlag>
                                    <LanguageName>{nativeLanguage?.name || 'English'}</LanguageName>
                                </LanguageDisplay>
                                <LanguageNote>
                                    {isEditingNative ? 'Select a language below' : 'Auto-detected from browser'}
                                </LanguageNote>
                            </LanguageBox>

                            <LanguageBox
                                className="language-box"
                                onClick={() => setIsEditingTarget(true)}
                                $isEditing={isEditingTarget}
                                $isPulsing={!hasTargetSelectedLanguage}
                            >
                                <LanguageBoxLabel>You&apos;re learning</LanguageBoxLabel>
                                <LanguageDisplay>
                                    <LanguageFlag>{hasTargetSelectedLanguage ? targetSelectedLanguage?.flag : '🌐'}</LanguageFlag>
                                    <LanguageName>{hasTargetSelectedLanguage ? targetSelectedLanguage?.name : 'Select language'}</LanguageName>
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
                                                    setNativeSelectedLanguage(language);
                                                    setIsEditingNative(false);
                                                } else if (isEditingTarget) {
                                                    setTargetSelectedLanguage(language); // Don't pass level here, keep existing level
                                                    setIsEditingTarget(false);
                                                    setHasTargetSelectedLanguage(true);
                                                }
                                            }}
                                            $isSelected={
                                                isEditingNative
                                                    ? nativeLanguage?.code === language.code
                                                    : nativeLanguage?.code === language.code
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
                        <LevelSelectorContainer $isDisabled={!hasTargetSelectedLanguage || isEditingTarget}>
                            <LevelLabel>Select your {targetSelectedLanguage?.name} level:</LevelLabel>

                            {/* If user has selected a level, show only that level */}
                            {hasTargetSelectedLevel && targetSelectedLanguageLevel ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '1.5rem'
                                }}>
                                    <LevelButton
                                        $isActive={true}
                                        onClick={() => {
                                            // Don't do anything yet, just visual selection
                                            setTargetSelectedLanguage(targetSelectedLanguage, null);
                                        }}
                                        $isDisabled={!hasTargetSelectedLanguage || isEditingTarget || isLoadingSignup}
                                        style={{ width: '120px' }}
                                    >
                                        <LevelEmoji>
                                            {targetSelectedLanguageLevel.emoji}
                                        </LevelEmoji>
                                        <LevelName>{targetSelectedLanguageLevel.code}</LevelName>
                                        <LevelDesc>
                                            {targetSelectedLanguageLevel.name}
                                        </LevelDesc>
                                    </LevelButton>
                                </div>
                            ) : (
                                /* Show full grid if no level is selected */
                                <LevelButtons>
                                    {DEFAULT_LEVELS.map(level => (
                                        <LevelButton
                                            key={level.code}
                                            $isActive={hasTargetSelectedLevel && targetSelectedLanguageLevel === level}
                                            onClick={() => {
                                                setTargetSelectedLanguage(targetSelectedLanguage, level);
                                            }}
                                            $isDisabled={!hasTargetSelectedLanguage || isEditingTarget || isLoadingSignup}
                                            $needsSelection={hasTargetSelectedLanguage && !targetSelectedLanguageLevel || !hasTargetSelectedLevel}
                                        >
                                            <LevelEmoji>{level.emoji}</LevelEmoji>
                                            <LevelName>{level.code}</LevelName>
                                            <LevelDesc>{level.name}</LevelDesc>
                                        </LevelButton>
                                    ))}
                                </LevelButtons>
                            )}
                        </LevelSelectorContainer>

                        {/* Registration section - shown AFTER level selection */}
                        {hasTargetSelectedLanguage && !isEditingTarget && !hasRegistered && hasTargetSelectedLevel && (
                            <>


                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    width: '100%',
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    padding: '1rem',
                                    animation: (hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? 'pulseGlow 2s ease-in-out infinite' : 'none',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    background: (hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? 'rgba(255, 152, 0, 0.05)' : 'transparent',
                                    border: (hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? '2px dashed rgba(255, 152, 0, 0.3)' : '2px dashed transparent',
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
                                display:flex;
                                flex: 1;
                                gap: 8px;
                                align-items: center;
                                animation: ${(hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? 'shake 0.5s ease-in-out' : 'none'};
                                animation-delay: 0.5s;
                              }
                              
                              .email-input {
                                flex: 1;
                                padding: 12px 16px;
                                font-size: 14px;
                                border: 2px solid ${showValidEmailIndicator ? '#22c55e' : (hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? '#ff9800' : '#e5e7eb'};
                                border-radius: 8px;
                                outline: none;
                                background-color: white !important;
                                color: #1f2937 !important;
                                -webkit-text-fill-color: #1f2937 !important;
                                opacity: 1 !important;
                                transition: all 0.3s ease;
                                animation: ${(hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? 'borderPulse 2s ease-in-out infinite' : 'none'};
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
                                animation: ${(hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? 'subtle-pulse 2s ease-in-out infinite' : 'none'};
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
                                                if (e.key === 'Enter' && registrationEmail && validateEmail(registrationEmail) && targetSelectedLanguageLevel) {
                                                    document.querySelector<HTMLButtonElement>('.submit-button')?.click();
                                                }
                                            }}
                                            style={{
                                                minWidth: '0px',
                                                color: '#1f2937',
                                                backgroundColor: 'white',
                                                WebkitTextFillColor: '#1f2937',
                                                // WebkitAppearance: 'none'
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
                                                if (registrationEmail && validateEmail(registrationEmail) && targetSelectedLanguageLevel) {
                                                    setIsLoadingSignup(true);
                                                    setSignupError('');
                                                    try {
                                                        // Create account immediately with email
                                                        const response = await apiService.signupWithEmail({
                                                            email: registrationEmail,
                                                            nativeLanguage: nativeLanguage?.code || nativeLanguage?.code || 'en',
                                                            targetLanguage: targetSelectedLanguage?.code!,
                                                            level: targetSelectedLanguageLevel.code
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
                                                                native_language: nativeLanguage?.code || nativeLanguage?.code || 'en',
                                                                target_language: targetSelectedLanguage?.code,
                                                                level: targetSelectedLanguageLevel,
                                                                source: 'reader_widget'
                                                            });
                                                            // Show pricing page - user is already authenticated
                                                            router.replace('/checkout')
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
                                            disabled={!registrationEmail || !validateEmail(registrationEmail) || !targetSelectedLanguageLevel || isLoadingSignup}
                                            style={{
                                                padding: '12px 20px',
                                                backgroundColor: (!registrationEmail || !validateEmail(registrationEmail) || !targetSelectedLanguageLevel || isLoadingSignup) ? '#ccc' : '#ff9800',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: (!registrationEmail || !validateEmail(registrationEmail) || !targetSelectedLanguageLevel || isLoadingSignup) ? 'not-allowed' : 'pointer',
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
                                            if (targetSelectedLanguageLevel) {
                                                setIsLoadingSignup(true);
                                                // For Google OAuth, store preferences and redirect
                                                localStorage.setItem('pendingLanguagePrefs', JSON.stringify({
                                                    nativeLanguage: nativeLanguage?.code || nativeLanguage?.code || 'en',
                                                    targetLanguage: targetSelectedLanguage?.code,
                                                    level: targetSelectedLanguageLevel
                                                }));

                                                // Set flag to show pricing after OAuth return
                                                localStorage.setItem('showPricingAfterAuth', 'true');
                                                localStorage.setItem('returnToWidget', 'true');

                                                // Redirect to Google OAuth
                                                const baseUrl = 'https://staging.langomango.com';
                                                const returnUrl = encodeURIComponent('/sign-up');
                                                const frontendRedirectUrl = encodeURIComponent(window.location.origin);
                                                const googleAuthUrl = `${baseUrl}/auth/login-google?returnUrl=${returnUrl}&frontendRedirectUrl=${frontendRedirectUrl}`;

                                                window.location.href = googleAuthUrl;
                                            }
                                        }}
                                        disabled={!targetSelectedLanguageLevel || isLoadingSignup}
                                        style={{
                                            width: '100%',
                                            padding: '12px 20px',
                                            backgroundColor: 'white',
                                            color: '#374151',
                                            border: `2px solid ${(hasTargetSelectedLanguage && !hasValidEmail && !hasRegistered && !!targetSelectedLanguageLevel) ? '#ff9800' : '#e1e5e9'}`,
                                            borderRadius: '8px',
                                            cursor: (!targetSelectedLanguageLevel || isLoadingSignup) ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            opacity: (!targetSelectedLanguageLevel || isLoadingSignup) ? 0.5 : 1,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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

                        {hasTargetSelectedLanguage && !isEditingTarget && hasRegistered && (
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
                    </LanguageSetupContainer>

                    {(!hasTargetSelectedLanguage || isEditingTarget) ? (
                        <PromptMessage>
                            <PromptIcon>👆</PromptIcon>
                            Please select your target language to continue
                        </PromptMessage>
                    ) : (!targetSelectedLanguageLevel && hasTargetSelectedLanguage) ? (
                        <PromptMessage>
                            <PromptIcon>🎯</PromptIcon>
                            Now select your level
                        </PromptMessage>
                    ) : (!hasRegistered && !hasValidEmail && targetSelectedLanguageLevel) ? (
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
        </SignupSection>
    );
}