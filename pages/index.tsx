// pages/index.tsx - Updated with component visibility tracking and time tracking
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';
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
import { useEffect, useCallback, useRef } from 'react';
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
import { injectContentsquareScript } from '@contentsquare/tag-sdk';

// Import the updated Reddit Pixel utilities with visibility tracking
import { 
  getRedditPixelScript, 
  trackRedditConversion, 
  trackPageVisit,
  setupAllSectionTracking,
  RedditEventTypes 
} from 'utils/redditPixel';

// Reddit Pixel ID
const REDDIT_PIXEL_ID = 'a2_gu5yg1ki8lp4';

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common', 'home']);
  const sectionsInitialized = useRef(false);
  
  useEffect(() => {
    captureReferral();
  }, []);

  useEffect(() => { 
    if (typeof window !== 'undefined') {
      console.log('Initializing ContentSquare script');
      
      try {
        injectContentsquareScript({ 
          siteId: "6407230",
          async: true,
          defer: false
        });
        console.log('ContentSquare script injected successfully');
      } catch (error) {
        console.error('Error injecting ContentSquare script:', error);
      }
    }
  }, []);

  // Track scroll depth for engagement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let maxScrollPercent = 0;
    const trackScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      const scrollPercent = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      // Only track if we've scrolled further than before
      if (scrollPercent > maxScrollPercent) {
        // Track at specific thresholds: 25%, 50%, 75%, 90%
        const thresholds = [25, 50, 75, 90];
        
        for (const threshold of thresholds) {
          if (scrollPercent >= threshold && maxScrollPercent < threshold) {
            trackRedditConversion(RedditEventTypes.SCROLL_DEPTH, {
              scroll_percent: threshold
            });
            break;
          }
        }
        
        maxScrollPercent = scrollPercent;
      }
    };
    
    window.addEventListener('scroll', trackScrollDepth);
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, []);

  // On load, track page visit and set up visibility tracking
  const handleRedditPixelLoad = useCallback(() => {
    // Track page visit
    trackPageVisit();
    
    // Initialize section tracking after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (!sectionsInitialized.current) {
        setupAllSectionTracking();
        sectionsInitialized.current = true;
      }
    }, 1000);
  }, []);

  // Track video view event
  const handleVideoPlay = useCallback(() => {
    trackRedditConversion(RedditEventTypes.VIEW_CONTENT, { 
      content_type: 'video',
      content_id: 'tutorial-video',
      engagement_type: 'play'
    });
  }, []);

  // Track CTA click event
  const handleCtaClick = useCallback(() => {
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'CTA button click'
    });
  }, []);
  
  return (
    <>
      {/* Reddit Pixel Base Code - Using Next.js Script component */}
      <Script
        id="reddit-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: getRedditPixelScript(REDDIT_PIXEL_ID)
        }}
        onLoad={handleRedditPixelLoad}
      />
      
      <Head>
        <title>{t('common:title')}</title>
        <meta name="description" content={t('common:description')} />
      </Head>
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <div id="hero-section">
            <Hero />
          </div>
          <div id="section-1">
            <BasicSection1 
              imageUrl="/multiplatform.jpeg" 
              title={t('home:section1.title')} 
              overTitle={t('home:section1.overTitle')}
            >
              <p>
                {t('home:section1.description')}
              </p>
              <ul>
                <li>{t('home:section1.bulletPoint.adjustable')}</li>
                <li>{t('home:section1.bulletPoint.instant')}</li>
                <li>{t('home:section1.bulletPoint.wordByWord')}</li>
              </ul>
            </BasicSection1>
          </div>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <div id="video-section">
            <Wrapper>
              <SectionTitle>{t('home:videoSection.title')}</SectionTitle>
              <YoutubeVideo 
                url="https://www.youtube.com/watch?v=L6JMhu2SrVs" 
                onPlay={handleVideoPlay}
              />
            </Wrapper>
          </div>
          <div id="cta-section-top">
            <Cta onCtaClick={handleCtaClick} />
          </div>
          <div id="features-section">
            <FeaturesGallery />
          </div>
          <div id="section-2">
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
          </div>

          <div id="section-3">
            <BasicSection 
              imageUrl="/smart-chat.svg" 
              title={t('home:section3.title')} 
              overTitle={t('home:section3.overTitle')}
            >
              <p>
                {t('home:section3.description')}
              </p>
            </BasicSection>
          </div>

          <div id="section-4">
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
          </div>

          <div id="section-5">
            <BasicSection 
              imageUrl="/smart-reading-novels.svg" 
              title={t('home:section5.title')} 
              overTitle={t('home:section5.overTitle')}
            >
              <p>
                {t('home:section5.description')}
              </p>
            </BasicSection>
          </div>
          
          <div id="cta-section-bottom">
            <Cta onCtaClick={handleCtaClick} />
          </div>
          <div id="pricing-section">
            <PricingTablesSection />
          </div>
          <div id="faq-section">
            <FaqSection/>
          </div>
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
  const translations = await serverSideTranslations(locale, ['common', 'home']);
  
  return {
    props: {
      posts: await getAllPosts(),
      ...translations,
    },
  };
}