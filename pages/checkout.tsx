import { useCallback, useState } from "react";
import PricingPage from "components/PricingPage/PricingPage";
import { CreateCheckoutSessionRequest } from "services/apiService";
import { createEnhancedCheckoutSession } from "services/apiService";
import { trackRedditConversion } from "utils/redditPixel";
import { RedditEventTypes } from "utils/redditPixel";

export default function Checkout() {

    const [isPricingLoading, setIsPricingLoading] = useState(false);
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
                returnUrl: 'https://beta-app.langomango.com/payment-room'
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
    return (
        <PricingPage
            onSelectPlan={handlePricingPlanSelect}
            isLoading={isPricingLoading}
            userToken={localStorage.getItem('token') || undefined}
            isAuthenticated={true}
        />
    )
}