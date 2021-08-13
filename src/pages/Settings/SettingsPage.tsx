import { VerticalFlex, PrimaryButton } from '@avalabs/react-components';
import { resetExtensionState } from '@src/utils/resetExtensionState';
import React from 'react';

export function SettingsPage() {
  return (
    <VerticalFlex>
      <PrimaryButton onClick={() => resetExtensionState()}>
        Logout and Reload
      </PrimaryButton>
    </VerticalFlex>
  );
}

export default SettingsPage;
