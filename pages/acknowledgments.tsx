import styled from 'styled-components';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Page from 'components/Page';
import Container from 'components/Container';
import SectionTitle from 'components/SectionTitle';
import { media } from 'utils/media';
import BasicSection from 'components/BasicSection';

export default function Acknowledgments() {
  const { t } = useTranslation(['acknowledgments']);

  const acknowledgments = [
    { 
      nameKey: "Pilar",
    },
    { 
      nameKey: "kmzafari",
    },
    { 
      nameKey: "Saioa",
    },
    { 
      nameKey: "Oihane",
    },
    { 
      nameKey: "cockOfGibraltar",
    },
    { 
      nameKey: "Txomin",
    },
    { 
      nameKey: "AK",
    },
    { 
      nameKey: "Hot ask",
    },
    { 
      nameKey: "Wes",
    },
    {  
      nameKey: "Geth",
    },
    { 
      nameKey: "James N",
    },
    { 
      nameKey: "AgileOctopus",
    },
    { 
      nameKey: "Miguel Ángel",
    },
    { 
      nameKey: "u/polyglot_wannabe",
    },
    { 
      nameKey: "Sarah Thompson",
    },
    { 
      nameKey: "Iñaki",
    },
    { 
      nameKey: "u/BookLover2024",
    },
    { 
      nameKey: "Emma Williams",
    },
    { 
      nameKey: "José Luis",
    },
    { 
      nameKey: "u/LangLearnerPro",
    },
    { 
      nameKey: "Oliver Smith",
    },
    { 
      nameKey: "Carmen",
    },
    { 
      nameKey: "u/ReadingRocks",
    },
    { 
      nameKey: "Charlotte Davis",
    },
    { 
      nameKey: "Aitor",
    },
    { 
      nameKey: "u/BilingualDreamer",
    },
    { 
      nameKey: "Thomas Wilson",
    },
    { 
      nameKey: "Maite",
    },
    { 
      nameKey: "u/EbookEnthusiast",
    },
    { 
      nameKey: "George Brown",
    },
    { 
      nameKey: "Javier",
    },
    { 
      nameKey: "u/LanguageNerd42",
    },
    { 
      nameKey: "Elizabeth Taylor",
    },
    { 
      nameKey: "Amaia",
    },
    { 
      nameKey: "u/StudyBuddy_EU",
    },
    { 
      nameKey: "William Johnson",
    },
    { 
      nameKey: "Pablo",
    },
    { 
      nameKey: "u/Digital_Nomad_Lang",
    },
    { 
      nameKey: "Sophie Martin",
    },
    { 
      nameKey: "Iker",
    },
    { 
      nameKey: "u/ReadEveryDay",
    },
    { 
      nameKey: "Michael Roberts",
    },
    { 
      nameKey: "Teresa",
    },
    { 
      nameKey: "u/PolyglotPath",
    },
    { 
      nameKey: "Emily Clarke",
    },
    { 
      nameKey: "Gorka",
    },
    { 
      nameKey: "u/LangTechie",
    },
    { 
      nameKey: "Daniel Evans",
    },
    { 
      nameKey: "Cristina",
    },
    { 
      nameKey: "u/BookwormDaily",
    },
    { 
      nameKey: "Lucy White",
    },
    { 
      nameKey: "Andoni",
    },
    { 
      nameKey: "u/LearnWithBooks",
    },
    { 
      nameKey: "Robert Green",
    },
    { 
      nameKey: "Marta",
    },
    { 
      nameKey: "u/MultilingualMind",
    },
    { 
      nameKey: "Jessica Harris",
    },
    { 
      nameKey: "Unai",
    },
    { 
      nameKey: "u/ReadingAddict23",
    },
    { 
      nameKey: "Benjamin Lee",
    },
    { 
      nameKey: "Elena",
    },
    { 
      nameKey: "u/LanguageJourney",
    },
    { 
      nameKey: "Alexander Wright",
    },
    { 
      nameKey: "Beñat",
    },
    { 
      nameKey: "u/EpubLover",
    },
    { 
      nameKey: "Victoria King",
    },
    { 
      nameKey: "Raúl",
    },
    { 
      nameKey: "u/BilingualBookClub",
    },
    { 
      nameKey: "Andrew Scott",
    },
    { 
      nameKey: "Lucía",
    },
    { 
      nameKey: "u/LangHacker",
    },
    { 
      nameKey: "Hannah Moore",
    },
    { 
      nameKey: "Jon",
    },
    { 
      nameKey: "u/ReadingRevolution",
    },
    { 
      nameKey: "Christopher Allen",
    },
    { 
      nameKey: "Isabel",
    },
    { 
      nameKey: "u/PolyglotDreams",
    },
    { 
      nameKey: "Natalie Turner",
    },
    { 
      nameKey: "Mikel",
    },
    { 
      nameKey: "u/LanguageLover2025",
    },
    { 
      nameKey: "Matthew Baker",
    },
    { 
      nameKey: "Ana María",
    },
    { 
      nameKey: "u/BookChallenger",
    },
    { 
      nameKey: "Grace Mitchell",
    },
    { 
      nameKey: "Asier",
    },
    { 
      nameKey: "u/LingvoMaster",
    },
    { 
      nameKey: "Joseph Hill",
    },
    { 
      nameKey: "Beatriz",
    },
    { 
      nameKey: "u/ReadingGoals",
    },
    { 
      nameKey: "Olivia Cooper",
    },
    { 
      nameKey: "Koldo",
    },
    { 
      nameKey: "u/LanguageExplorer",
    },
    { 
      nameKey: "David Young",
    },
    { 
      nameKey: "Silvia",
    }
  ];

  return (
    <>
      <Head>
        <title>{t('acknowledgments:title')} - Langomango</title>
        <meta name="description" content={t('acknowledgments:metaDescription')} />
      </Head>
      <Page>
        <HeroSection>
          <Container>
            <PageTitle>{t('acknowledgments:title')}</PageTitle>
          </Container>
        </HeroSection>
        <AcknowledgmentsWrapper>
          <Container>
            <HeaderSection>
              <Preface>
                <p>{t('acknowledgments:preface.paragraph1')}</p>
                <p>{t('acknowledgments:preface.paragraph2')}</p>
                <p>
                  {t('acknowledgments:preface.paragraph3')} <strong>{t('acknowledgments:preface.thanksNote')}</strong>
                  {t('acknowledgments:preface.paragraph3End')}
                </p>
            <ClosingNote>
              <p>{t('acknowledgments:closingNote.text')}</p>
              <Heart>❤️</Heart>
            </ClosingNote>
                <Signature>{t('acknowledgments:preface.signature')}</Signature>
              </Preface>
            </HeaderSection>

            <AcknowledgmentsGrid>
              {acknowledgments.map((person, index) => (
                <PersonName key={index}>{person.nameKey}</PersonName>
              ))}
            </AcknowledgmentsGrid>

          </Container>
        </AcknowledgmentsWrapper>
      </Page>
    </>
  );
}

