import { useCallback, useEffect, useState } from "react";
import PricingPage from "components/PricingPage/PricingPage";
import { useVisitor } from "contexts/VisitorContext";
import { apiService, APP_URL, CreateCheckoutSessionRequest, TriggerRegisterEmail } from "services/apiService";
import { createEnhancedCheckoutSession } from "services/apiService";
import { trackRedditConversion } from "utils/redditPixel";
import { RedditEventTypes } from "utils/redditPixel";

export default function Checkout() {
    const visitor = useVisitor();
    const [isPricingLoading, setIsPricingLoading] = useState(false);

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
                await TriggerRegisterEmail({email: visitor.email}, visitor.token)
            }
            // Redirect to email verification or onboarding
            window.location.href = '/verification';
        };

        const handleReturn = async () => {
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
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const googleToken = hashParams.get('token')
            if (googleToken) {
                if (googleToken) {
                    visitor.setToken(googleToken)
                    await apiService.createTemporalProfile({
                        nativeLanguageId: visitor.nativeLanguage.code,
                        targetLanguageId: visitor.targetSelectedLanguage.code,
                        languageLevel: visitor.targetSelectedLanguageLevel.code
                    },
                        googleToken)
                    console.log("set token")
                    window.location.href = '/checkout';
                }
                else
                    console.log("check stripe return")
            }
        };

        console.log("check stripe return")
        handleReturn();
    }, [visitor]);


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
    
    return (
        <PricingPage
            onSelectPlan={handlePricingPlanSelect}
            isLoading={isPricingLoading}
            userToken={visitor.token}
            isAuthenticated={visitor.token != null}
        />
    )
}