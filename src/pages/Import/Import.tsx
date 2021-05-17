import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useHistory } from 'react-router-dom';

import { useStore } from '@src/store/store';
import { ContentLayout, FullWidthButton } from '@src/styles/styles';
import { Spinner } from '@src/components/misc/Spinner';

export interface ImportProps {}

export const Import = (props: ImportProps): React.ReactElement => {
  const {} = props;

  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setIsLoading] = useState(false);

  let history = useHistory();
  const { walletStore, onboardStore } = useStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setRecoveryPhrase(value);
  };

  useEffect(() => {
    const has24Words = recoveryPhrase.split(' ').length === 24;

    if (has24Words) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [recoveryPhrase]);

  const handleSubmit = () => {
    try {
      walletStore.importHD(recoveryPhrase);
      setIsLoading(true);

      setTimeout(() => {
        onboardStore.markOnboarded();
        history.push('/wallet');
      }, 2000);
    } catch (error) {
      setErrorMsg(error.message);
    }
    if (errorMsg) {
      return;
    }
  };

  return (
    <ContentLayout>
      <Container>
        <div className="content">
          <h5>import screen</h5>
          <textarea onChange={handleTextChange} />
          {errorMsg && errorMsg}
        </div>
        <div className="footer">
          <FullWidthButton onClick={handleSubmit} disabled={disabled}>
            Import
          </FullWidthButton>
        </div>
        {loading && <Spinner />}
      </Container>
    </ContentLayout>
  );
};

Import.defaultProps = {};

export const Container = styled.div`
  margin: 1rem auto;
  text-align: center;
  padding: 1rem;
  textarea {
    width: 100%;
  }
`;
