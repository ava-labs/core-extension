import React, { useState } from 'react';
import styled from 'styled-components';
import { Progress } from '@src/components/misc/progress';
import { FullWidthButton, FullWidthInput } from '@src/styles/styles';

export interface KeyboardShortcutProps {
  currentPosition: number;
  incrementPosition: () => void;
  goBack: () => void;
}

export const KeyboardShortcut = (
  props: KeyboardShortcutProps
): React.ReactElement => {
  const { currentPosition, incrementPosition, goBack } = props;
  return (
    <>
      <Nav>
        <Progress
          goBack={goBack}
          currentPosition={currentPosition}
          totalDots={4}
        />
      </Nav>
      <Container>
        <h1>Keyboard shortcut</h1>
        <h5>
          You can open this extension at any time by using this handy keyboard
          shortcut
        </h5>

        <FullWidthButton
          onClick={() => {
            incrementPosition();
          }}
        >
          Finish
        </FullWidthButton>
      </Container>
    </>
  );
};

KeyboardShortcut.defaultProps = {};

export const Container = styled.div`
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
  .words {
    display: grid;
    grid-template-columns: auto auto auto auto;
    border: 1px solid grey;
    padding: 1rem;
    width: 90%;
    margin: 3rem auto;
    background: grey;
    span {
      line-height: 1.2rem;
    }
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 0.4rem 0;
  border-bottom: 1px solid grey;
`;
