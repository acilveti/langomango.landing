import NextImage from 'next/image';
import React, { useState } from 'react';
import styled from 'styled-components';
import Collapse from 'components/Collapse';
import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import SectionTitle from 'components/SectionTitle';
import ThreeLayersCircle from 'components/ThreeLayersCircle';
import { media } from 'utils/media';
import { useTranslation } from 'next-i18next';

// Define the proper type for objectFit
type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

interface TabItem {
  titleKey: string;
  descriptionKey: string;
  imageUrl: string | null;
  baseColor: string;
  secondColor: string;
  objectFit: ObjectFit | null;
}

export default function FeaturesGallery() {
  const { t } = useTranslation();
  
  // Define tabs with proper typing
  const TABS: TabItem[] = [
    {
      titleKey: 'features.tabs.smart_assistance.title',
      descriptionKey: 'features.tabs.smart_assistance.description',
      imageUrl: '/feature2.jpeg',
      baseColor: '249,82,120',
      secondColor: '221,9,57',
      objectFit: 'cover' as ObjectFit, // Explicitly type as ObjectFit
    },
    {
      titleKey: 'features.tabs.instant_translation.title',
      descriptionKey: 'features.tabs.instant_translation.description',
      imageUrl: '/wordwise-text.jpeg',
      baseColor: '57,148,224',
      secondColor: '99,172,232',
      objectFit: 'contain' as ObjectFit, // Explicitly type as ObjectFit
    },
    {
      titleKey: 'features.tabs.adjustable_language.title',
      descriptionKey: 'features.tabs.adjustable_language.description',
      imageUrl: '/translated-text.jpeg',
      baseColor: '88,193,132',
      secondColor: '124,207,158',
      objectFit: 'contain' as ObjectFit, // Explicitly type as ObjectFit
    },
    {
      titleKey: 'features.tabs.fourth_feature.title',
      descriptionKey: 'features.tabs.fourth_feature.description',
      imageUrl: null,
      baseColor: '156,39,176',
      secondColor: '186,104,200',
      objectFit: null, // No object fit needed since there's no image
    },
  ];

  // Map translation keys to translated content
  const translatedTabs = TABS.map(tab => ({
    ...tab,
    title: t(tab.titleKey),
    description: `<p>${t(tab.descriptionKey)}</p>`,
  }));

  const [currentTab, setCurrentTab] = useState(translatedTabs[0]);

  const featuresMarkup = translatedTabs.map((singleTab, idx) => {
    const isActive = singleTab.title === currentTab.title;
    const isFirst = idx === 0;

    return (
      <FeatureItem key={singleTab.title}>
        <Tab isActive={isActive} onClick={() => handleTabClick(idx)}>
          <TabTitleContainer>
            <CircleContainer>
              <ThreeLayersCircle baseColor={isActive ? 'transparent' : singleTab.baseColor} secondColor={singleTab.secondColor} />
            </CircleContainer>
            <h4>{singleTab.title}</h4>
          </TabTitleContainer>
          <Collapse isOpen={true} duration={300}>
            <TabContent>
              <div dangerouslySetInnerHTML={{ __html: singleTab.description }}></div>
            </TabContent>
          </Collapse>
        </Tab>
        
        {/* Show image for tabs that have imageUrl and objectFit */}
        {singleTab.imageUrl && singleTab.objectFit && (
          <ImageContainer>
            <NextImage 
              src={singleTab.imageUrl} 
              alt={singleTab.title} 
              layout="fill" 
              objectFit={singleTab.objectFit} 
              priority={isFirst} 
            />
          </ImageContainer>
        )}
      </FeatureItem>
    );
  });

  function handleTabClick(idx: number) {
    setCurrentTab(translatedTabs[idx]);
  }

  return (
    <FeaturesGalleryWrapper>
      <Content>
        <OverTitle>{t('features.overTitle')}</OverTitle>
        <SectionTitle>{t('features.title')}</SectionTitle>
      </Content>
      <FeaturesContainer>
        {featuresMarkup}
      </FeaturesContainer>
    </FeaturesGalleryWrapper>
  );
}

const FeaturesGalleryWrapper = styled(Container)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4rem;
  gap: 3rem;

  ${media('<=desktop')} {
    gap: 2rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Content = styled.div`
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
  text-align: left;
  width: 100%;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.8rem;
  border: 2px solid #d1d5db; /* Light grey border */
  background: #f3f4f6; /* Light grey background */
  padding: 10px;
  box-shadow: var(--shadow-md);
  margin-top: 2rem;
  width: 100%;

  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: calc((9 / 16) * 100%);
  }

  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const Tab = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  background: rgb(var(--cardBackground));
  box-shadow: var(--shadow-md);
  cursor: pointer;
  border-radius: 0.6rem;
  transition: opacity 0.2s;

  font-size: 1.6rem;
  font-weight: bold;
`;

const TabTitleContainer = styled.div`
  display: flex;
  align-items: center;

  h4 {
    flex: 1;
    text-align: left;
    margin: 0;
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: normal;
  margin-top: 0.5rem;
  font-size: 1.5rem;
  padding-left: calc(5rem + 1.5rem);

  ${media('<=tablet')} {
    padding-left: calc(4rem + 1.25rem);
  }

  p {
    font-weight: normal;
  }
`;

const CircleContainer = styled.div`
  flex: 0 calc(5rem + 1.5rem);

  ${media('<=tablet')} {
    flex: 0 calc(4rem + 1.25rem);
  }
`;