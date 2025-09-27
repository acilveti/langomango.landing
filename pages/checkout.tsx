import { useCallback, useEffect, useState } from "react";
import PricingPage from "components/PricingPage/PricingPage";
import { useVisitor } from "contexts/VisitorContext";
import { CreateCheckoutSessionRequest } from "services/apiService";
import { createEnhancedCheckoutSession } from "services/apiService";
import { trackRedditConversion } from "utils/redditPixel";
import { RedditEventTypes } from "utils/redditPixel";

export default function Checkout() {

    const { token, signupChannel } = useVisitor();
    const [isPricingLoading, setIsPricingLoading] = useState(false);

    useEffect(() => {
        const handleStripeReturn = async () => {
            // Check if returning from Stripe
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            const success = urlParams.get('success');

            if (sessionId && success === 'true') {

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
                localStorage.removeItem('stripe-session-id');
            }
        };

        handleStripeReturn();
    }, [signupChannel]);

    // Channel-specific handlers
    const handleGoogleSignupCompletion = async () => {
        // Google-specific actions
        console.log('Completing Google signup flow');

        // Redirect to dashboard or onboarding
        window.location.href = '/dashboard';
    };

    const handleEmailSignupCompletion = async () => {
        // Email-specific actions
        console.log('Completing email signup flow');

        // Redirect to email verification or onboarding
        window.location.href = '/verify-email';
    };
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
                returnUrl: '/checkout'
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