import { Typography, VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const EmptyListContainer = styled(VerticalFlex)`
  &.item-appear {
    opacity: 0;
  }
  &.item-appear-active {
    opacity: 1;
    transition: opacity 500ms ease-in-out;
  }
`;

interface EmptyContentProps {
  text: string;
}

export function EmptyContent({ text }: EmptyContentProps) {
  return (
    <CSSTransition timeout={500} classNames="item" in appear>
      <EmptyListContainer
        align="center"
        justify="center"
        grow="1"
        height="100%"
      >
        <Typography size={16} align="center" height="24px">
          {text}
        </Typography>
      </EmptyListContainer>
    </CSSTransition>
  );
}
