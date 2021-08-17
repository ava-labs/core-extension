import { VerticalFlex, PrimaryButton } from '@avalabs/react-components';
import { removeAllPermissionsFromStorage } from '@src/background/services/permissions/storage';
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
      {/*
       * if we end up keeping this functionality we need to make this more granular and not just remove all permissions
       * We also need to make this an api request that updates the background permissions behavior subject. Then emit an event
       * that the dApp can listen on if its permissions have been revoked
       */}
      <PrimaryButton onClick={() => removeAllPermissionsFromStorage()}>
        Clear Permissions
      </PrimaryButton>
    </VerticalFlex>
  );
}

export default SettingsPage;
