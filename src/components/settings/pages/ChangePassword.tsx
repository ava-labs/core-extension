import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function ChangePassword({ goBack, navigateTo }: SettingsPageProps) {
  return (
    <VerticalFlex width="375px" padding="12px 0">
      <SettingsHeader
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Change Password'}
      />
    </VerticalFlex>
  );
}
