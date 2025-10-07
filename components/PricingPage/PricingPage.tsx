import React, { useState } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  pricePerMonth?: string;
  originalPrice?: string;
  duration: string;
  features: string[];
  recommended?: boolean;
  discount?: string;
  buttonText: string;
  stripeLookupKey: string;
}

interface PricingPageProps {
  onSelectPlan?: (planId: string) => void;
  isLoading?: boolean;
  userToken: string | null; // JWT token if user is authenticated
  isAuthenticated?: boolean;
}

const PricingPage: React.FC<PricingPageProps> = ({ 
  onSelectPlan, 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: '1month',
      name: '1 Month Plan',
      price: '€11.99',
      pricePerMonth: '/ Mo',
      originalPrice: '',
      duration: '1 month',
      features: [
        'Upload Your Books',
        'Read from Kindle',
        'Books in App Library',
        'iOS & Android App'
      ],
      buttonText: 'Start Free Trial',
      stripeLookupKey: 'price_monthly'
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      price: '€72',
      pricePerMonth: '',
      originalPrice: '€143.88',
      duration: '12 months',
      features: [
        'Upload Your Books',
        'Read from Kindle',
        'Books in App Library',
        'iOS & Android App',
        'Save 50%',
        'Best Value'
      ],
      recommended: true,
      discount: 'Save €71.88',
      buttonText: 'Start Free Trial',
      stripeLookupKey: 'price_yearly'
    },
    {
      id: '3year',
      name: '3 Year Plan',
      price: '€144',
      originalPrice: '€431.64',
      duration: '36 months',
      features: [
        'Upload Your Books',
        'Read from Kindle',
        'Books in App Library',
        'iOS & Android App',
        'Save 67%',
        'One-time Payment'
      ],
      discount: '67% OFF',
      buttonText: 'Get 3 Year Access',
      stripeLookupKey: 'price_3year'
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setError(null);
    
    // Call the parent handler if provided
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  return (
    <PricingWrapper>
      <PricingContent>
        <Header>
          <Title>Learn Languages by Reading What You Love</Title>
          <Subtitle>Choose Your LangoMango Plan</Subtitle>
          <SubtitleNote>7-day free trial • Cancel anytime</SubtitleNote>
        </Header>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <PlansContainer>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              $recommended={plan.recommended}
              $isLifetime={plan.id === '3year'}
              $isSelected={selectedPlan === plan.id}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.recommended && <RecommendedBadge>MOST POPULAR</RecommendedBadge>}
              
              <PlanHeader $has3YearDiscount={plan.id === '3year'}>
                <PlanName>{plan.name}</PlanName>
                <PriceContainer>
                  {plan.originalPrice && (
                    <OriginalPrice>{plan.originalPrice}</OriginalPrice>
                  )}
                  <CurrentPrice>
                    {plan.price}
                    {plan.pricePerMonth && <PriceUnit>{plan.pricePerMonth}</PriceUnit>}
                  </CurrentPrice>
                  {plan.discount && plan.id === 'yearly' && (
                    <DiscountAmount>{plan.discount}</DiscountAmount>
                  )}
                </PriceContainer>
                {plan.discount && plan.id === '3year' && (
                  <DiscountBadge>{plan.discount}</DiscountBadge>
                )}
              </PlanHeader>

              <FeaturesList>
                {plan.features.map((feature, index) => (
                  <Feature key={index}>
                    <CheckIcon>✓</CheckIcon>
                    <FeatureText>{feature}</FeatureText>
                  </Feature>
                ))}
              </FeaturesList>

              <SelectButton
                $recommended={plan.recommended}
                $isLifetime={plan.id === '3year'}
              >
                {selectedPlan === plan.id ? (
                  <LoadingSpinner />
                ) : (
                  plan.buttonText
                )}
              </SelectButton>
            </PlanCard>
          ))}
        </PlansContainer>

        <GuaranteeSection>
          <GuaranteeBadge>
            <GuaranteeText>7 DAYS</GuaranteeText>
            <GuaranteeSubtext>FREE TRIAL</GuaranteeSubtext>
          </GuaranteeBadge>
        </GuaranteeSection>

        <PaymentMethods>
          <PaymentMethodsText>Secure payment with</PaymentMethodsText>
          <PaymentIcons>
            <PaymentIcon>💳 Credit Card</PaymentIcon>
            <PaymentIcon>🅿️ PayPal</PaymentIcon>
          </PaymentIcons>
        </PaymentMethods>

        <CTAButton 
          onClick={() => handlePlanSelect(selectedPlan)} 
          disabled={!selectedPlan}
        >
          {selectedPlan === '3year' ? 'Get 3 Year Access' : 'Start Your Free Trial'}
        </CTAButton>
      </PricingContent>
    </PricingWrapper>
  );
};

