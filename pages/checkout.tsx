import { useCallback, useEffect, useState } from "react";
import PricingPage from "components/PricingPage/PricingPage";
import { useVisitor } from "contexts/VisitorContext";
import { CreateCheckoutSessionRequest, getRegisterEmail } from "services/apiService";
import { createEnhancedCheckoutSession } from "services/apiService";
import { trackRedditConversion } from "utils/redditPixel";
import { RedditEventTypes } from "utils/redditPixel";

export default function Checkout() {
    const { token, email, signupChannel } = useVisitor();
    const [isPricingLoading, setIsPricingLoading] = useState(false);

    useEffect(() => {
        // Channel-specific handlers
        const handleGoogleSignupCompletion = async () => {
            // Google-specific actions
            console.log('Completing Google signup flow');
            // Redirect to dashboard or onboarding
            window.location.href = '/thank-you';
        };

        const handleEmailSignupCompletion = async () => {
            // Email-specific actions
            console.log('Completing email signup flow');

            if (token && email) {
                await getRegisterEmail(token, email)
            }
            // Redirect to email verification or onboarding
            window.location.href = '/verify-email';
        }; 

        const handleStripeReturn = async () => {
            // Check if returning from Stripe
            const urlParams = new URLSearchParams(window.location.search);
            console.log(urlParams)
            const sessionId = urlParams.get('session_id');
            const success = urlParams.get('success');

            if (sessionId && success === 'true') {
                console.log("stripe success detected " + signupChannel)
                // Perform channel-specific actions
                switch (signupChannel) {
                    case 'Google':
                        await handleGoogleSignupCompletion();
                        break;
                    case 'email':
                        await handleEmailSignupCompletion();
                        break;
                }

                // Clean up
                localStorage.removeItem('signup-channel');
            }
        };
        console.log("check stripe return")
        handleStripeReturn();
    }, [signupChannel,token, email]);


    // Handle pricing plan selection
    const handlePricingPlanSelect = useCallback(async (planId: string) => {
        console.log('Selected pricing plan:', planId);
        setIsPricingLoading(true);

        try {
            // User is already authenticated at this point

            if (!token) {
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

            const checkoutData = await createEnhancedCheckoutSession(checkoutRequest, token);

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
    }, [token]);
    return (
        <PricingPage
            onSelectPlan={handlePricingPlanSelect}
            isLoading={isPricingLoading}
            userToken={token}
            isAuthenticated={token != null}
        />
    )
}