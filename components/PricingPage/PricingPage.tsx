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
}

interface PricingPageProps {
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
}

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan, isLoading }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

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
        'Books Already in App Library',
        'Read from Kindle',
        'Read from iOS or Android App'
      ],
      buttonText: 'Start Free Trial'
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
        'Books Already in App Library',
        'Read from Kindle',
        'Read from iOS or Android App',
        'Save 50%'
      ],
      recommended: true,
      discount: 'Save €71.88',
      buttonText: 'Start Free Trial'
    },
    {
      id: '3year',
      name: '3 Year Plan',
      price: '€144',
      originalPrice: '€431.64',
      duration: '36 months',
      features: [
        'Upload Your Books',
        'Books Already in App Library',
        'Read from Kindle',
        'Read from iOS or Android App',
        'Save 67%'
      ],
      discount: '67% OFF',
      buttonText: 'Get 3 Year Access'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    onSelectPlan(planId);
  };

  return (
    <PricingWrapper>
      <PricingContent>
        <Header>
        <Title>Learn Languages by Reading What You Love 📚</Title>
        <Subtitle>Choose Your LangoMango Plan</Subtitle>
        <SubtitleNote>7-day free trial • Cancel anytime</SubtitleNote>
      </Header>

      <PlansContainer>
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            $recommended={plan.recommended}
            $isLifetime={plan.id === '3year'}
            $isSelected={selectedPlan === plan.id}
            onClick={() => !isLoading && handlePlanSelect(plan.id)}
          >
            {plan.recommended && <RecommendedBadge>MOST POPULAR</RecommendedBadge>}
            {plan.discount && plan.id === '3year' && (
              <DiscountBadge>{plan.discount}</DiscountBadge>
            )}
            
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
              disabled={isLoading}
            >
              {isLoading && selectedPlan === plan.id ? (
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

        <CTAButton onClick={() => handlePlanSelect(selectedPlan)} disabled={!selectedPlan || isLoading}>
          {isLoading ? 'Processing...' : selectedPlan === '3year' ? 'Get 3 Year Access' : 'Start Your Free Trial'}
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
  z-index: 999999;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const PricingContent = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  ${media('<=tablet')} {
    padding: 2rem 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: #f59e0b;
  margin-bottom: 1rem;
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h3`
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  
  ${media('<=tablet')} {
    font-size: 2.2rem;
  }
`;

const SubtitleNote = styled.p`
  font-size: 1.6rem;
  color: #9ca3af;
  margin: 0;
  
  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const PlansContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PlanCard = styled.div<{ $recommended?: boolean; $isLifetime?: boolean; $isSelected?: boolean }>`
  background: ${props => props.$isLifetime ? '#ff6b00' : 'white'};
  color: ${props => props.$isLifetime ? 'white' : '#333'};
  border-radius: 1.5rem;
  padding: 2.5rem;
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
    padding: 2rem;
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
  top: 20px;
  right: 20px;
  background: white;
  color: #ff6b00;
  padding: 0.6rem 1.2rem;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: bold;
`;

const PlanName = styled.h4`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  
  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

const PriceContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 1.6rem;
`;

const CurrentPrice = styled.div`
  font-size: 3.2rem;
  font-weight: bold;
  display: flex;
  align-items: baseline;
  
  ${media('<=tablet')} {
    font-size: 2.8rem;
  }
`;

const PriceUnit = styled.span`
  font-size: 1.6rem;
  font-weight: normal;
  margin-left: 0.5rem;
`;

const DiscountAmount = styled.span`
  color: #ff6b00;
  font-size: 1.8rem;
  font-weight: bold;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.6rem;
  
  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const CheckIcon = styled.span`
  color: #22c55e;
  font-size: 2rem;
  font-weight: bold;
`;

const FeatureText = styled.span``;

const SelectButton = styled.button<{ $recommended?: boolean; $isLifetime?: boolean }>`
  width: 100%;
  padding: 1.2rem 2.4rem;
  font-size: 1.6rem;
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
    font-size: 1.4rem;
    padding: 1rem 2rem;
  }
`;

const GuaranteeSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const GuaranteeBadge = styled.div`
  background: #333;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 3px solid #666;
  
  ${media('<=tablet')} {
    width: 100px;
    height: 100px;
  }
`;

const GuaranteeText = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  
  ${media('<=tablet')} {
    font-size: 2rem;
  }
`;

const GuaranteeSubtext = styled.div`
  font-size: 1rem;
  text-align: center;
  line-height: 1.2;
  
  ${media('<=tablet')} {
    font-size: 0.9rem;
  }
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 1.8rem;
  font-size: 2rem;
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
    font-size: 1.8rem;
    padding: 1.5rem;
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
