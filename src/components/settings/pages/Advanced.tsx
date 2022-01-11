import React from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';

export function Advanced({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Advanced'}
      />
    </VerticalFlex>
  );
}