// Styled Components
const PricingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #2a2a2a;
  color: white;
  overflow-y: auto;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PricingContent = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${media('<=tablet')} {
    padding: 1.5rem 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #f59e0b;
  margin-bottom: 0.5rem;
  
  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.h3`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const SubtitleNote = styled.p`
  font-size: 1.4rem;
  color: #9ca3af;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.3rem;
  }
`;

const ErrorMessage = styled.div`
  background: #ef4444;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const PlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PlanCard = styled.div<{ $recommended?: boolean; $isLifetime?: boolean; $isSelected?: boolean }>`
  background: ${props => props.$isLifetime ? '#ff6b00' : 'white'};
  color: ${props => props.$isLifetime ? 'white' : '#333'};
  border-radius: 1.2rem;
  padding: 1.8rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid ${props => props.$isSelected ? '#f59e0b' : 'transparent'};
  
  ${props => props.$recommended && !props.$isLifetime && `
    border: 2px solid #f59e0b;
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  ${media('<=tablet')} {
    padding: 1.5rem;
  }
`;

const RecommendedBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background: #f59e0b;
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: white;
  color: #ff6b00;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  font-size: 1.3rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  ${media('<=tablet')} {
    right: 10px;
    font-size: 1.1rem;
    padding: 0.4rem 0.8rem;
  }
`;

const PlanHeader = styled.div<{ $has3YearDiscount?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  padding-right: ${props => props.$has3YearDiscount ? '90px' : '0'};
  
  ${media('<=tablet')} {
    margin-bottom: 0.8rem;
    padding-right: ${props => props.$has3YearDiscount ? '80px' : '0'};
  }
`;

const PlanName = styled.h4`
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.5rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 1.4rem;
`;

const CurrentPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: baseline;
  
  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

const PriceUnit = styled.span`
  font-size: 1.6rem;
  font-weight: normal;
  margin-left: 0.5rem;
`;

const DiscountAmount = styled.span`
  color: #f59e0b;
  font-size: 1.4rem;
  font-weight: bold;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem 1rem;
  
  ${media('<=tablet')} {
    gap: 0.5rem 0.8rem;
  }
  
  ${media('<=phone')} {
    gap: 0.4rem 0.6rem;
  }
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  
  ${media('<=tablet')} {
    font-size: 1.1rem;
    gap: 0.4rem;
  }
  
  ${media('<=phone')} {
    font-size: 1rem;
    gap: 0.3rem;
  }
`;

const CheckIcon = styled.span`
  color: #22c55e;
  font-size: 1.4rem;
  font-weight: bold;
  flex-shrink: 0;
  
  ${media('<=tablet')} {
    font-size: 1.2rem;
  }
  
  ${media('<=phone')} {
    font-size: 1rem;
  }
`;

const FeatureText = styled.span``;

const SelectButton = styled.button<{ $recommended?: boolean; $isLifetime?: boolean }>`
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: bold;
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$isLifetime ? `
    background: white;
    color: #ff6b00;
  ` : props.$recommended ? `
    background: #f59e0b;
    color: white;
  ` : `
    background: #e5e7eb;
    color: #333;
  `}
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${media('<=tablet')} {
    font-size: 1.3rem;
    padding: 0.8rem 1.6rem;
  }
`;

const GuaranteeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const GuaranteeBadge = styled.div`
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid #4b5563;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 2px dashed #4b5563;
    animation: rotate 20s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  ${media('<=tablet')} {
    width: 90px;
    height: 90px;
    
    &::after {
      width: 100px;
      height: 100px;
    }
  }
`;

const GuaranteeText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  z-index: 1;
  
  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

const GuaranteeSubtext = styled.div`
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.1;
  color: #d1d5db;
  font-weight: 500;
  letter-spacing: 0.05em;
  z-index: 1;
  
  ${media('<=tablet')} {
    font-size: 0.8rem;
  }
`;

const PaymentMethods = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PaymentMethodsText = styled.p`
  color: #9ca3af;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const PaymentIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const PaymentIcon = styled.span`
  font-size: 1.4rem;
  color: #d1d5db;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 1.4rem;
  font-size: 1.8rem;
  font-weight: bold;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #d97706;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
    padding: 1.2rem;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default PricingPage;
