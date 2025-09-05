import {
  Box,
  Stack,
  StackProps,
  Tooltip,
  Typography,
} from '@avalabs/k2-alpine';
import { MdInfoOutline } from 'react-icons/md';

type TxDetailsRowProps = StackProps & {
  label: React.ReactNode | string;
  tooltip?: string;
};

export const TxDetailsRow = ({
  label,
  tooltip,
  children,
  ...rest
}: TxDetailsRowProps) => (
  <Stack
    direction="row"
    gap={1}
    px={2}
    py={0.5}
    minHeight={36}
    alignItems="center"
    justifyContent="space-between"
    {...rest}
  >
    <Stack direction="row" alignItems="center" gap={0.5}>
      {typeof label === 'string' ? (
        <Typography variant="body3" sx={{ whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
      ) : (
        label
      )}
      {tooltip && (
        <Tooltip title={tooltip}>
          <Box flexShrink={0} lineHeight={1} color="text.secondary">
            <MdInfoOutline color="text.secondary" size={16} />
          </Box>
        </Tooltip>
      )}
    </Stack>
    {children}
  </Stack>
);
