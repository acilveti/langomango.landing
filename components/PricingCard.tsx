import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { media } from 'utils/media';
import Button from './Button';
import RichText from './RichText';
import { addReferralToUrl } from 'utils/referral';

interface PricingCardProps {
  title: string;
  description: string;
  benefits: string[];
  isOutlined?: boolean;
}

export default function PricingCard({ title, description, benefits, isOutlined, children }: PropsWithChildren<PricingCardProps>) {
  const isAnyBenefitPresent = benefits?.length;
  
  // Function to handle button click with proper type annotation for anchor elements
    const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      window.location.href = addReferralToUrl("https://beta-app.langomango.com/beta-phase");
    };

  return (
    <Wrapper isOutlined={isOutlined}>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <PriceContainer>
        <Price>{children}</Price>
        {isAnyBenefitPresent && (
          <CustomRichText>
            <ul>
              {benefits.map((singleBenefit, idx) => (
                <li key={idx}>{singleBenefit}</li>
              ))}
            </ul>
          </CustomRichText>
        )}
      </PriceContainer>
      <CustomButton data-umami-event="pricing button" onClick={handleButtonClick} >Get started</CustomButton>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ isOutlined?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 3rem;
  background: rgb(var(--cardBackground));
  box-shadow: ${(p) => (p.isOutlined ? 'var(--shadow-lg)' : 'var(--shadow-md)')};
  transform: ${(p) => (p.isOutlined ? 'scale(1.1)' : 'scale(1.0)')};
  text-align: center;

  & > *:not(:first-child) {
    margin-top: 1rem;
  }

  ${media('<=desktop')} {
    box-shadow: var(--shadow-md);
    transform: none;
    order: ${(p) => (p.isOutlined ? -1 : 0)};
  }
`;

const Title = styled.h3`
  font-size: 4rem;
  text-transform: capitalize;
`;

const Description = styled.p`
  font-size: 2.5rem;
`;

const PriceContainer = styled.div`
  margin: auto;

  & > *:not(:first-child) {
    margin-top: 2rem;
  }
`;

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 4rem;
  line-height: 1;
  font-weight: bold;

  span {
    font-size: 2rem;
    font-weight: normal;
  }
`;

const CustomRichText = styled(RichText)`
  li {
    margin: auto;
    width: fit-content;
  }
`;

const CustomButton = styled(Button)`
  width: 100%;
`;
