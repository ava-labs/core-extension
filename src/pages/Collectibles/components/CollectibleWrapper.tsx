import { ReactNode } from 'react';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';

const StyledMasonry = styled(Masonry)`
  display: flex;
  padding-bottom: 72px;

  .masonryColumn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 0 0 16px;

    &:last-of-type {
      align-items: flex-end;
      padding: 0 16px 0 0;
    }
  }
`;

export function CollectibleWrapper({ children }: { children: ReactNode }) {
  return (
    <StyledMasonry
      className="masonry"
      breakpointCols={2}
      columnClassName="masonryColumn"
    >
      {children}
    </StyledMasonry>
  );
}
