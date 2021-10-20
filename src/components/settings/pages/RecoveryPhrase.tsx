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
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [recoveryValue, setRecoveryValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { getUnencryptedMnemonic } = useWalletContext();

  const handleShowRecoveryPhrase = () => {
    getUnencryptedMnemonic(passwordValue)
      .then((res) => {
        if (res) {
          setRecoveryValue(res);
          setShowRecoveryPhrase(true);
        } else {
          setShowError(true);
          setErrorMessage('Password does not seem right');
        }
      })
      .catch((err) => {
        if (typeof err === 'string') {
          setErrorMessage(err);
        } else {
          setErrorMessage('Something is strange in the world');
        }
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
      {!showRecoveryPhrase && (
        <>
          <VerticalFlex width="100%" align="center" padding="12px 0">
            <Input
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
          </VerticalFlex>
          <VerticalFlex width="100%" align="center" padding="12px 0">
            <PrimaryButton
              size={ComponentSize.LARGE}
              onClick={handleShowRecoveryPhrase}
              margin="0 0 24px"
            >
              <Typography size={14} color="inherit">
                Show
              </Typography>
            </PrimaryButton>
          </VerticalFlex>
        </>
      )}
      {showRecoveryPhrase && (
        <VerticalFlex width="100%" align="center" padding="12px 0">
          <TextArea value={recoveryValue} disabled></TextArea>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}
