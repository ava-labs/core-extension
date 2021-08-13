import {
  HorizontalFlex,
  Input,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import React, { useState } from 'react';

export function WalletLocked({
  unlockWallet,
}: {
  unlockWallet(password: string): Promise<any>;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  return (
    <VerticalFlex align={'center'} justify={'center'} width={'100%'}>
      <Typography>Wallet Locked</Typography>
      <Typography>Put in your password fool</Typography>
      <iframe
        src="https://gfycat.com/ifr/ConcernedThunderousFish"
        frameBorder="0"
        scrolling="no"
        width="640"
        height="524"
      ></iframe>
      <br />
      <br />
      <Input
        onChange={(e) => setPassword(e.currentTarget.value)}
        placeholder="password"
      />
      <br />
      <HorizontalFlex>
        <SecondaryButton onClick={() => resetExtensionState()}>
          Forgot Password
        </SecondaryButton>
        <PrimaryButton
          disabled={!password}
          onClick={() =>
            password && unlockWallet(password).catch((err) => setError(err))
          }
        >
          Unlock
        </PrimaryButton>
      </HorizontalFlex>
      <HorizontalFlex>{error}</HorizontalFlex>
    </VerticalFlex>
  );
}
