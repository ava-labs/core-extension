import { ReactNode } from 'react';
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
  action?: ReactNode;
}

export function SettingsHeader({
  goBack,
  title,
  action,
  width,
}: SettingsHeaderProps & SettingsPageProps) {
  const theme = useTheme();

  return (
    <HorizontalFlex
      width={width}
      padding="40px 16px 12px"
      align="center"
      justify="space-between"
    >
      <HorizontalFlex>
        <TextButton onClick={goBack} margin="0 24px 0 0">
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.text1}
          />
        </TextButton>
        <Typography size={24} weight={700} height="29px">
          {title}
        </Typography>
      </HorizontalFlex>
      {action}
    </HorizontalFlex>
  );
}
