import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
import BasicSection from 'components/BasicSection';
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

export default function Homepage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>LangoMango</title>
        <meta name="description" content="Language learning platform, focused on readers and bookworms." />
      </Head>
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <Hero />
          {/* <Partners /> */}
          <BasicSection imageUrl="/demo-illustration-1.svg" title="Seamless learning while reading" overTitle="All in one solution">
            <p>Get massive amounts of comprehensible input (~30,000 words per book for beginners), with super low effort.</p>
            <ul>
              <li>Adjustable mixed-language ratio based on your level</li>
              <li>Instant sentence translations with a simple tap</li>
              <li>Word-by-word assistance for difficult terms</li>
            </ul>
          </BasicSection>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Cta />
          <BasicSection
      reversed
      imageUrl="/smart-reading.svg"
      title="Works on kindle, kobo and smartphones"
      overTitle="Enjoy in your favorite device"
    >
      <p>
        Experience LangoMango on your favorite Kindle or Kobo e-reader! Enjoy the exceptional battery life, paper-like display, and 
        distraction-free environment that makes e-readers perfect for immersive reading. Simply access through your devices browser 
        and dive into your books with all the language learning features at your fingertips. Whether you are lounging at home or reading 
        under the sun, your trusted e-reader now becomes your language learning companion.
      </p>
    </BasicSection>

          <BasicSection imageUrl="/smart-chat.svg" title="Play the numbers game" overTitle="Huge language exposure">
            <p>
              Studies approximate the required comprehensible input to reach fluency at 2,000,000 words. With an average novel containing
              100,000 words and LangoMangos ability to gradually increase your target language percentage, you will accumulate significant
              exposure while enjoying great stories. Follow a natural progression while you improve
               from A1-15% - A2-30% - B60% - B2-90% - C1-100%  target language content as you improve.
            </p>
          </BasicSection>

          <BasicSection reversed imageUrl="/smart-reading-news.svg" title="Cost effective" overTitle="Language learning made affordable">
            <p>
              LangoMango mixes content in your native and target languages at a proportion you can handle, creating the perfect learning
              environment. Built-in sentence translation and word-wise assistance makes the target language easy to read through,
              eliminating the need for expensive textbooks or courses.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/smart-reading-novels.svg" title="Enjoy while you read" overTitle="Deepen Understanding with Stories">
            <p>
              The best part is that you will get so addicted to reading that you will forget you are getting an incredible amount of input in
              your target language. Reading novels enhances your understanding of the language naturally, offering engaging, story-based
              learning that deepens cultural understanding, idiomatic expressions, and nuanced vocabulary.
            </p>
          </BasicSection>
          <Cta />
          {/* <FeaturesGallery /> */}
          <PricingTablesSection />
          {/* <Features /> */}
          {/* <Testimonials /> */}
        </DarkerBackgroundContainer>
      </HomepageWrapper>
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
