import {
  Box,
  ChevronRightIcon,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, ReactElement } from 'react';

interface MethodCardProps {
  icon: ReactElement;
  title: string;
  onClick?: () => void;
  showChevron?: boolean;
}

const checronIconClassName = 'MethodCard-chevron';

export const MethodCard: FC<MethodCardProps> = ({
  icon,
  title,
  onClick,
  showChevron = true,
}) => {
  return (
    <StyledMethodCard onClick={onClick}>
      <Stack direction="row" gap={1.5} alignItems="center">
        {icon}
        <Typography variant="subtitle3">{title}</Typography>
      </Stack>
      {showChevron && (
        <ChevronRightIcon className={checronIconClassName} size={20} />
      )}
    </StyledMethodCard>
  );
};

const StyledMethodCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  color: theme.palette.text.primary,
  cursor: 'pointer',

  [`& .${checronIconClassName}`]: {
    color: theme.palette.text.secondary,
  },
}));
