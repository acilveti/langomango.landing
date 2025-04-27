// pages/index.tsx with i18n implementation
import { Analytics } from '@vercel/analytics/react';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import BasicSection, {BasicSection1} from 'components/BasicSection';
import Link from 'components/Link';
import { EnvVars } from 'env.production';
import { getAllPosts } from 'utils/postsFetcher';
import Cta from 'views/HomePage/Cta';
import Features from 'views/HomePage/Features';
import FeaturesGallery from 'views/HomePage/FeaturesGallery';
import Hero from 'views/HomePage/Hero';
import Partners from 'views/HomePage/Partners';
import ScrollableBlogPosts from 'views/HomePage/ScrollableBlogPosts';
import Testimonials from 'views/HomePage/Testimonials';
import PricingTablesSection from 'views/PricingPage/PricingTablesSection';
import { useEffect } from 'react';
import { captureReferral } from 'utils/referral';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import AutofitGrid from 'components/AutofitGrid';
import BasicCard from 'components/BasicCard';
import Page from 'components/Page';
import SectionTitle from 'components/SectionTitle';
import YoutubeVideo from 'components/YoutubeVideo';
import { media } from 'utils/media';
import FaqSection from 'views/PricingPage/FaqSection';

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common', 'home']);
  
  useEffect(() => {
    captureReferral();
  }, []);
  
  return (
    <>
      <Head>
        <title>{t('common:title')}</title>
        <meta name="description" content={t('common:description')} />
        <Analytics/>
      </Head>
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <Hero />
          <BasicSection1 
            imageUrl="/multiplatform.jpeg" 
            title={t('home:section1.title')} 
            overTitle={t('home:section1.overTitle')}
          >
            <p>
              {t('home:section1.description')}
            </p>
            <ul>
              {['adjustable', 'instant', 'wordByWord'].map((key) => (
                <li key={key}>{t(`home:section1.bulletPoint.${key}`)}</li>
              ))}
            </ul>
          </BasicSection1>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Wrapper>
            <SectionTitle>{t('home:videoSection.title')}</SectionTitle>
            <YoutubeVideo url="https://www.youtube.com/watch?v=L6JMhu2SrVs" />
          </Wrapper>
          <Cta />
          <FeaturesGallery />
          <BasicSection
            reversed
            imageUrl="/smart-reading.svg"
            title={t('home:section2.title')}
            overTitle={t('home:section2.overTitle')}
          >
            <p>
              {t('home:section2.description')}
            </p>
          </BasicSection>

          <BasicSection 
            imageUrl="/smart-chat.svg" 
            title={t('home:section3.title')} 
            overTitle={t('home:section3.overTitle')}
          >
            <p>
              {t('home:section3.description')}
            </p>
          </BasicSection>

          <BasicSection 
            reversed 
            imageUrl="/smart-reading-news.svg" 
            title={t('home:section4.title')} 
            overTitle={t('home:section4.overTitle')}
          >
            <p>
              {t('home:section4.description')}
            </p>
          </BasicSection>

          <BasicSection 
            imageUrl="/smart-reading-novels.svg" 
            title={t('home:section5.title')} 
            overTitle={t('home:section5.overTitle')}
          >
            <p>
              {t('home:section5.description')}
            </p>
          </BasicSection>
          
          <Cta />
          <PricingTablesSection />
          <FaqSection/>
        </DarkerBackgroundContainer>
      </HomepageWrapper>

      <style jsx global>{`
        span.wordWisePosition::before {
          content: attr(data-translation);
          position: absolute;
          top: -8px;
          color: #111010;
          font-size: 0.7em;
          white-space: normal;
          overflow: hidden;
          line-height: 0.8 !important;
          font-weight: 600;
        }
        
        span.wordWisePress::before {
          content: attr(data-translation);
          position: absolute;
          top: -8px;
          color: #111010;
          font-size: 0.7em;
          white-space: normal;
          overflow: hidden;
          line-height: 0.8 !important;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        span.wordWisePress:active::before {
          opacity: 1;
        }
      `}</style>
    </>
  );
}

const HomepageWrapper = styled.div`
  & > :last-child {
    margin-bottom: 15rem;
  }
`;

const DarkerBackgroundContainer = styled.div`
  background: rgb(var(--background));

  & > *:not(:first-child) {
    margin-top: 15rem;
  }
`;

const WhiteBackgroundContainer = styled.div`
  background: rgb(var(--secondBackground));

  & > :last-child {
    padding-bottom: 15rem;
  }

  & > *:not(:first-child) {
    margin-top: 15rem;
  }
`;

const Wrapper = styled.div`
  & > *:not(:first-child) {
    margin-top: 10rem;
  }
`;

const CustomAutofitGrid = styled(AutofitGrid)`
  --autofit-grid-item-size: 40rem;

  ${media('<=tablet')} {
    --autofit-grid-item-size: 30rem;
  }

  ${media('<=phone')} {
    --autofit-grid-item-size: 100%;
  }
`;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      posts: await getAllPosts(),
      // Add the necessary i18n translations
      ...(await serverSideTranslations(locale, ['common', 'home'])),
    },
  };
}