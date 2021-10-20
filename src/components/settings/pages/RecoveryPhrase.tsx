import React, { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  ComponentSize,
  TextArea,
} from '@avalabs/react-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function RecoveryPhrase({ goBack, navigateTo }: SettingsPageProps) {
  const [passwordValue, setPasswordValue] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [seedValue, setSeedValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { getUnencryptedMnemonic } = useWalletContext();

  const handleShowSeedPhrase = () => {
    getUnencryptedMnemonic(passwordValue)
      .then((res) => {
        if (res) {
          setSeedValue(res);
          setShowSeedPhrase(true);
        } else {
          setShowError(true);
          setErrorMessage('Something is strange in the world');
        }
      })
      .catch((err) => {
        setErrorMessage(err);
        setShowError(true);
      });
  };

  return (
    <VerticalFlex width="375px" padding="12px 0">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Show recovery phrase'}
      />
      {!showSeedPhrase && (
        <>
          <Input
            label="Password"
            error={showError}
            errorMessage={errorMessage}
            onChange={(e) => {
              setPasswordValue(e.target.value);
              setShowError(false);
              setErrorMessage('');
            }}
            value={passwordValue}
            placeholder="password"
            type="password"
          />
          <PrimaryButton
            size={ComponentSize.LARGE}
            onClick={handleShowSeedPhrase}
            margin="0 0 24px"
          >
            <Typography size={14} color="inherit">
              Show
            </Typography>
          </PrimaryButton>
        </>
      )}
      {showSeedPhrase && <TextArea value={seedValue} disabled></TextArea>}
    </VerticalFlex>
  );
}
