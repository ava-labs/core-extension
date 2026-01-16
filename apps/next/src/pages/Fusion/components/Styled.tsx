import {
  Box,
  Stack,
  StackProps,
  Tooltip,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { MdInfoOutline } from 'react-icons/md';

type SettingRowProps = StackProps & {
  title: string;
  tooltip?: string;
};

export const SettingRow: FC<SettingRowProps> = ({
  title,
  tooltip,
  children,
  ...props
}) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    py={1}
    {...props}
  >
    <Stack direction="row" gap={0.5} alignItems="center">
      <Typography variant="body3">{title}</Typography>

      {tooltip && (
        <Tooltip title={tooltip}>
          <Box
            display="flex"
            flexShrink={0}
            lineHeight={1}
            color="text.secondary"
          >
            <MdInfoOutline color="text.secondary" size={16} />
          </Box>
        </Tooltip>
      )}
    </Stack>
    {children}
  </Stack>
);
