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

import AutofitGrid from 'components/AutofitGrid';
import BasicCard from 'components/BasicCard';
import Page from 'components/Page';
import SectionTitle from 'components/SectionTitle';
import YoutubeVideo from 'components/YoutubeVideo';
import { media } from 'utils/media';
import FaqSection from 'views/PricingPage/FaqSection';

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>LangoMango</title>
        <meta name="description" content="Language learning platform, focused on readers and bookworms." />
        <Analytics/>
      </Head>
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <Hero />
          {/* <Partners /> */}
          <BasicSection1 imageUrl="/multiplatform.jpeg" title="Seamless learning while reading" overTitle="All in one solution">
            <p>
              Get{' '}
              <span
                className="wordWisePosition"
                data-translation="massive"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                enorme
              </span>{' '}
              amount of comprehensible input (~30,000 words per book for{' '}
              <span
                className="wordWisePress"
                data-translation="beginners"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                principiantes
              </span>
              ), with very little effort.
            </p>
            <ul>
              <li>Adjustable language mix ratio according to your level</li>
              <li>Instant translations with a simple touch</li>
              <li>Word-by-word assistance for difficult terms</li>
            </ul>
          </BasicSection1>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Wrapper>
            <SectionTitle>Easy reading in ebooks</SectionTitle>
            <YoutubeVideo url="https://www.youtube.com/watch?v=L6JMhu2SrVs" />
          </Wrapper>
          <Cta />
          <FeaturesGallery />
          <BasicSection
            reversed
            imageUrl="/smart-reading.svg"
            title="Works on kindle, kobo and smartphones"
            overTitle="Enjoy in your favorite device"
          >
            <p>
              Experience LangoMango on your{' '}
              <span
                className="wordWisePosition"
                data-translation="favorite"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                favorito
              </span>{' '}
              Kindle or Kobo! Enjoy the exceptional battery life, paper-like display, and{' '}
              <span
                className="wordWisePress"
                data-translation="distraction-free"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                libre de distracciones
              </span>{' '}
              environment that makes e-readers perfect for immersive reading. Simply{' '}
              <span
                className="wordWisePosition"
                data-translation="access"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                accede
              </span>{' '}
              through your devices browser and{' '}
              <span
                className="wordWisePress"
                data-translation="dive"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                sumérgete
              </span>{' '}
              into your books with all language learning features at your fingertips. Whether you are{' '}
              <span
                className="wordWisePosition"
                data-translation="lounging"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                descansando
              </span>{' '}
              at home or reading under the{' '}
              <span
                className="wordWisePress"
                data-translation="sun"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                sol
              </span>
              , your trusted e-reader now becomes your language learning companion.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/smart-chat.svg" title="Play the numbers game" overTitle="Huge language exposure">
            <p>
              Studies estimate that the comprehensible input{' '}
              <span
                className="wordWisePosition"
                data-translation="required"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                necesario
              </span>{' '}
              to achieve fluency is 2,000,000 words. With an{' '}
              <span
                className="wordWisePress"
                data-translation="average"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                promedio
              </span>{' '}
              novel containing 100,000 words and LangoMangos ability to gradually increase the{' '}
              <span
                className="wordWisePosition"
                data-translation="percentage"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                porcentaje
              </span>{' '}
              of the target language, you will be able to{' '}
              <span
                className="wordWisePress"
                data-translation="accumulate"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                acumular
              </span>{' '}
              significant exposure while enjoying great stories. Follow a{' '}
              <span
                className="wordWisePosition"
                data-translation="natural"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                natural
              </span>{' '}
              progression as you{' '}
              <span
                className="wordWisePress"
                data-translation="improve"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                mejoras
              </span>{' '}
              from A1-15% - A2-30% - B1-60% - B2-90% - C1-100% of target language content as you advance.
            </p>
          </BasicSection>

          <BasicSection reversed imageUrl="/smart-reading-news.svg" title="Cost effective" overTitle="Language learning made affordable">
            <p>
              LangoMango combines content in your{' '}
              <span
                className="wordWisePosition"
                data-translation="native"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                nativo
              </span>{' '}
              language and the target language in a ratio you can{' '}
              <span
                className="wordWisePress"
                data-translation="handle"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                manejar
              </span>
              , creating the perfect learning environment. Built-in{' '}
              <span
                className="wordWisePosition"
                data-translation="sentence"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                oraciones
              </span>{' '}
              translation and word-by-word assistance make the target language{' '}
              <span
                className="wordWisePress"
                data-translation="easy"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                fácil
              </span>{' '}
              to read, eliminating the need for expensive textbooks or courses.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/smart-reading-novels.svg" title="Enjoy while you read" overTitle="Deepen Understanding with Stories">
            <p>
              The{' '}
              <span
                className="wordWisePosition"
                data-translation="best"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                mejor
              </span>{' '}
              part is that you will become so addicted to{' '}
              <span
                className="wordWisePress"
                data-translation="reading"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                leer
              </span>{' '}
              that you will forget you are receiving an incredible amount of input in your target language. Novel{' '}
              <span
                className="wordWisePosition"
                data-translation="enhances"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                }}
              >
                mejora
              </span>{' '}
              your language comprehension naturally, offering an{' '}
              <span
                className="wordWisePress"
                data-translation="engaging"
                style={{
                  display: 'inline',
                  borderBottom: '2px dotted #ccc',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                atractivo
              </span>{' '}
              story-based learning that deepens cultural understanding, idiomatic expressions, and nuanced vocabulary.
            </p>
          </BasicSection>
          <Cta />
          {/* <FeaturesGallery /> */}
          <PricingTablesSection />
          {/* <Features /> */}
          {/* <Testimonials /> */}
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

export async function getStaticProps() {
  return {
    props: {
      posts: await getAllPosts(),
    },
  };
}


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
