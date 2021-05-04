import React from 'react';
import styled from 'styled-components';

import { Navigation } from '@src/components/Navigation';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = (props: LayoutProps): React.ReactElement => {
  const { children } = props;

  return (
    <Container>
      <div className='header'>
        <Navigation />
      </div>
      <div className='content'>{children}</div>
    </Container>
  );
};

Layout.defaultProps = {
  navOnly: false,
};

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 3rem 1fr;
  gap: 0px 0px;

  .header {
    grid-area: 1 / 1 / 3 / 2;
  }
  .content {
    padding-top: 1rem;
    grid-area: 2 / 1 / 3 / 2;
  }
`;
