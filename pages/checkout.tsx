import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PricingPage from 'components/PricingPage/PricingPage';
import { getUserSubscriptionStatus } from 'services/apiService';

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      setUserToken(token);
      setIsAuthenticated(true);
    } else {
      // If not authenticated, redirect to sign up
      // Store that we want to return to checkout after authentication
      localStorage.setItem('returnToCheckout', 'true');
      window.location.href = 'https://beta-app.langomango.com/sign-up';
    }
  }, []);

  const handlePlanSelect = async (planId: string) => {
    console.log('Plan selected:', planId);
    // The PricingPage component will handle the checkout process
  };

  // Don't render anything until we've checked authentication
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PricingPage 
      onSelectPlan={handlePlanSelect}
      isLoading={isLoading}
      userToken={userToken}
      isAuthenticated={isAuthenticated}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};