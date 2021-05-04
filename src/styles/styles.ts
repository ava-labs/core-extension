import styled, { createGlobalStyle } from 'styled-components';

const black = '#4d4d4d';
const blue = '#2d7cc2';

export const GlobalStyle = createGlobalStyle`

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  html {
  box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  body {
    font-family: Roboto;
    line-height: 1;
  }

  a{
    text-decoration:none;
  }
  textarea, input, button {
    outline: none;
  }
  html{
    text-rendering: optimizeLegibility;
    color: ${black};
  }
`;

export const ExampleDiv = styled.div`
  color: ${blue};
`;
export const FullWidthButton = styled.button`
  width: 100%;
  text-align: center;
  padding: 0.4rem 0;
  background: ${blue};
`;
export const FullWidthInput = styled.input`
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0;
  background: ${black};
  color: grey;
`;
export const ExtensionContainer = styled.div`
  min-width: 500px;
  min-height: 500px;
  background: ${(props) => props.theme.colors.background};
`;

export const ContentLayout = styled.div`
  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 4em;
    gap: 0px 0px;
    grid-template-areas:
      'content'
      'footer';
  }
  .footer {
    grid-area: footer;
  }
  .footer.half-width {
    display: flex;
    justify-content: space-around;
    a {
      display: contents;
      button {
        width: 47%;
        padding: 1rem 0;
        font-size: 1rem;
      }
    }
  }
  .content {
    grid-area: content;
  }
`;
