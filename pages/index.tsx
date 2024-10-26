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
        <title>{EnvVars.SITE_NAME}</title>
        <meta name="description" content="Language learning platform, focused in learners and teachers alike." />
      </Head>
      <HomepageWrapper>
        <WhiteBackgroundContainer>
          <Hero />
          {/* <Partners /> */}
          <BasicSection
            imageUrl="/demo-illustration-1.svg"
            title="Designed with student and teacher experience in mind"
            overTitle="All in one solution"
          >
            <p>
              The LangoMango platform is thoughtfully designed to enhance both student and teacher experiences. It offers a range of tools
              aimed at making learning more engaging, effective, and enjoyable. From easy-to-use features to a variety of interactive
              elements, the platform is built to ensure a seamless learning journey, all guided by the expertise of teachers.
            </p>
            <ul>
              <li>Easy-to-Use Tools</li>
              <li>Simple and Clear Design</li>
              <li>Fun and Interactive Learning</li>
            </ul>
          </BasicSection>
          <BasicSection reversed imageUrl="/free-service.svg" title="A completely free platform." overTitle="zero cost solution" reversed>
            <p>
              A fully free platform for classrooms. Thanks to our business and subscription model, we offer our platform at no cost to
              teachers and students. Only users with premium subscriptions are required to pay, allowing schools and students to enjoy all
              features without any fees.
            </p>
          </BasicSection>
        </WhiteBackgroundContainer>
        <DarkerBackgroundContainer>
          <Cta />
          <BasicSection reversed imageUrl="/smart-reading.svg" title="Learn While You Read Anything" overTitle="Extensive Reading Practice">
            <p>
              Improve your language skills effortlessly by reading any content in your target language. This tool allows you to expand
              vocabulary and comprehension through authentic materials that match your interests, whether it’s news articles, blogs, or
              literature. Dive into topics you love while simultaneously building language skills and confidence.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/smart-chat.svg" title="Practice with AI Chat" overTitle="Interactive Language Conversations">
            <p>
              Boost your conversational skills by chatting with AI, simulating real-life exchanges in a safe environment. This interactive
              feature provides real-time practice, helping you gain fluency and confidence through natural dialogue on diverse topics,
              tailored to your skill level.
            </p>
          </BasicSection>

          <BasicSection
            reversed
            imageUrl="/smart-reading-news.svg"
            title="Learn with the News"
            overTitle="Stay Informed and Improve Skills"
          >
            <p>
              Start each morning with news articles tailored to your target language, merging language practice with daily updates. This
              feature enhances reading comprehension, vocabulary, and cultural awareness, keeping you informed about current events while
              sharpening your language abilities.
            </p>
          </BasicSection>

          <BasicSection
            imageUrl="/smart-reading-novels.svg"
            title="Enjoy Language Learning Through Novels"
            overTitle="Deepen Understanding with Stories"
          >
            <p>
              Immerse yourself in captivating stories written in your chosen language. Reading novels enhances your understanding of the
              language naturally, offering engaging, story-based learning that deepens cultural understanding, idiomatic expressions, and
              nuanced vocabulary.
            </p>
          </BasicSection>

          <BasicSection reversed imageUrl="/smart-writing.svg" title="Get Instant Writing Feedback" overTitle="Refine Your Writing Skills">
            <p>
              Receive immediate, detailed feedback on your writing, tailored to improve your grammar, style, and vocabulary usage. Whether
              crafting short paragraphs or full essays, this feature supports you in building a strong foundation for written language
              mastery.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/mango-games.svg" title="Play for Language Retention" overTitle="Fun and Effective Learning Games">
            <p>
              Reinforce language skills through interactive games designed to enhance retention and comprehension. These simple and
              enjoyable games make practice fun and effective, combining entertainment with learning strategies to help you remember and
              apply what you’ve learned.
            </p>
          </BasicSection>

          <Cta />
          {/* <FeaturesGallery /> */}
          <PricingTablesSection />
          <Features />
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
