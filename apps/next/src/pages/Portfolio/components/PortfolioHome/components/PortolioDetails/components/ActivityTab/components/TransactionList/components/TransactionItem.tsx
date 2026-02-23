import {
  ListItem,
  ListItemText,
  ListItemTextProps,
  SxProps,
  Theme,
} from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId, TxHistoryItem } from '@core/types';
import { useSettingsContext, useTokenPrice } from '@core/ui';
import { format, isToday, isYesterday } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import * as Styled from './Styled';
import { TransactionDescription } from './TransactionDescription';
import { TransactionIcon } from './TransactionIcon';
import { ViewInExplorerButton } from './ViewInExplorerButton';

type Props = {
  transaction: TxHistoryItem;
  network?: NetworkWithCaipId;
};

const TIME_FORMAT = 'HH:mm a';

const listItemSx: SxProps<Theme> = (theme) => ({
  height: 42,
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  paddingInlineEnd: theme.spacing(3),
});

const receivedAmountSlotProps: ListItemTextProps['slotProps'] = {
  root: {
    sx: {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      overflow: 'hidden',
    },
  },
  primary: {
    variant: 'subtitle3',
  },
  secondary: {
    variant: 'body3',
  },
};

const sentAmountSlotProps: ListItemTextProps['slotProps'] = {
  primary: receivedAmountSlotProps.primary,
  secondary: {
    ...receivedAmountSlotProps.secondary,
    color: 'error.main',
  },
};

const timestampSlotProps: ListItemTextProps['slotProps'] = {
  root: {
    sx: {
      flexGrow: 0,
      flexShrink: 0,
    },
  },
  primary: {
    variant: 'body3',
    color: 'text.secondary',
    textAlign: 'end',
    whiteSpace: 'nowrap',
  },
  secondary: {
    variant: 'body3',
    color: 'text.secondary',
    textAlign: 'end',
    whiteSpace: 'nowrap',
  },
};

export const TransactionItem: FC<Props> = ({ transaction, network }) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  const [token] = transaction.tokens;

  const isDateToday = isToday(transaction.timestamp);
  const isDateYesterday = isYesterday(transaction.timestamp);
  const formattedTime = format(transaction.timestamp, TIME_FORMAT);
  const directionModifier = transaction.isSender ? -1 : 1;

  const tokenPrice = useTokenPrice(
    token?.type === TokenType.NATIVE ? token?.symbol : token?.address,
    network,
  );

  const usdValue = tokenPrice
    ? tokenPrice * (Number(token?.amount) || 0) * directionModifier
    : null;

  return (
    <ListItem
      disablePadding
      disableGutters
      sx={listItemSx}
      secondaryAction={
        <ViewInExplorerButton
          txType={transaction.txType}
          explorerLink={transaction.explorerLink}
          chainId={transaction.chainId}
        />
      }
    >
      <Styled.ListItemIcon>
        <TransactionIcon transaction={transaction} />
      </Styled.ListItemIcon>
      <ListItemText
        primary={<TransactionDescription transaction={transaction} />}
        secondary={usdValue ? currencyFormatter(usdValue) : ''}
        slotProps={
          transaction.isSender ? sentAmountSlotProps : receivedAmountSlotProps
        }
      />
      <ListItemText
        primary={
          isDateYesterday
            ? t('Yesterday')
            : isDateToday
              ? formattedTime
              : format(transaction.timestamp, 'MM/dd/yy')
        }
        secondary={isDateToday ? undefined : formattedTime}
        slotProps={timestampSlotProps}
      />
    </ListItem>
  );
};
