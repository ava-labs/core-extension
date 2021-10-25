import React, { useState } from 'react';
import {
  VerticalFlex,
  Input,
  PrimaryButton,
  Typography,
  ComponentSize,
  TextArea,
  HorizontalFlex,
} from '@avalabs/react-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function RecoveryPhrase({ goBack, navigateTo }: SettingsPageProps) {
  const [passwordValue, setPasswordValue] = useState('');
  const [recoveryValue, setRecoveryValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { getUnencryptedMnemonic } = useWalletContext();

  const handleShowRecoveryPhrase = () => {
    getUnencryptedMnemonic(passwordValue)
      .then((res) => {
        setRecoveryValue(res);
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
      {!recoveryValue && (
        <VerticalFlex width="100%" align="center" padding="24px 0">
          <HorizontalFlex height="100px">
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
          </HorizontalFlex>
          <HorizontalFlex>
            <PrimaryButton
              size={ComponentSize.LARGE}
              onClick={handleShowRecoveryPhrase}
              margin="0 0 24px"
            >
              <Typography size={14} color="inherit">
                Show
              </Typography>
            </PrimaryButton>
          </HorizontalFlex>
        </VerticalFlex>
      )}
      {recoveryValue && (
        <VerticalFlex width="100%" align="center" padding="12px 0">
          <TextArea value={recoveryValue} disabled></TextArea>
        </VerticalFlex>
      )}
    </VerticalFlex>
  );
}
