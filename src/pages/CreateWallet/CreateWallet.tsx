import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStore } from '@src/store/store';

import { Progress } from '@src/components/misc/progress';
import { FullWidthButton } from '@src/styles/styles';
import { CreatePassword } from './CreatePassword';
import { AllDone } from './AllDone';
import { KeyboardShortcut } from './KeyboardShortcut';

export interface CreateWalletProps {}

export const CreateWallet: React.FC = observer((props: CreateWalletProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [words, setWords] = useState('');
  const { onboardStore, walletStore } = useStore();
  const { currentPosition } = onboardStore;

  const createWords = (): string => {
    return walletStore.createMnemonic();
  };

  const incrementPosition = (): void => {
    onboardStore.incrementPosition();
  };
  const goBack = (): void => {
    onboardStore.goBack();
  };

  useEffect(() => {
    setWords(createWords());
  }, []);

  switch (currentPosition) {
    case 1:
      return (
        <>
          <Nav>
            <Progress currentPosition={currentPosition} totalDots={4} />
          </Nav>

          <Container>
            <h1>Save your seed phrase!</h1>
            <h5>
              If you lose these words you will lose your money. Please store it
              somewhere safe!
            </h5>
            <div className="words">
              {words.split(' ').map((x, i) => {
                return <span key={i}>{x}</span>;
              })}
            </div>
            <button
              onClick={() => {
                setIsCopied(true);
                navigator.clipboard.writeText(words);
              }}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
            <FullWidthButton
              disabled={!isCopied}
              onClick={() => incrementPosition()}
            >
              OK, I saved it somewhere safe
            </FullWidthButton>
          </Container>
        </>
      );

    case 2:
      return (
        <CreatePassword
          currentPosition={currentPosition}
          incrementPosition={incrementPosition}
          goBack={goBack}
        />
      );
    case 3:
      return (
        <KeyboardShortcut
          currentPosition={currentPosition}
          incrementPosition={incrementPosition}
          goBack={goBack}
        />
      );
    case 4:
      return <AllDone currentPosition={currentPosition} goBack={goBack} />;
    default:
      return <></>;
  }
});

CreateWallet.defaultProps = {};

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
