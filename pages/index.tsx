import { injectContentsquareScript } from '@contentsquare/tag-sdk';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Container from 'components/Container';
import ReaderDemoModal from 'components/ReaderDemoModal';
import SimpleCta from 'components/SimpleCta2';
import YoutubeVideo from 'components/YoutubeVideo';
import { useVisitor } from 'contexts/VisitorContext';
import { media } from 'utils/media';
import { getAllPosts } from 'utils/postsFetcher';
import { getRedditPixelScript, RedditEventTypes, setupAllSectionTracking, trackPageVisit, trackRedditConversion } from 'utils/redditPixel';
import { captureReferral } from 'utils/referral';
import Cta from 'views/HomePage/Cta';
import FeaturesGallery from 'views/HomePage/FeaturesGallery';
import Hero from 'views/HomePage/Hero';
import HeroSticky from 'views/HomePage/HeroSticky';
import SingleTestimonial from 'views/HomePage/SingleTestimonial';
import Testimonials from 'views/HomePage/Testimonials';
import FaqSection from 'views/PricingPage/FaqSection';
import PricingTablesSection from 'views/PricingPage/PricingTablesSection';

// Import the updated Reddit Pixel utilities with visibility tracking

// Reddit Pixel ID
const REDDIT_PIXEL_ID = 'a2_gu5yg1ki8lp4';

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common', 'home']);
  const sectionsInitialized = useRef(false);
  const { selectedLanguage } = useVisitor();

  // New state variables to track our conditions
  const [hasScrolled, setHasScrolled] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [pageVisitTracked, setPageVisitTracked] = useState(false);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showReaderDemo, setShowReaderDemo] = useState(false);
  const languageSelectorRef = useRef<any>(null);
  const [darkenAmount, setDarkenAmount] = useState(0);
  const [oauthReturnData, setOauthReturnData] = useState<{registered: boolean} | null>(null);

  // Check for OAuth return on mount
  useEffect(() => {
    // Extract token from URL hash if present
    const hash = window.location.hash;
    if (hash && hash.includes('token=')) {
      const tokenMatch = hash.match(/token=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = decodeURIComponent(tokenMatch[1]);
        console.log('Found JWT token in URL, storing in localStorage');
        localStorage.setItem('token', token);
        
        // Clean up the hash from URL
        const newUrl = new URL(window.location.href);
        newUrl.hash = '';
        window.history.replaceState({}, document.title, newUrl.toString());
      }
    }
    
    // Parse URL more carefully to handle hash fragments
    const urlParams = new URLSearchParams(window.location.search);
    let state = urlParams.get('state');
    
    // If state contains extra path info, extract just the state value
    if (state && state.includes('/')) {
      state = state.split('/')[0];
    }
    
    console.log('Landing page checking for OAuth return, state:', state);
    
    // Check if we're returning from OAuth signup flow
    if (state === 'oauth_signup_return') {
      console.log('Detected OAuth signup return, opening reader demo modal');
      
      // Clean up URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('state');
      // Also remove any hash fragment with token
      newUrl.hash = '';
      window.history.replaceState({}, document.title, newUrl.toString());
      
      // Set flag for reader demo widget to know it's an OAuth return
      setOauthReturnData({ registered: true });
      
      // Open the modal immediately
      setShowReaderDemo(true);
    }
  }, []);

  useEffect(() => {
    captureReferral();
  }, []);

  // Scroll effect for darkening when widget is centered
  useEffect(() => {
    const handleScroll = () => {
      // Find the reader widget in the Hero section
      const heroSection = document.getElementById('hero-section');
      if (!heroSection) return;
      
      // Look for the reader widget container
      const widgetContainers = heroSection.querySelectorAll('[class*="DemoContainer"]');
      if (widgetContainers.length === 0) return;
      
      const widget = widgetContainers[0];
      const rect = widget.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenterY = rect.top + rect.height / 2;
      const screenCenterY = windowHeight / 2;
      
      // Calculate distance from center of screen
      const distanceFromCenter = Math.abs(elementCenterY - screenCenterY);
      const maxDistance = windowHeight / 2;
      
      // Calculate darkening amount (0 to 1)
      // 0 when far from center, 1 when perfectly centered
      const darkness = Math.max(0, 1 - (distanceFromCenter / maxDistance));
      
      // Apply exponential curve for smoother transition
      const smoothDarkness = Math.pow(darkness, 2);
      
      setDarkenAmount(smoothDarkness * 0.6); // Max 60% darkness
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Initializing ContentSquare script');

      try {
        injectContentsquareScript({
          siteId: '6407230',
          async: true,
          defer: false,
        });
        console.log('ContentSquare script injected successfully');
      } catch (error) {
        console.error('Error injecting ContentSquare script:', error);
      }
    }
  }, []);

  // Track scroll and set hasScrolled when any scroll occurs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
        console.log('User has scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Timer to track time spent on page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set up a timer that increments every second
    timeIntervalRef.current = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  // Check conditions and track page visit when both are met
  useEffect(() => {
    // Only proceed if we haven't already tracked the visit
    if (!pageVisitTracked && hasScrolled && timeSpent >= 5) {
      console.log('Both conditions met: tracked page visit after 5s and scroll');
      trackPageVisit();
      setPageVisitTracked(true);

      // Now that we've tracked the visit, we can initialize section tracking
      if (!sectionsInitialized.current) {
        setupAllSectionTracking();
        sectionsInitialized.current = true;
      }
    }
  }, [hasScrolled, timeSpent, pageVisitTracked]);

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
              scroll_percent: threshold,
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

  // Reddit Pixel load handler - now we DON'T track page visit here
  const handleRedditPixelLoad = useCallback(() => {
    console.log('Reddit Pixel loaded - waiting for conditions to track page visit');
    // We no longer track page visit immediately, but wait for conditions
  }, []);

  // Track video view event
  const handleVideoPlay = useCallback(() => {
    trackRedditConversion(RedditEventTypes.VIEW_CONTENT, {
      content_type: 'video',
      content_id: 'tutorial-video',
      engagement_type: 'play',
    });
  }, []);

  // Track CTA click event
  const handleCtaClick = useCallback(() => {
    trackRedditConversion(RedditEventTypes.LEAD, {
      lead_type: 'CTA button click',
    });
  }, []);

  return (
    <>
      {/* Page-wide darkening overlay */}
      <PageDarkenOverlay opacity={darkenAmount} />
      
      {/* Reddit Pixel Base Code - Using Next.js Script component */}
      <Script
        id="reddit-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: getRedditPixelScript(REDDIT_PIXEL_ID),
        }}
        onLoad={handleRedditPixelLoad}
      />

      <Head>
        <title>{t('common:title')}</title>
        <meta name="description" content={t('common:description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <HomepageWrapper>
        <div id="hero-sticky-section">
          <HeroSticky
            backgroundImage="/portada2.jpeg"
            title="You just started to learn 28 german words"
            subtitle="Keep scrolling to discover more"
            overlayOpacity={0.1}
          />
        </div>
        {/* Add the HeroSticky component at the very beginning */}
        <WhiteBackgroundContainer className="white-background-container">
          <HeroSection id="hero-section">
            <Hero />
          </HeroSection>
          {/* Reader Demo */}
          {/* <div id="reader-demo-section" style={{ margin: '4rem 0' }}>
            <Container>
              <ReaderDemoWidget selectedLanguage={selectedLanguage} useInlineSignup={true} />
            </Container>
          </div> */}
          
          <div id="section-1">
            {/* Pass the title and overTitle to Testimonials */}
          <div id="features-section">
            <FeaturesGallery />
          </div>
            <Testimonials title={t('home:section1.title')} overTitle={t('home:section1.overTitle')} />

            <div id="cta-section-top">
              <Cta imageSrc="/smart-guy.jpeg" imageAlt="Sign up illustration" onCtaClick={handleCtaClick} />
            </div>
          </div>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer className="front-element">
          <div id="pricing-section">
            <PricingTablesSection />
          </div>
          <div id="section-5">
            <SingleTestimonial title={t('home:section5.title')} overTitle={t('home:section5.overTitle')}/>
          </div>
          <SimpleCta 
            trackingEvent="testimonial section cta" 
            location="after testimonial"
          />
          
          {/* Fixed Video Section with proper Container and styling */}
          <VideoSectionWrapper id="video-section">
            <Container>
              <HeaderContainer>
                {/* <CustomOverTitle>{t('home:videoSection.overTitle')}</CustomOverTitle> */}
                <VideoTitle>{t('home:videoSection.title')}</VideoTitle>
              </HeaderContainer>
              <YoutubeVideo url="https://www.youtube.com/watch?v=L6JMhu2SrVs" onPlay={handleVideoPlay} />
            </Container>
          </VideoSectionWrapper>
          
          <div id="cta-section-top">
            <Cta onCtaClick={handleCtaClick} />
          </div>

          {/* <div id="cta-section-bottom">
            <Cta onCtaClick={handleCtaClick} />
          </div> */}
          <div id="faq-section">
            <FaqSection />
          </div>
        </DarkerBackgroundContainer>
      </HomepageWrapper>

      {/* Reader Demo Modal */}
      {showReaderDemo && (
        <ReaderDemoModal 
          onClose={() => {
            setShowReaderDemo(false);
            setOauthReturnData(null);
            // Reset language selector after closing modal
            if (languageSelectorRef.current) {
              languageSelectorRef.current.resetStates();
            }
          }} 
          selectedLanguage={selectedLanguage}
          isOauthReturn={!!oauthReturnData}
        />
      )}

      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        html {
          scroll-behavior: smooth;
        }

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

        /* Add styles to ensure proper spacing after the sticky hero */
        #hero-sticky-section {
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 0; /* Changed back to 0 to allow proper stacking */
          width: 100vw;
          max-width: 100%;
          overflow: hidden;
        }

        /* Add a shadow to create a transition effect */
        .white-background-container {
          position: relative;
          z-index: 10; /* Increased to ensure it's above hero sticky background */
          box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.2);
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          margin-top: -20px;
        }

        .front-element {
          position: relative;
          z-index: 10; /* Increased to match white background */
        }
      `}</style>
    </>
  );
}

const HomepageWrapper = styled.div`
  & > :last-child {
    margin-bottom: 0rem;
  }

  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  position: relative;
  z-index: 10;
`;

const DarkerBackgroundContainer = styled.div`
  background: rgb(var(--background));

  & > *:not(:first-child) {
    padding-top: 5rem;
  }
`;

const WhiteBackgroundContainer = styled.div`
  background: rgb(var(--secondBackground));

  & > :last-child {
    padding-bottom: 4rem;
  }

  & > *:not(:first-child) {
    margin-top: 4rem;
  }
`;

/* Fixed Video Section Styling */
const VideoSectionWrapper = styled.div`
  padding-top: 5rem;
`;

const HeaderContainer = styled.div`
  margin-bottom: 6rem;
  overflow: hidden;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const VideoTitle = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 4rem;
  letter-spacing: -0.03em;
  max-width: 100%;
  text-align: center;

  ${media('<=tablet')} {
    font-size: 4.6rem;
    margin-bottom: 2rem;
  }
`;
const PageDarkenOverlay = styled.div<{ opacity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: ${props => props.opacity};
  pointer-events: none;
  z-index: 9;
  transition: opacity 0.3s ease-out;
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
