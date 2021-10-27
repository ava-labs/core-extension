import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
`;
