import { Stack, Typography } from '@avalabs/k2-alpine';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { TxHistoryItem } from '@core/types';
import { useTranslation } from 'react-i18next';
import { TransactionType } from '@avalabs/vm-module-types';
import { FC, useMemo } from 'react';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { getAllAddressesForAccount, isNftTokenType } from '@core/common';

export interface Props {
  transaction: TxHistoryItem;
}

export const TransactionDescription: FC<Props> = ({ transaction }) => {
  const { t } = useTranslation();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const userAddresses = useMemo(
    () => (activeAccount ? getAllAddressesForAccount(activeAccount) : []),
    [activeAccount],
  );
  const [mainToken] = transaction.tokens;

  if (transaction.bridgeAnalysis.isBridgeTx) {
    return (
      <Stack direction="row" alignItems="flex-start" gap={0.5}>
        <CollapsedTokenAmount
          amount={mainToken?.amount?.toString() ?? '0'}
          regularProps={{ variant: 'body3' }}
          overlineProps={{ variant: 'caption2' }}
        />
        <Typography variant="body3">{mainToken?.symbol}</Typography>
        <Typography variant="body3">{t('bridged')}</Typography>
      </Stack>
    );
  }

  if (
    transaction.txType === TransactionType.SEND &&
    mainToken?.type === 'ERC1155'
  ) {
    return (
      <Stack direction="row" alignItems="flex-start" gap={0.5}>
        <CollapsedTokenAmount
          amount={mainToken?.amount?.toString() ?? '0'}
          regularProps={{ variant: 'body3' }}
          overlineProps={{ variant: 'caption2' }}
        />
        <Typography variant="body3">{mainToken?.symbol}</Typography>
        <Typography variant="body3">{t('Contract Call')}</Typography>
      </Stack>
    );
  }

  switch (transaction.txType) {
    case TransactionType.BRIDGE: {
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <CollapsedTokenAmount
            amount={mainToken?.amount?.toString() ?? '0'}
            regularProps={{ variant: 'body3' }}
            overlineProps={{ variant: 'caption2' }}
          />
          <Typography variant="body3">{mainToken?.symbol}</Typography>
          <Typography variant="body3">{t('bridged')}</Typography>
        </Stack>
      );
    }
    case TransactionType.SWAP: {
      const sourceToken = transaction.tokens.find(
        (token) =>
          token.from?.address && userAddresses.includes(token.from.address),
      );

      const targetToken = transaction.tokens.find(
        (token) =>
          token.to?.address && userAddresses.includes(token.to.address),
      );
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <CollapsedTokenAmount
            amount={sourceToken?.amount?.toString() ?? '0'}
            regularProps={{ variant: 'body3' }}
            overlineProps={{ variant: 'caption2' }}
          />
          <Typography variant="body3">{sourceToken?.symbol}</Typography>
          <Typography variant="body3">{t('swapped for')}</Typography>
          <Typography variant="body3">{targetToken?.symbol}</Typography>
        </Stack>
      );
    }
    case TransactionType.SEND: {
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <CollapsedTokenAmount
            amount={mainToken?.amount?.toString() ?? '0'}
            regularProps={{ variant: 'body3' }}
            overlineProps={{ variant: 'caption2' }}
          />
          <Typography variant="body3">{mainToken?.symbol}</Typography>
          <Typography variant="body3">{t('sent')}</Typography>
        </Stack>
      );
    }
    case TransactionType.RECEIVE: {
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <CollapsedTokenAmount
            amount={mainToken?.amount?.toString() ?? '0'}
            regularProps={{ variant: 'body3' }}
            overlineProps={{ variant: 'caption2' }}
          />
          <Typography variant="body3">{mainToken?.symbol}</Typography>
          <Typography variant="body3">{t('received')}</Typography>
        </Stack>
      );
    }
    case TransactionType.NFT_BUY: {
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <Typography variant="body3">{t('NFT purchased')}</Typography>
        </Stack>
      );
    }
    case TransactionType.NFT_SEND: {
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <Typography variant="body3">{t('NFT sent')}</Typography>
        </Stack>
      );
    }
    case TransactionType.NFT_RECEIVE: {
      return (
        <Stack direction="row" alignItems="flex-start" gap={0.5}>
          <Typography variant="body3">{t('NFT received')}</Typography>
        </Stack>
      );
    }
    case TransactionType.TRANSFER:
    case TransactionType.UNKNOWN: {
      if (
        (mainToken && isNftTokenType(mainToken.type)) ||
        transaction.isContractCall
      ) {
        return (
          <Stack direction="row" alignItems="flex-start" gap={0.5}>
            <CollapsedTokenAmount
              amount={mainToken?.amount?.toString() ?? '0'}
              regularProps={{ variant: 'body3' }}
              overlineProps={{ variant: 'caption2' }}
            />
            <Typography variant="body3">{mainToken?.symbol}</Typography>
            <Typography variant="body3">{t('Contract Call')}</Typography>
          </Stack>
        );
      }
    }
  }

  if (transaction.isSender) {
    return (
      <Stack direction="row" alignItems="flex-start" gap={0.5}>
        <CollapsedTokenAmount
          amount={mainToken?.amount?.toString() ?? '0'}
          regularProps={{ variant: 'body3' }}
          overlineProps={{ variant: 'caption2' }}
        />
        <Typography variant="body3">{mainToken?.symbol}</Typography>
        <Typography variant="body3">{t('sent')}</Typography>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="flex-start" gap={0.5}>
        <CollapsedTokenAmount
          amount={mainToken?.amount?.toString() ?? '0'}
          regularProps={{ variant: 'body3' }}
          overlineProps={{ variant: 'caption2' }}
        />
        <Typography variant="body3">{mainToken?.symbol}</Typography>
        <Typography variant="body3">{t('received')}</Typography>
      </Stack>
    );
  }
};
