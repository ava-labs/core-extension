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
      marginTop="16px"
      padding="12px 16px"
      align="center"
      justify="space-between"
    >
      <HorizontalFlex align="center">
        <TextButton onClick={goBack} margin="0 12px 0 0">
          <CaretIcon
            height="18px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography size={20} weight={600} height="29px">
          {title}
        </Typography>
      </HorizontalFlex>
      {action}
    </HorizontalFlex>
  );
}
