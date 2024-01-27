import { ReactNode } from 'react';
import {
  IconButton,
  Stack,
  Typography,
  ChevronLeftIcon,
} from '@avalabs/k2-components';
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
  return (
    <Stack
      width={width}
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 1,
        py: 1.5,
        pr: 2,
      }}
    >
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <IconButton data-testid="go-back-button" onClick={goBack} disableRipple>
          <ChevronLeftIcon size={32} />
        </IconButton>
        <Typography variant="h4">{title}</Typography>
      </Stack>
      {action}
    </Stack>
  );
}
