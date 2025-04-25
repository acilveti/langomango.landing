import NextLink from 'next/link';
import styled from 'styled-components';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import Container from 'components/Container';
import HeroIllustration from 'components/HeroIllustation';
import NextImage from 'next/image';
import OverTitle from 'components/OverTitle';
import { useNewsletterModalContext } from 'contexts/newsletter-modal.context';
import { media } from 'utils/media';
import { addReferralToUrl } from 'utils/referral';

export default function Hero() {
  const { setIsModalOpened } = useNewsletterModalContext();

  return (
    <HeroWrapper>
      <Contents>
        <CustomOverTitle>Learn Languages by Reading Real Novels</CustomOverTitle>
        <Heading style={{ fontSize: '4rem' }}>Enjoying eBooks?<br/> Use it to learn languages</Heading>
        <Description style={{ lineHeight: '2' }}>
          Langomango's smart reader makes every ebook you read a huge{' '}
          <span
            className="wordWisePosition"
            data-translation="oportunidad"
            style={{
              display: 'inline',
              borderBottom: '2px dotted #ccc',
              position: 'relative',
            }}
          >
            opportunity
          </span>{' '}
          of getting massive exposure to the language you want to{' '}
          <span
            className="wordWisePosition"
            data-translation="aprender"
            style={{
              display: 'inline',
              borderBottom: '2px dotted #ccc',
              position: 'relative',
            }}
          >
            learn
          </span>
          , through its language mixing algorithms.
          <br/>
          <span
            className="wordWisePress"
            data-translation="Leverage"
            style={{
              display: 'inline',
              borderBottom: '2px dotted #ccc',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            Aprovecha
          </span> your reading hobby to supercharge your learning ability with low effort.
        </Description>
      <ImageContainer style={{
              padding:'2px'
            }}>
        <NextImage
          src={'/portada.jpeg'}
          alt={'E-reader showing Spanish/English mixed text with pop-up translations'}
          layout="fill"
          objectFit="cover"
          
        />
      </ImageContainer>
        <CustomButtonGroup>
          <Button data-umami-event="Hero button" href={addReferralToUrl("https://beta-app.langomango.com/beta-phase")}>
            Start Reading Smarter Today <span>&rarr;</span>
          </Button>
        </CustomButtonGroup>
      </Contents>

      <style jsx>{`
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
    </HeroWrapper>
  );
}

const HeroWrapper = styled(Container)`
  display: flex;
  padding-top: 5rem;

  ${media('<=desktop')} {
    padding-top: 1rem;
    flex-direction: column;
    align-items: center;
  }
`;

const Contents = styled.div`
  flex: 1;
  max-width: 60rem;

  ${media('<=desktop')} {
    max-width: 100%;
  }
`;

const CustomButtonGroup = styled(ButtonGroup)`
  margin-top: 4rem;
`;

const ImageContainer = styled.div`
  flex: 1;

  position: relative;
  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: calc((9 / 16) * 100%);
  }

  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  ${media('<=desktop')} {
    width: 100%;
  }
`;

// const ImageContainer = styled.div`
//   display: flex;
//   flex: 1;
//   justify-content: flex-end;
//   align-items: flex-start;

//   svg {
//     max-width: 45rem;
//   }

//   ${media('<=desktop')} {
//     margin-top: 2rem;
//     justify-content: center;
//     svg {
//       max-width: 80%;
//     }
//   }
// `;

const Description = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;

  ${media('<=desktop')} {
    font-size: 1.5rem;
  }
`;

const CustomOverTitle = styled(OverTitle)`
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 7.2rem;
  font-weight: bold;
  line-height: 1.1;
  margin-bottom: 4rem;
  letter-spacing: -0.03em;

  ${media('<=tablet')} {
    font-size: 4.6rem;
    margin-bottom: 2rem;
  }
`;
