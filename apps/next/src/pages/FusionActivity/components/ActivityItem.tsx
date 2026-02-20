import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { Card } from '@/components/Card';
import {
  ListItem,
  ListItemText,
  ListItemTextProps,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import * as Styled from './Styled';
import { Transfer } from '@avalabs/unified-asset-transfer';
import { isCompletedTransfer, isTransferInProgress } from '@core/types';
import { MdCheckCircle, MdError } from 'react-icons/md';

type Props = {
  title: string;
  subtitle: string;
  onClick: VoidFunction;
  transfer: Transfer;
};

const textSlotProps: ListItemTextProps['slotProps'] = {
  root: {
    sx: {
      margin: 0,
    },
  },
  primary: {
    variant: 'body3',
  },
  secondary: {
    variant: 'caption',
  },
};

export const ActivityItem: FC<Props> = ({
  transfer,
  title,
  subtitle,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Card noPadding>
      <ListItem
        disablePadding
        secondaryAction={<Styled.ChevronRightIcon size={24} />}
      >
        <Styled.ListItemButton onClick={onClick}>
          <Styled.ListItemIcon>
            {isTransferInProgress(transfer) ? (
              <Styled.Avatar>
                <AnimatedSyncIcon size={20} data-active={true} />
              </Styled.Avatar>
            ) : isCompletedTransfer(transfer) ? (
              <MdCheckCircle size={20} color={theme.palette.success.main} />
            ) : (
              <MdError size={20} color={theme.palette.error.main} />
            )}
          </Styled.ListItemIcon>
          <ListItemText
            primary={title}
            secondary={subtitle}
            slotProps={textSlotProps}
          />
        </Styled.ListItemButton>
      </ListItem>
    </Card>
  );
};
