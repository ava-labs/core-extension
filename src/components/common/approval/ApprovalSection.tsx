import {
  Box,
  InfoCircleIcon,
  Stack,
  StackProps,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import React from 'react';

type ApprovalSectionHeaderProps = {
  label: string;
  tooltip?: string;
  tooltipIcon?: React.ReactElement;
};

export const ApprovalSectionHeader: React.FC<ApprovalSectionHeaderProps> = ({
  label,
  tooltip,
  tooltipIcon = <InfoCircleIcon />,
  children,
}) => (
  <Stack
    sx={{
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
      <Typography component="h6">{label}</Typography>
      {tooltip && (
        <Tooltip sx={{ cursor: 'pointer', ml: 1 }} title={tooltip}>
          {tooltipIcon}
        </Tooltip>
      )}
    </Stack>
    <Box>{children}</Box>
  </Stack>
);

export const ApprovalSectionBody = ({ sx = {}, ...rest }: StackProps) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 2,
        gap: 1,
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
      {...rest}
    />
  );
};

export const ApprovalSection = ({ sx = {}, ...rest }: StackProps) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        width: '100%',
        gap: 0.5,
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
      {...rest}
    />
  );
};
