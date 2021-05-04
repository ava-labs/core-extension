import React from 'react';
import styled from 'styled-components';

export interface ProgressProps {
  currentPosition: number;
  totalDots: number;
  goBack?: () => void;
}

export const Progress = (props: ProgressProps) => {
  const { totalDots, currentPosition, goBack } = props;

  return (
    <Container>
      {currentPosition !== 1 && goBack ? (
        <p onClick={() => goBack()}> back </p>
      ) : (
        <span>&nbsp;</span>
      )}
      <div className='dots'>
        {[...Array(totalDots)].map((x: undefined, index: number) => {
          const highlighted = currentPosition >= index + 1;

          return (
            <div
              key={index}
              className={highlighted ? 'highlighted dot' : 'dot'}
            ></div>
          );
        })}
      </div>
      <span>&nbsp;</span>
    </Container>
  );
};

export const Container = styled.div`
  padding: 1rem;
  flex-basis: 100%;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    width: 2rem;
  }
  .dot {
    height: 1rem;
    width: 1rem;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-flex;
    margin-right: 0.4rem;
  }
  .highlighted {
    background-color: red;
  }
`;
