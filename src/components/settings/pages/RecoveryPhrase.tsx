import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function RecoveryPhrase({ goBack, navigateTo }: SettingsPageProps) {
  return (
    <VerticalFlex width="375px" padding="12px 0">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Show recovery phrase'}
      />
    </VerticalFlex>
  );
}
