import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/dist/shared/lib/router/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ColorModeScript } from 'nextjs-color-mode';
import React, { PropsWithChildren, useEffect } from 'react';
import { TinaEditProvider } from 'tinacms/dist/edit-state';


import Footer from 'components/Footer';
import { GlobalStyle } from 'components/GlobalStyles';
import Navbar from 'components/Navbar';
import NavigationDrawer from 'components/NavigationDrawer';
import NewsletterModal from 'components/NewsletterModal';
import WaveCta from 'components/WaveCta';
import { NewsletterModalContextProvider, useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { NavItems } from 'types';
import {addReferralToUrl } from 'utils/referral'; // Adjust the path as needed
import { appWithTranslation } from 'next-i18next';
import { injectContentsquareScript } from '@contentsquare/tag-sdk';

export const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  window.location.href = addReferralToUrl("https://beta-app.langomango.com/sign-up");
};

// Define a custom nav item type that includes the onClick handler
type NavItemWithHandler = NavItems[0] & {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

// Create navigation items with the onClick handler
const navItems: NavItemWithHandler[] = [
  { 
    title: 'free trial', 
    href: addReferralToUrl('https://beta-app.langomango.com/sign-up'), 
    outlined: true,
    onClick: handleButtonClick, // Add the onClick handler
  },
];

const TinaCMS = dynamic(() => import('tinacms'), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
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
  return (
    <>
      <Head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="793f8225-d6fb-4f40-86a3-cb29e594462d"></script><link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* <link rel="alternate" type="application/rss+xml" href={EnvVars.URL + 'rss'} title="RSS 2.0" /> */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
          ga('create', 'UA-117119829-1', 'auto');
          ga('send', 'pageview');`,
          }}
        /> */}
        {/* <script async src="https://www.google-analytics.com/analytics.js"></script> */}
      </Head>
      <ColorModeScript />
      <GlobalStyle />

      <Providers>
        
        <Modals />
        <Navbar items={navItems} />
        <TinaEditProvider
          editMode={
            <TinaCMS
              query={pageProps.query}
              variables={pageProps.variables}
              data={pageProps.data}
              isLocalClient={!process.env.NEXT_PUBLIC_TINA_CLIENT_ID}
              branch={process.env.NEXT_PUBLIC_EDIT_BRANCH}
              clientId={process.env.NEXT_PUBLIC_TINA_CLIENT_ID}
              {...pageProps}
            >
              {(livePageProps: any) => <Component {...livePageProps} />}
            </TinaCMS>
          }
        >
          <Component {...pageProps} />
        </TinaEditProvider>
        <WaveCta />
        <Footer />
      </Providers>
      <Analytics/>
    </>
  );
}

function Providers<T>({ children }: PropsWithChildren<T>) {
  return (
    <NewsletterModalContextProvider>
      <NavigationDrawer items={navItems}>{children}</NavigationDrawer>
    </NewsletterModalContextProvider>
  );
}

function Modals() {
  const { isModalOpened, setIsModalOpened } = useNewsletterModalContext();
  if (!isModalOpened) {
    return null;
  }
  return <NewsletterModal onClose={() => setIsModalOpened(false)} />;
}

export default appWithTranslation(MyApp);
