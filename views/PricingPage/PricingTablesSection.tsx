import React from 'react';
import styled from 'styled-components';
import AutofitGrid from 'components/AutofitGrid';
import PricingCard from 'components/PricingCard';
import SectionTitle from 'components/SectionTitle';

export default function PricingTablesSection() {
  return (
    <Wrapper>
      <SectionTitle>Leverage your learning at low cost</SectionTitle>
      <AutofitGrid>
        <PricingCard
          title="Beta-phase"
          description="Be part of our beta phase."
          benefits={['Be one of the first users', 'premium in person assistance', 'direct comunication with langomango founder']}
        >
          $10<span> per 3 months</span>
        </PricingCard>
      </AutofitGrid>
    </Wrapper>

  );
}

const Wrapper = styled.div`
  & > *:not(:first-child) {
    margin-top: 8rem;
  }
`;
