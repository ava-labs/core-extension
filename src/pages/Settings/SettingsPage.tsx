import { VerticalFlex, PrimaryButton } from '@avalabs/react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import React from 'react';

export function SettingsPage() {
  const { lockWallet } = useSettingsContext();

  return (
    <VerticalFlex>
      <PrimaryButton onClick={() => resetExtensionState()}>
        Logout and Reload
      </PrimaryButton>
      <PrimaryButton onClick={() => lockWallet()}>Lock</PrimaryButton>
    </VerticalFlex>
  );
}

export default SettingsPage;
