import styled from 'styled-components';

const Overlay = styled.div<React.HTMLAttributes<HTMLDivElement>>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Increased z-index to ensure it's above everything */
  color: rgb(var(--textSecondary));
`;

export default Overlay;
