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

export function RecoveryPhrase({ goBack, navigateTo }: SettingsPageProps) {
  const [passwordValue, setPasswordValue] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const handleShowSeedPhrase = () => {
    // check password against user password
    // if match -> show seed phrase
    if (passwordValue === 'test') {
      setShowSeedPhrase(true);
    }
    // else show error?
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
            onChange={(e) => setPasswordValue(e.target.value)}
            value={passwordValue}
            placeholder="password"
            type="password"
          />
          <PrimaryButton
            size={ComponentSize.LARGE}
            onClick={() => handleShowSeedPhrase()}
            // disabled={!sendState?.canSubmit}
            margin="0 0 24px"
          >
            <Typography size={14} color="inherit">
              Show
            </Typography>
          </PrimaryButton>
        </>
      )}
      {showSeedPhrase && (
        <TextArea value={'Seed phrase will go here'} disabled></TextArea>
      )}
    </VerticalFlex>
  );
}
