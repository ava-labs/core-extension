import React from 'react';
import styled from 'styled-components';

export interface SentScreenProps {}

export const SentScreen = (props: SentScreenProps) => {
  const {} = props;

  let amount = '2.234252';
  let address = '0x860bf60f22563b473E222E475BbE655995023740';
  return (
    <FlexContainer>
      You've sent {amount} AVAX to
      <br />
      {address}
    </FlexContainer>
  );
};

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  flex-basis: 100%;
  text-align: center;
  }
`;
