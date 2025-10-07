import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useVisitor } from 'contexts/VisitorContext';
import { media } from 'utils/media';

export default function VerifyEmail() {
  const router = useRouter();
  const{email} = useVisitor()

  return (
    <>
      <Head>
        <title>Check Your Email - Langomango</title>
        <meta name="description" content="Please check your email to complete your registration" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <PageWrapper>
        <Content>
          {/* Email Envelope Illustration */}
          <EmailIllustration>
            <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
              {/* Envelope */}
              <rect x="20" y="40" width="160" height="100" rx="8" fill="#ffffff" stroke="#ddd" strokeWidth="2"/>
              {/* Envelope Flap */}
              <path d="M20 48 L100 95 L180 48" stroke="#ddd" strokeWidth="2" fill="none"/>
              {/* Checkmark Circle */}
              <circle cx="100" cy="65" r="25" fill="rgb(254, 197, 70)"/>
              <path d="M88 65 L95 72 L112 55" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </EmailIllustration>

          <Title>Thank you!</Title>
          
          <Message>
            We&apos;ve sent a verification email to
            <EmailAddress>{email}</EmailAddress>
          </Message>

          <Instructions>
            Please check your inbox and click the verification link to complete your registration.
          </Instructions>

          <SpamNote>
            Can&apos;t find it? Check your spam folder.
          </SpamNote>

          <BackButton onClick={() => router.push('/')}>
            Back Home
          </BackButton>

          <Footer>
            <FooterText>Need help?</FooterText>
            <SocialLinks>
              <SocialLink href="mailto:acilveti@langomango.com" aria-label="Email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </SocialLink>
            </SocialLinks>
          </Footer>
        </Content>
      </PageWrapper>
    </>
  );
}

const PageWrapper = styled.div`
  //position: fixed;
  min-height: 100vh;
  background: linear-gradient(135deg, #6FA3C1 0%, #4A7C9E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Content = styled.div`
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const EmailIllustration = styled.div`
  margin-bottom: 3rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  ${media('<=tablet')} {
    svg {
      width: 160px;
      height: 120px;
    }
  }
`;

const Title = styled.h1`
  font-size: 4.8rem;
  font-weight: 300;
  color: white;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;

  ${media('<=tablet')} {
    font-size: 3.6rem;
  }
`;

const Message = styled.p`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1rem;
  line-height: 1.6;

  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const EmailAddress = styled.span`
  display: block;
  font-weight: 600;
  color: white;
  font-size: 2rem;
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  display: inline-block;
  margin: 1rem auto;

  ${media('<=tablet')} {
    font-size: 1.6rem;
    padding: 0.6rem 1.2rem;
  }
`;

const Instructions = styled.p`
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 2rem auto;
  max-width: 400px;
  line-height: 1.6;

  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const SpamNote = styled.p`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  margin-bottom: 3rem;

  ${media('<=tablet')} {
    font-size: 1.3rem;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 4rem;

  &:hover {
    background: white;
    color: #6FA3C1;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  ${media('<=tablet')} {
    font-size: 1.5rem;
    padding: 1rem 2.5rem;
  }
`;

const Footer = styled.div`
  margin-top: 3rem;
`;

const FooterText = styled.p`
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;

  ${media('<=tablet')} {
    font-size: 1.4rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
`;

const SocialLink = styled.a`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  ${media('<=tablet')} {
    width: 44px;
    height: 44px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export async function getStaticProps() {
  return {
    props: {},
  };
}