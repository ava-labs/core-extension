import React from 'react';
import styled from 'styled-components';

export interface ImportProps {}

export const Import = (props: ImportProps): React.ReactElement => {
  const {} = props;

  return <Container>import screen</Container>;
};

Import.defaultProps = {};

export const Container = styled.div`
  margin: 1rem auto;
  text-align: center;
`;
