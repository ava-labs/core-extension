import {
  ListItem,
  ListItemText,
  ListItemTextProps,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@avalabs/k2-alpine';
import { TxHistoryItem } from '@core/types';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { format, isToday, isYesterday } from 'date-fns';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionIcon } from './TransactionIcon';

import * as Styled from './Styled';
import { ViewInExplorerButton } from './ViewInExplorerButton';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';

type Props = {
  transaction: TxHistoryItem;
};

const TIME_FORMAT = 'HH:mm a';

const listItemSx: SxProps<Theme> = (theme) => ({
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  paddingInlineEnd: theme.spacing(3),
});

const receivedAmountSlotProps: ListItemTextProps['slotProps'] = {
  primary: {
    variant: 'subtitle3',
    whiteSpace: 'nowrap',
    display: 'flex',
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

export const TransactionItem: FC<Props> = ({ transaction }) => {
  const { t } = useTranslation();
  const { getTokenPrice } = useBalancesContext();
  const { currencyFormatter } = useSettingsContext();

  const [token] = transaction.tokens;

  const isDateToday = isToday(transaction.timestamp);
  const isDateYesterday = isYesterday(transaction.timestamp);
  const formattedTime = format(transaction.timestamp, TIME_FORMAT);

  const tokenPrice = token ? (getTokenPrice(token.symbol) ?? 0) : 0;
  const directionModifier = transaction.isSender ? -1 : 1;
  const usdValue =
    tokenPrice * (Number(token?.amount) || 0) * directionModifier;

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
        primary={
          <Stack direction="row" alignItems="flex-start" gap={0.5}>
            <CollapsedTokenAmount
              amount={token?.amount?.toString() ?? '0'}
              regularProps={{ variant: 'body3' }}
              overlineProps={{ variant: 'caption2' }}
            />
            <Typography variant="body3">{token?.symbol}</Typography>
            <Typography variant="body3">
              {transaction.isSender ? t('sent') : t('received')}
            </Typography>
          </Stack>
        }
        secondary={currencyFormatter(usdValue)}
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
