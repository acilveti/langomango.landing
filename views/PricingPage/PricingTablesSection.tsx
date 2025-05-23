// views/PricingPage/PricingTablesSection.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import AutofitGrid from 'components/AutofitGrid';
import PricingCard from 'components/PricingCard';
import SectionTitle from 'components/SectionTitle';
import { useTranslation } from 'next-i18next';

export default function PricingTablesSection() {
  const { t } = useTranslation(['common', 'home']);
  const [isYearly, setIsYearly] = useState(false);
  
  // Get the pricing benefits from translations
  const benefits = [
    t('home:pricing.beta.benefits.1'),
  ];
  
  return (
    <Wrapper>
      <SectionTitle>{t('home:pricing.title')}</SectionTitle>
      
      {/* Market Context Info */}
      <MarketContextText>
        Average private language tutoring rates: $25-35/hour (US), £20-30/hour (UK), €20-30/hour (Europe)
      </MarketContextText>
      
      {/* Pricing Toggle */}
      <ToggleWrapper>
        <ToggleLabel isActive={!isYearly}>Monthly</ToggleLabel>
        <ToggleSwitch>
          <ToggleInput
            type="checkbox"
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <ToggleLabel isActive={isYearly}>
          Yearly
          <DiscountBadge>50% OFF</DiscountBadge>
        </ToggleLabel>
      </ToggleWrapper>
      
      <AutofitGrid>
        {!isYearly ? (
          <PricingCard
            title={t('home:pricing.monthly.title')}
            description={t('home:pricing.monthly.description')}
            benefits={benefits}
          >
            {t('home:pricing.monthly.price')}<span> {t('home:pricing.monthly.period')}</span>
          </PricingCard>
        ) : (
          <PricingCard
            title={t('home:pricing.yearly.title')}
            description={t('home:pricing.yearly.description')}
            benefits={benefits}
          >
            <PriceWithDiscount>
              <OriginalPrice>{t('home:pricing.monthly.price')} × 12 = 144</OriginalPrice>
              <DiscountedPrice>
                {t('home:pricing.yearly.price')}<span> {t('home:pricing.yearly.period')}</span>
              </DiscountedPrice>
            </PriceWithDiscount>
          </PricingCard>
        )}
      </AutofitGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  & > *:not(:first-child) {
    margin-top: 3rem;
  }
`;

const MarketContextText = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.4rem;
  margin: 2rem 0;
  font-style: italic;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 3rem 0;
`;

const ToggleLabel = styled.span<{ isActive: boolean }>`
  font-size: 1.6rem;
  font-weight: ${props => props.isActive ? '600' : '400'};
  color: ${props => props.isActive ? '#333' : '#666'};
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }

  ${ToggleInput}:checked + & {
    background-color: #2196F3;
  }

  ${ToggleInput}:checked + &:before {
    transform: translateX(26px);
  }
`;

const DiscountBadge = styled.span`
  background: linear-gradient(135deg, #ff6b6b, #ff8e53);
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PriceWithDiscount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const OriginalPrice = styled.span`
  font-size: 1.4rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountedPrice = styled.div`
  font-size: 2.4rem;
  font-weight: 700;
  color: #333;
  
  span {
    font-size: 1.6rem;
    font-weight: 400;
    color: #666;
  }
`;