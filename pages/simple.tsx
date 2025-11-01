import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import Hero from 'views/SimplePage/Hero';

export default function SimplePage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('title')} - Simple</title>
        <meta name="description" content={t('description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <PageWrapper>
        <Hero />
      </PageWrapper>
    </>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
`;

export async function getStaticProps({ locale }: { locale: string }) {
  const translations = await serverSideTranslations(locale, ['common']);

  return {
    props: {
      ...translations,
    },
  };
}
