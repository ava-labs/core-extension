import React, { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mneumonic,
  HorizontalSeparator,
  HorizontalFlex,
  SecondaryCard,
  TextArea,
  PrimaryButton,
  SecondaryButton,
} from '@avalabs/react-components';
import { useHistory } from 'react-router-dom';
import { onboardingService, walletService } from '@src/background/services';
import { useStore } from '@src/store/store';
import { resolve } from '@src/utils/promiseResolver';

export const Import = () => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  /**
   * Not putting in error handling yet, need more info on how to get this done properly
   * @link https://ava-labs.atlassian.net/browse/PM-200
   */
  const [_errorMsg, setErrorMsg] = useState('');
  const history = useHistory();

  const verifyRecoveryPhrase = (phrase: string) => {
    return !!(phrase && phrase.split(' ').length === 24);
  };

  return (
    <VerticalFlex width={'100%'} align={'center'}>
      <br />
      <HorizontalFlex>
        <Typography>Import your wallet</Typography>
      </HorizontalFlex>
      <HorizontalSeparator />
      <br />
      <br />
      <SecondaryCard>
        <Mneumonic phrase={recoveryPhrase} />
      </SecondaryCard>
      <br />
      <TextArea onChange={(e) => setRecoveryPhrase(e.currentTarget.value)} />
      <HorizontalFlex>
        <SecondaryButton
          onClick={() => {
            history.goBack();
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          disabled={!verifyRecoveryPhrase(recoveryPhrase)}
          onClick={async () => {
            const [, err] = await resolve(
              walletService.createFromMnemonic(recoveryPhrase)
            );
            if (!err) {
              onboardingService.markOnboarded();
              history.push('/wallet');
            } else {
              setErrorMsg(err.message);
            }
          }}
        >
          Connect
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
};
