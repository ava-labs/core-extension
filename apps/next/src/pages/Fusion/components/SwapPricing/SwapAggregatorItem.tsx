import {
  MenuItem,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';

import { FaCheck } from 'react-icons/fa6';

type AggregatorItemProps = {
  id: string;
  name: string;
  logo: React.ReactNode;
  isSelected: boolean;
  amount?: number;
  formattedAmount: string;
  onClick: () => void;
};

export const SwapAggregatorItem: FC<AggregatorItemProps> = ({
  id,
  logo,
  name,
  isSelected,
  amount,
  formattedAmount,
  onClick,
}) => (
  <StyledMenuItem key={id} data-testid={`provider-${id}`} onClick={onClick}>
    <Stack direction="row" alignItems="center" gap={1}>
      {logo}
      <Stack flexGrow={1}>
        <Typography variant="body3" fontWeight={500}>
          {name}
        </Typography>
        <Tooltip title={amount}>
          <Typography variant="caption" color="text.secondary">
            {formattedAmount}
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
    {isSelected && <FaCheck size={16} />}
  </StyledMenuItem>
);

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  marginInline: 0,
  paddingInline: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  minHeight: 'unset',
  width: 'auto',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
