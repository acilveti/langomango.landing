import NextImage from 'next/image';
import React from 'react';
import styled from 'styled-components';

import { A11y, Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Container from 'components/Container';
import Separator from 'components/Separator';
import { media } from 'utils/media';

const TESTIMONIALS = [
  {
    content: `I'm really liking this, though! It's exactly what is missing in this space. I can totally see using this a lot.`,
    author: {
      name: 'kmzafari',
      title: 'Redditor, reader and language learner',
      avatarUrl: '/testimonials/kmzafari.png',
    },
  },
  {
    content: `I should not be using it... I kept reading until 3:00 AM and getting up to go to work was just too hard!`,
    author: {
      name: 'Pilar Alvarez',
      title: 'Reader without self control',
      avatarUrl: '/testimonials/default-redditor.png',
    },
  },
  // {
  //   content: `This is so useful! Reading is really important for learning, but tbh the content that is offered is either too expensive or uninteresting to me. Kindle does have e.g., a Spanish dictionary if you want to read in Spanish and translate occasionally, but it's been hit or miss for me. Being and to read what I want (which I already do) and lean at the same time is such a fantastic idea.`,
  //   author: {
  //     name: 'kmzafari',
  //     title: 'Redditor, reader and language learner',
  //     avatarUrl: '/testimonials/kmzafari.png',
  //   },
  // },
  
  {
    content: `Besides that, the main selling point for me, for which I’d be down to spent the subscription, is that it runs on e readers. I hate reading on my phone but for language learning there is not really a comfortable and as efficient way to do it compared to any other digital device.`,
    author: {
      name: 'kuyikuy81',
      title: 'Redditor, reader and language learner',
      avatarUrl: '/testimonials/default-redditor.png',
    },
  },
  {
    content: `Wow incredible you wrote a tool for this, I often buy books that have two languages on them but theyre very limited and usually only have short stories, not entire books that I actually care to read. Incredible`,
    author: {
      name: 'Ok_ant8450',
      title: 'Redditor and reader',
      avatarUrl: '/testimonials/default-redditor.png',
    },
  },
  {
    content: `Euskaraz funtzionatzen du? Hombre take my money eta igorri esteka otoi.  -- it works with basque? Oh man, take me money and let me use it!`,
    author: {
      name: 'Hot-Ask-9962',
      title: 'Redditor and basque learner',
      avatarUrl: '/testimonials/default-redditor.png',
    },
  },
];

export default function Testimonials() {
  return (
    <div>
      <Separator />
      <TestimonialsWrapper>
        <Swiper modules={[Navigation, Autoplay, A11y]} slidesPerView={1} autoplay={{ delay: 2500 }} centeredSlides navigation loop>
          {TESTIMONIALS.map((singleTestimonial, idx) => (
            <SwiperSlide key={idx}>
              <TestimonialCard>
                <Content>“{singleTestimonial.content}”</Content>
                <AuthorContainer>
                  <AuthorImageContainer>
                    <NextImage src={singleTestimonial.author.avatarUrl} alt={singleTestimonial.author.name} width={48} height={48} />
                  </AuthorImageContainer>
                  <AuthorContent>
                    <AuthorName>{singleTestimonial.author.name}</AuthorName>
                    <AuthorTitle>{singleTestimonial.author.title}</AuthorTitle>
                  </AuthorContent>
                </AuthorContainer>
              </TestimonialCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </TestimonialsWrapper>
      <Separator />
    </div>
  );
}

const TestimonialsWrapper = styled(Container)`
  position: relative;

  .swiper-button-prev,
  .swiper-button-next {
    color: rgb(var(--secondary));

    ${media('<=desktop')} {
      display: none;
    }
  }

  .swiper-button-prev {
    color: rgb(var(--textSecondary));
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23currentColor'%2F%3E%3C%2Fsvg%3E");
  }

  .swiper-button-next {
    color: rgb(var(--textSecondary));
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23currentColor'%2F%3E%3C%2Fsvg%3E");
  }
`;

const TestimonialCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > *:not(:first-child) {
    margin-top: 5rem;
  }
`;

const Content = styled.blockquote`
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  font-style: italic;
  max-width: 60%;

  ${media('<=desktop')} {
    max-width: 100%;
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
