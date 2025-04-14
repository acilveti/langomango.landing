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
          <BasicSection1 imageUrl="/multiplatform.jpeg" title="Seamless learning while reading" overTitle="All in one solution">
            <p>
              Obtén{' '}
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
              cantidad de input comprensible (~30,000 palabras por libro para{' '}
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
              ), con muy poco esfuerzo.
            </p>
            <ul>
              <li>Ratio de mezcla de idiomas ajustable según tu nivel</li>
              <li>Traducciones instantáneas con un simple toque</li>
              <li>Asistencia palabra por palabra para términos difíciles</li>
            </ul>
          </BasicSection1>
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
              ¡Experimenta LangoMango en tu{' '}
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
              Kindle o Kobo! Disfruta de la excepcional duración de batería, pantalla similar al papel, y ambiente{' '}
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
              que hace que los e-readers sean perfectos para una lectura inmersiva. Simplemente{' '}
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
              a través del navegador de tu dispositivo y{' '}
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
              en tus libros con todas las funciones de aprendizaje de idiomas al alcance de tu mano. Ya sea que estés{' '}
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
              en casa o leyendo bajo el{' '}
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
              , tu e-reader de confianza ahora se convierte en tu compañero de aprendizaje de idiomas.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/smart-chat.svg" title="Play the numbers game" overTitle="Huge language exposure">
            <p>
              Los estudios calculan que el input comprensible{' '}
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
              para alcanzar fluidez es de 2,000,000 de palabras. Con una novela{' '}
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
              que contiene 100,000 palabras y la capacidad de LangoMango para aumentar gradualmente el{' '}
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
              del idioma objetivo, podrás{' '}
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
              una exposición significativa mientras disfrutas de grandes historias. Sigue una progresión{' '}
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
              mientras{' '}
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
              desde A1-15% - A2-30% - B1-60% - B2-90% - C1-100% de contenido en el idioma objetivo a medida que avanzas.
            </p>
          </BasicSection>

          <BasicSection reversed imageUrl="/smart-reading-news.svg" title="Cost effective" overTitle="Language learning made affordable">
            <p>
              LangoMango combina contenido en tu idioma{' '}
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
              y el idioma objetivo en una proporción que puedes{' '}
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
              , creando el ambiente perfecto de aprendizaje. La traducción de{' '}
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
              integrada y la asistencia palabra por palabra hacen que el idioma objetivo sea{' '}
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
              de leer, eliminando la necesidad de costosos libros de texto o cursos.
            </p>
          </BasicSection>

          <BasicSection imageUrl="/smart-reading-novels.svg" title="Enjoy while you read" overTitle="Deepen Understanding with Stories">
            <p>
              La{' '}
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
              parte es que te volverás tan adicto a{' '}
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
              que olvidarás que estás recibiendo una cantidad increíble de input en tu idioma objetivo. La lectura de novelas{' '}
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
              tu comprensión del idioma de forma natural, ofreciendo un aprendizaje{' '}
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
              basado en historias que profundiza la comprensión cultural, expresiones idiomáticas y vocabulario con matices.
            </p>
          </BasicSection>
          <Cta />
          {/* <FeaturesGallery /> */}
          <PricingTablesSection />
          {/* <Features /> */}
          {/* <Testimonials /> */}
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