import React from 'react';
import {
  CaretIcon,
  HorizontalFlex,
  IconDirection,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from './models';

interface SettingsHeaderProps {
  title: string;
}

export function SettingsHeader({
  goBack,
  title,
}: SettingsHeaderProps & SettingsPageProps) {
  const theme = useTheme();

  return (
    <HorizontalFlex grow="1" padding="12px 24px">
      <TextButton onClick={goBack} margin="0 8px 0 0">
        <CaretIcon
          height="20px"
          direction={IconDirection.LEFT}
          color={theme.colors.text1}
        />
      </TextButton>
      <Typography size={18} weight={700} height="24px">
        {title}
      </Typography>
    </HorizontalFlex>
  );
}
