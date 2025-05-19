// pages/index.tsx with Reddit Pixel events
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
import { useCallback, useEffect } from 'react';
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

// Reddit Pixel ID
const REDDIT_PIXEL_ID = 'a2_gu5yg1ki8lp4';

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common', 'home']);
  
  // Track page view
  useEffect(() => {
    // Initialize Reddit Pixel if not already initialized
    if (typeof window !== 'undefined' && !(window as any).rdt) {
      !function(w: any, d: Document) {
        if (!w.rdt) {
          const p = w.rdt = function() {
            p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
          };
          p.callQueue = [];
          const t = d.createElement("script");
          t.src = "https://www.redditstatic.com/ads/pixel.js";
          t.async = true;
          const s = d.getElementsByTagName("script")[0];
          s.parentNode?.insertBefore(t, s);
        }
      }(window, document);
      
      // Initialize with the pixel ID
      (window as any).rdt('init', REDDIT_PIXEL_ID);
      
      // Track PageVisit event
      (window as any).rdt('track', 'PageVisit');
      console.log('Reddit Pixel: Tracked PageVisit event');
    }
  }, []);
  
  useEffect(() => {
    captureReferral();
  }, []);

  useEffect(() => { 
    if (typeof window !== 'undefined') {
      // Add logging to verify script execution
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

  // Helper function to track Reddit events
  const trackRedditEvent = useCallback((eventType: string, customData?: any) => {
    if (typeof window !== 'undefined' && (window as any).rdt) {
      try {
        (window as any).rdt('track', eventType, customData);
        console.log(`Reddit Pixel: Tracked ${eventType} event`, customData);
      } catch (error) {
        console.error('Reddit Pixel: Error tracking event', error);
      }
    }
  }, []);

  // Track video view event
  const handleVideoPlay = useCallback(() => {
    trackRedditEvent('ViewContent', { 
      content_type: 'video',
      content_id: 'tutorial-video'
    });
  }, [trackRedditEvent]);

  // Track CTA click event
  const handleCtaClick = useCallback(() => {
    trackRedditEvent('Lead', {
      lead_type: 'CTA button click'
    });
  }, [trackRedditEvent]);

  // Track pricing view event
  const handlePricingView = useCallback(() => {
    // Use Intersection Observer to track when pricing section comes into view
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              trackRedditEvent('ViewContent', { 
                content_type: 'pricing',
                content_id: 'pricing-tables'
              });
              observer.disconnect(); // Only track once
            }
          });
        },
        { threshold: 0.5 }
      );
      
      const pricingElement = document.getElementById('pricing-section');
      if (pricingElement) {
        observer.observe(pricingElement);
      }
    }
  }, [trackRedditEvent]);

  // Set up observers for tracking sections when they come into view
  useEffect(() => {
    // We'll track the pricing section view after component mounts
    handlePricingView();
  }, [handlePricingView]);
  
  return (
    <>
      <Head>
        <title>{t('common:title')}</title>
        <meta name="description" content={t('common:description')} />
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
              <li>{t('home:section1.bulletPoint.adjustable')}</li>
              <li>{t('home:section1.bulletPoint.instant')}</li>
              <li>{t('home:section1.bulletPoint.wordByWord')}</li>
            </ul>
          </BasicSection1>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Wrapper>
            <SectionTitle>{t('home:videoSection.title')}</SectionTitle>
            <YoutubeVideo 
              url="https://www.youtube.com/watch?v=L6JMhu2SrVs" 
               // Track when video starts playing
            />
          </Wrapper>
          <Cta /> {/* Pass the tracking handler to CTA component */}
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
          
          <Cta /> {/* Track bottom CTA as well */}
          <div id="pricing-section"> {/* Add ID for intersection observer */}
            <PricingTablesSection />
          </div>
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
  // This line is essential
  const translations = await serverSideTranslations(locale, ['common', 'home']);
  
  return {
    props: {
      posts: await getAllPosts(),
      ...translations, // Make sure this spread operator is here
    },
  };
}