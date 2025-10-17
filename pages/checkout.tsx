import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import PricingPage from "components/PricingPage/PricingPage";
import { useVisitor } from "contexts/VisitorContext";
import { apiService, APP_URL, CreateCheckoutSessionRequest, TriggerRegisterEmail } from "services/apiService";
import { createEnhancedCheckoutSession } from "services/apiService";
import { trackRedditConversion } from "utils/redditPixel";
import { RedditEventTypes } from "utils/redditPixel";

export default function Checkout() {
    const visitor = useVisitor();
    const router = useRouter()
    const [isPricingLoading, setIsPricingLoading] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);

    useEffect(() => {
        // Channel-specific handlers
        const handleStripeGoogleSignupCompletion = async () => {
            // Google-specific actions
            console.log('Completing Google signup flow');
            console.log('/signup?token=' + visitor.token);
            // Redirect to dashboard or onboarding
            window.location.href = APP_URL + '/google-bridge-sign-up?token=' + visitor.token;
        };

        const handleStripeEmailSignupCompletion = async () => {
            // Email-specific actions
            console.log('Completing email signup flow');

            if (visitor.token && visitor.email) {
                await TriggerRegisterEmail({ email: visitor.email }, visitor.token)
            }
            // Redirect to email verification or onboarding
            router.replace('/verification')
        };

        const handleReturn = async () => {
            if (visitor.token) {
                // Check if returning from Stripe
                const urlParams = new URLSearchParams(window.location.search);
                console.log(urlParams)
                const sessionId = urlParams.get('session_id');
                const success = urlParams.get('success');
                console.log(window.location.href)
                if (sessionId && success === 'true') {
                    console.log("stripe success detected " + visitor.signupChannel)
                    // Perform channel-specific actions
                    switch (visitor.signupChannel) {
                        case 'Google':
                            await handleStripeGoogleSignupCompletion();
                            break;
                        case 'email':
                            await handleStripeEmailSignupCompletion();
                            break;
                    }
                }
                return
            }
            console.log('showing coupon modal')
            
            const hasSeenCouponModal = sessionStorage.getItem('coupon-modal-shown');
            console.log(hasSeenCouponModal)

            if (!hasSeenCouponModal) {
                setShowCouponModal(true);
                sessionStorage.setItem('coupon-modal-shown', 'true');
            }
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const googleToken = hashParams.get('token')
            if (googleToken && !visitor.token) {
                console.log('set token to:' + googleToken)
                visitor.setToken(googleToken)
                await apiService.createTemporalProfile({
                    nativeLanguageId: visitor.nativeLanguage.code,
                    targetLanguageId: visitor.targetSelectedLanguage.code,
                    languageLevel: visitor.targetSelectedLanguageLevel.code
                },
                    googleToken)
                router.replace('/checkout')

                console.log("set token")
            }
            else
                console.log("check stripe return")
        };

        handleReturn();
    }, [visitor, router]);


    // Handle pricing plan selection
    const handlePricingPlanSelect = useCallback(async (planId: string) => {
        console.log('Selected pricing plan:', planId);
        setIsPricingLoading(true);

        try {
            // User is already authenticated at this point

            if (!visitor.token) {
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
                returnUrl: window.location.href,
            };

            const checkoutData = await createEnhancedCheckoutSession(checkoutRequest, visitor.token);

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
    }, [visitor.token]);

    console.log('showCouponModal state:', showCouponModal);

    const modalContent = showCouponModal && (
        <StyledModalOverlay onClick={() => setShowCouponModal(false)} data-modal="coupon-modal">
            <StyledModalContent onClick={(e) => e.stopPropagation()}>
                <StyledBadge>LIMITED TIME OFFER</StyledBadge>

                <StyledModalHeader>
                    <StyledIcon>🎉</StyledIcon>
                    <StyledModalTitle>Welcome, Early Adopter!</StyledModalTitle>
                    <StyledModalSubtitle>You are invited to unlock an exclusive offer</StyledModalSubtitle>
                </StyledModalHeader>

                <StyledModalBody>
                    <StyledOfferBox>
                        <StyledOfferTitle>Get 3 Months FREE</StyledOfferTitle>
                        <StyledOfferSubtext>on any plan you choose</StyledOfferSubtext>
                    </StyledOfferBox>

                    <StyledCouponBox>
                        <StyledCouponLabel>Use this code at checkout:</StyledCouponLabel>
                        <StyledCouponCode>EARLY-BIRD</StyledCouponCode>
                        <StyledCopyHint>Simply enter it in the next step</StyledCopyHint>
                    </StyledCouponBox>

                    <StyledFeaturesList>
                        <StyledFeature>
                            <StyledCheckIcon>✓</StyledCheckIcon>
                            <span>7-day free trial included</span>
                        </StyledFeature>
                        <StyledFeature>
                            <StyledCheckIcon>✓</StyledCheckIcon>
                            <span>Cancel anytime, no commitment</span>
                        </StyledFeature>
                        <StyledFeature>
                            <StyledCheckIcon>✓</StyledCheckIcon>
                            <span>Full access to all features</span>
                        </StyledFeature>
                    </StyledFeaturesList>
                </StyledModalBody>

                <StyledModalFooter>
                    <StyledCloseButton onClick={() => setShowCouponModal(false)}>
                        Claim My Offer
                    </StyledCloseButton>
                </StyledModalFooter>
            </StyledModalContent>
        </StyledModalOverlay>
    );

    return (
        <>
            <PricingPage
                onSelectPlan={handlePricingPlanSelect}
                isLoading={isPricingLoading}
                userToken={visitor.token}
                isAuthenticated={visitor.token != null}
            />

            {typeof window !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
        </>
    )
}

// Styled Components - Matching PricingPage aesthetic
const StyledModalOverlay = styled.div`
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0, 0, 0, 0.85) !important;
    backdrop-filter: blur(8px);
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 2147483648 !important;
    padding: 2rem;
    animation: fadeIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const StyledModalContent = styled.div`
    position: relative;
    background: white;
    border-radius: 1.2rem;
    max-width: 540px;
    width: 100%;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
    overflow: visible;
    margin-top: 1rem;
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes slideUp {
        from {
            transform: translateY(40px) scale(0.95);
            opacity: 0;
        }
        to {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
    }
`;

const StyledBadge = styled.div`
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
    color: white;
    padding: 0.5rem 1.8rem;
    border-radius: 2rem;
    font-size: 1.05rem;
    font-weight: bold;
    letter-spacing: 0.08em;
    box-shadow: 0 6px 16px rgba(255, 107, 0, 0.5);
    z-index: 10;
    border: 2px solid rgba(255, 255, 255, 0.3);
`;

const StyledModalHeader = styled.div`
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    padding: 3.2rem 2.5rem 2.2rem;
    text-align: center;
    position: relative;
    border-radius: 1.2rem 1.2rem 0 0;
    overflow: hidden;
`;

const StyledIcon = styled.div`
    font-size: 4rem;
    margin-bottom: 0.8rem;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    animation: bounce 2.5s ease-in-out infinite;

    @keyframes bounce {
        0%, 100% {
            transform: translateY(0) scale(1);
        }
        50% {
            transform: translateY(-12px) scale(1.05);
        }
    }
`;

const StyledModalTitle = styled.h2`
    color: white;
    font-size: 2.1rem;
    font-weight: bold;
    margin: 0 0 0.6rem;
    line-height: 1.2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const StyledModalSubtitle = styled.p`
    color: #d1d5db;
    font-size: 1.25rem;
    margin: 0;
    line-height: 1.5;
    font-weight: 400;
`;

const StyledModalBody = styled.div`
    padding: 2.8rem 2.5rem;
    background: white;
`;

const StyledOfferBox = styled.div`
    background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
    border-radius: 1.2rem;
    padding: 2rem 2rem;
    text-align: center;
    margin-bottom: 2.2rem;
    box-shadow: 0 10px 30px rgba(255, 107, 0, 0.35);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    }
`;

const StyledOfferTitle = styled.div`
    color: white;
    font-size: 2.4rem;
    font-weight: bold;
    margin-bottom: 0.4rem;
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    letter-spacing: -0.02em;
`;

const StyledOfferSubtext = styled.div`
    color: rgba(255, 255, 255, 0.95);
    font-size: 1.35rem;
    font-weight: 500;
`;

const StyledCouponBox = styled.div`
    background: linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%);
    border: 2.5px dashed #d1d5db;
    border-radius: 1.2rem;
    padding: 1.8rem 1.6rem;
    margin-bottom: 2.2rem;
    text-align: center;
`;

const StyledCouponLabel = styled.div`
    font-size: 1.15rem;
    color: #6b7280;
    margin-bottom: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
`;

const StyledCouponCode = styled.div`
    background: #2a2a2a;
    color: #f59e0b;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    padding: 1.1rem 1.8rem;
    border-radius: 0.9rem;
    letter-spacing: 4px;
    font-family: 'Courier New', monospace;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    margin-bottom: 1rem;
    border: 3px solid #f59e0b;
    position: relative;

    &::after {
        content: '📋';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.4rem;
        opacity: 0.7;
    }
`;

const StyledCopyHint = styled.div`
    font-size: 1.05rem;
    color: #9ca3af;
    font-style: italic;
    font-weight: 400;
`;

const StyledFeaturesList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0;
`;

const StyledFeature = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.3rem;
    color: #374151;
    font-weight: 500;
`;

const StyledCheckIcon = styled.span`
    color: #22c55e;
    font-size: 1.6rem;
    font-weight: bold;
    flex-shrink: 0;
    background: rgba(34, 197, 94, 0.1);
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
`;

const StyledModalFooter = styled.div`
    padding: 0 2.5rem 2.5rem;
    background: white;
    border-radius: 0 0 1.2rem 1.2rem;
`;

const StyledCloseButton = styled.button`
    width: 100%;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    padding: 1.5rem 2rem;
    border-radius: 5rem;
    font-size: 1.65rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35);
    letter-spacing: 0.02em;

    &:hover {
        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(245, 158, 11, 0.45);
    }

    &:active {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35);
    }
`;