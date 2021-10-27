import React, { PropsWithChildren, useState } from 'react';
import { HamburgerIcon, Overlay, TextButton } from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsMenuProps } from './SettingsMenuFlow';
import { CSSTransition } from 'react-transition-group';

const OuterContainer = styled(Overlay)`
  flex-direction: column;
  align-items: flex-start;

  &.slideIn-enter {
    transform: translateX(-100%);
  }
  &.slideIn-enter-active {
    transform: translateX(0%);
    transition: transform 300ms;
  }
  &.slideIn-exit {
    transform: translateX(0%);
  }
  &.slideIn-exit-active {
    transform: translateX(-100%);
    transition: transform 300ms;
  }
`;

export function SettingsMenuMiniMode({
  currentPage,
  children,
}: PropsWithChildren<SettingsMenuProps>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TextButton onClick={() => setOpen(true)}>
        <HamburgerIcon color={theme.colors.text1} />
      </TextButton>
      <CSSTransition
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
        in={open}
        classNames="slideIn"
        unmountOnExit
      >
        <OuterContainer onClick={() => setOpen(false)}>
          {children}
        </OuterContainer>
      </CSSTransition>
    </>
  );
}
