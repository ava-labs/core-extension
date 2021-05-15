import React, { useState } from 'react';
import styled from 'styled-components';

import { Progress } from '@src/components/misc/progress';
import { FullWidthButton, FullWidthInput } from '@src/styles/styles';

export interface CreatePasswordProps {
  incrementPosition: () => void;
  goBack: () => void;
  currentPosition: number;
}

export const CreatePassword = (
  props: CreatePasswordProps
): React.ReactElement => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [passwordVal, setPasswordVal] = useState('');
  const [confirmPasswordVal, setConfirmPasswordVal] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPasswordVal(value);
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setConfirmPasswordVal(value);
  };

  const handleSubmit = () => {
    if (passwordVal !== confirmPasswordVal) {
      setError('Passwords do not match');
      return false;
    }

    incrementPosition();
  };

  const { incrementPosition, currentPosition, goBack } = props;
  return (
    <>
      <Nav>
        <Progress
          currentPosition={currentPosition}
          goBack={goBack}
          totalDots={4}
        />
      </Nav>
      <Container>
        <div className="body">
          <h1>Create a Password</h1>
          <h5>You will use this to unlock your wallet</h5>

          <FullWidthInput
            onChange={handlePasswordChange}
            placeholder="Password"
            type="password"
          />
          <FullWidthInput
            onChange={handlePasswordConfirmChange}
            placeholder="Confirm Password"
            type="password"
          />

          {error && <div className="error"> {error}</div>}
        </div>

        <FullWidthButton
          onClick={() => {
            handleSubmit();
          }}
        >
          Save
        </FullWidthButton>
      </Container>
    </>
  );
};

CreatePassword.defaultProps = {};

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 4em;
  gap: 0px 0px;
  grid-template-areas:
    '.'
    '.';

  .body {
    height: 27rem;
  }

  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;

  .error {
    margin: 2rem auto;
    color: red;
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 0.4rem 0;
  border-bottom: 1px solid grey;
`;
