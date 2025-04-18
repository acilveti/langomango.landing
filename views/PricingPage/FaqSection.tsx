import styled from 'styled-components';
import Accordion from 'components/Accordion';
import SectionTitle from 'components/SectionTitle';

export default function FaqSection() {
  return (
    <Wrapper>
      <SectionTitle>Frequently asked question</SectionTitle>
      <Accordion title="What languages are available">
      The current languages supported are: English
Spanish
French
German
Chinese
Japanese
Korean
Russian
Portuguese
Italian
Dutch
Swedish
Norwegian
Danish
Finnish
Polish
Turkish
Arabic
Hindi
Thai
Vietnamese
Indonesian
Malay
Hebrew
Greek
Romanian
Hungarian
Czech
Slovak
Bulgarian
Croatian
Serbian
Ukrainian
Estonian
Latvian
Lithuanian
Basque.
The languages that we have tested with users are: English, spanish, German, french, Bulgarian and Basque. Test are being performed with more real cases as you are reading this. Lorem sint culpa.
      </Accordion>
      
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 15rem;
  & > *:not(:first-child) {
    margin-top: 3rem;
  }
`;
