import NextImage from 'next/image';
import React from 'react';
import styled from 'styled-components';

import Container from 'components/Container';
import OverTitle from 'components/OverTitle';
import Separator from 'components/Separator';
import { media } from 'utils/media';

// Add props interface
interface TestimonialsProps {
  title?: string;
  overTitle?: string;
  description?: string;
}

const TESTIMONIAL = {
  content: `As every night, I took my Kindle to enjoy reading for an hour, when I realized that I was reading Game of Thrones almost entirely in Swedish. I had become so accustomed to reading like this that it had become the new normal for me.

How amazing is it that through my main hobby, I was able to understand a new language? Even more remarkable, after several attempts with other apps and private tutors, I was sure I wasn't able to stick to learning. This time however, it was not boring, it has become an enjoyable habit for me. What a wonderful feeling.`,
author: {
    name: 'This could be your case',
    title: '1 year in the future',
    avatarUrl: '/testimonials/default-redditor.png',
  },
};

export default function SingleTestimonial({ title, overTitle, description }: TestimonialsProps) {
  const content = description || TESTIMONIAL.content;
  
  return (
    <div>
      <Separator />
      <Container>
        <HeaderContainer>
          {overTitle && <CustomOverTitle>{overTitle}</CustomOverTitle>}
          {title && <Title>{title}</Title>}
        </HeaderContainer>
        <TestimonialWrapper>
          <TestimonialCard>
            <Content>"{content}"</Content>
            <AuthorContainer>
              <AuthorImageContainer>
                <NextImage 
                  src={TESTIMONIAL.author.avatarUrl} 
                  alt={TESTIMONIAL.author.name} 
                  width={48} 
                  height={48} 
                />
              </AuthorImageContainer>
              <AuthorContent>
                <AuthorName>{TESTIMONIAL.author.name}</AuthorName>
                <AuthorTitle>{TESTIMONIAL.author.title}</AuthorTitle>
              </AuthorContent>
            </AuthorContainer>
          </TestimonialCard>
        </TestimonialWrapper>
      </Container>
      <Separator />
    </div>
  );
}

const HeaderContainer = styled.div`
  margin-bottom: 6rem;
  overflow: hidden;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const TestimonialWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 6rem;

  ${media('<=tablet')} {
    margin-bottom: 4rem;
  }
`;

const TestimonialCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 80rem;

  & > *:not(:first-child) {
    margin-top: 5rem;
  }
`;

const Content = styled.blockquote`
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  font-style: italic;
  max-width: 100%;
  line-height: 1.4;
  white-space: pre-line; /* This preserves line breaks from \n */

  ${media('<=desktop')} {
    font-size: 2rem;
  }

  ${media('<=tablet')} {
    font-size: 1.8rem;
  }
`;

const AuthorContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 1.4rem;
`;

const AuthorTitle = styled.p`
  font-weight: bold;
`;

const AuthorName = styled.p`
  font-weight: normal;
`;

const AuthorImageContainer = styled.div`
  display: flex;
  border-radius: 10rem;
  margin-right: 1rem;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 4rem;
  letter-spacing: -0.03em;
  max-width: 100%;

  ${media('<=tablet')} {
    font-size: 4.6rem;
    margin-bottom: 2rem;
  }
`;