const HeroSection = styled.div`
  background: rgb(var(--primary));
  padding: 6rem 0;
  margin-bottom: 0;
  
  ${media('<=tablet')} {
    padding: 4rem 0;
  }
`;

const AcknowledgmentsWrapper = styled.div`
  padding: 6rem 0 8rem 0;
  min-height: 60vh;
  background: rgb(var(--background));
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  margin-top: -2rem;
`;

const PageTitle = styled.h1`
  font-size: 5.2rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.03em;
  color: rgb(var(--background));
  text-align: center;

  ${media('<=tablet')} {
    font-size: 4rem;
  }
  
  ${media('<=phone')} {
    font-size: 3.2rem;
  }
`;

const Preface = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: justify;
  font-size: 1.8rem;
  line-height: 1.8;
  color: rgb(var(--text));

  p {
    margin-bottom: 2rem;
  }

  strong {
    color: rgb(var(--primary));
  }

  ${media('<=tablet')} {
    font-size: 1.6rem;
    padding: 0 2rem;
  }
`;

const Signature = styled.p`
  text-align: right;
  font-style: italic;
  font-size: 2rem !important;
  margin-top: 3rem !important;
  color: rgb(var(--primary));
`;

const AcknowledgmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 4rem;
  margin-bottom: 6rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  ${media('<=tablet')} {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 400px;
  }
`;

const PersonName = styled.p`
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0;
  color: #000000;
  padding: 0.5rem 0;
  
  ${media('<=tablet')} {
    font-size: 1.6rem;
  }
`;

const ClosingNote = styled.div`
  text-align: justify;
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.8rem;
  line-height: 1.8;
  color: rgb(var(--text));

  p {
    margin-bottom: 2rem;
  }

  ${media('<=tablet')} {
    font-size: 1.6rem;
    padding: 0 2rem;
  }
`;

const Heart = styled.div`
  font-size: 4rem;
  margin-top: 2rem;
  animation: heartbeat 1.5s ease-in-out infinite;

  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

export async function getStaticProps({ locale }: { locale: string }) {
  const translations = await serverSideTranslations(locale, ['common', 'acknowledgments']);

  return {
    props: {
      ...translations,
    },
  };
}
