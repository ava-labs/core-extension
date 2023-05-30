import {
  InfoCircleIcon,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/k2-components';
import { truncateAddress } from '@src/utils/truncateAddress';

type TruncatedIdentifierProps = {
  identifier: string;
};

export const TruncatedIdentifier = ({
  identifier,
}: TruncatedIdentifierProps) => (
  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
    <Typography variant="caption">{truncateAddress(identifier, 10)}</Typography>
    <Tooltip title={identifier}>
      <InfoCircleIcon size={14} sx={{ color: 'text.secondary' }} />
    </Tooltip>
  </Stack>
);
