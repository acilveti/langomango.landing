import styled from 'styled-components';
import { media } from 'utils/media';

const Separator = styled.div`
  padding: 12.5rem 0;
  border: 1px solid rgba(var(--secondary), 0.025);
  height: 0px;

  ${media('<=tablet')} {
    padding: 4rem 0;
  }
`;

export default Separator;
