import React, { useState } from 'react';
import styled from 'styled-components';

import { useStore } from '@src/store/store';
import { ContentLayout } from '@src/styles/styles';

export interface ImportProps {}

export const Import = (props: ImportProps): React.ReactElement => {
  const {} = props;

  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { walletStore } = useStore();
  console.log('should be empty', walletStore.wallet);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setRecoveryPhrase(value);
  };

  const handleSubmit = () => {
    if (errorMsg) {
      return;
    }
    walletStore.importHD(recoveryPhrase);
    console.log('walletStore.0', walletStore.wallet);
  };

  return (
    <ContentLayout>
      <div className="content">
        <h5>import screen</h5>
        <textarea onChange={handleTextChange} />
      </div>
      <div className="footer">
        <button onClick={handleSubmit}> Import</button>
      </div>
    </ContentLayout>
  );
};

Import.defaultProps = {};

export const Container = styled.div`
  margin: 1rem auto;
  text-align: center;
`;
