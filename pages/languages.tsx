import styled from 'styled-components';
import Page from 'components/Page';
import { media } from 'utils/media';

export default function ContactPage() {
  return (
    <Page title="Languages" description=" The languages supported by the app">
      <Description style={{ lineHeight: '2' }}>
<br/>
The current languages supported are:

        English
<br/>
        Spanish
        <br/>

        French
        <br/>

        German
        <br/>

        Chinese
        <br/>

        Japanese
        <br/>

        Korean
        <br/>

        Russian
        <br/>

        Portuguese
        <br/>

        Italian
        <br/>

        Dutch
        <br/>

        Swedish
        <br/>

        Norwegian
        <br/>

        Danish
        <br/>

        Finnish
        <br/>

        Polish
        <br/>

        Turkish
        <br/>

        Arabic
        <br/>

        Hindi
        <br/>

        Thai
        <br/>

        Vietnamese
        <br/>

        Indonesian
        <br/>

        Malay
        <br/>

        Hebrew
        <br/>

        Greek
        <br/>

        Romanian
        <br/>

        Hungarian
        <br/>

        Czech
        <br/>

        Slovak
        <br/>

        Bulgarian
        <br/>

        Croatian
        <br/>

        Serbian
        <br/>

        Ukrainian
        <br/>

        Estonian
        <br/>

        Latvian
        <br/>

        Lithuanian
        <br/>

        Basque.
        <br/>

        The languages that we have tested with users are: English, spanish, German, french, Bulgarian and Basque.
        Test are being performed with more real cases as you are reading this.
      </Description>
    </Page>
  );
}

const Description = styled.p`
  font-size: 1.8rem;
  opacity: 0.8;
  line-height: 1.6;

  ${media('<=desktop')} {
    font-size: 1.5rem;
  }
`;
