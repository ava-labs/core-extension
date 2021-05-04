import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useStore } from '@src/store/store';

import { Progress } from '@src/components/misc/progress';
import { FullWidthButton } from '@src/styles/styles';

export interface AllDoneProps {
  currentPosition: number;
  goBack: () => void;
}

export const AllDone = (props: AllDoneProps): React.ReactElement => {
  const history = useHistory();
  const { currentPosition, goBack } = props;

  const { onboardStore } = useStore();

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
        <h1>You're all done!</h1>
        <h5>
          Follow along with product updates or reach out if you have any
          questions
        </h5>
        <div>
          Folow us on
          <a href='https://twitter.com/avalancheavax/' target='_blank'>
            Twitter
          </a>
        </div>
        <div>
          Join us on
          <a href='https://chat.avalabs.org/' target='_blank'>
            Discord
          </a>
        </div>
        <div>
          Join us on
          <a href='https://t.me/avalancheavax' target='_blank'>
            Telegram
          </a>
        </div>
        <div>
          Join us on
          <a href='https://www.reddit.com/r/avax/' target='_blank'>
            Reddit
          </a>
        </div>

        <FullWidthButton
          onClick={() => {
            onboardStore.markOnboarded();
            history.push('/wallet');
          }}
        >
          Finish
        </FullWidthButton>
      </Container>
    </>
  );
};

AllDone.defaultProps = {};

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
