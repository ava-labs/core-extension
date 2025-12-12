import { Box, styled, Typography } from '@avalabs/k2-alpine';
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

  const amount = useMemo(
    () => (
      <Box
        component="span"
        sx={{ display: 'inline', '& *': { display: 'inline' } }}
      >
        <CollapsedTokenAmount
          amount={mainToken?.amount?.toString() ?? '0'}
          regularProps={{ variant: 'body3' }}
          overlineProps={{ variant: 'caption2' }}
          stackProps={{
            justifyContent: 'flex-start',
            width: 'fit-content',
            display: 'inline',
          }}
        />
      </Box>
    ),
    [mainToken],
  );
  if (transaction.bridgeAnalysis.isBridgeTx) {
    return (
      <TransactionDescriptionContainer>
        {amount} {mainToken?.symbol} {t('bridged')}
      </TransactionDescriptionContainer>
    );
  }

  if (
    transaction.txType === TransactionType.SEND &&
    mainToken?.type === 'ERC1155'
  ) {
    return (
      <TransactionDescriptionContainer>
        {amount} {mainToken?.symbol} {t('Contract\u00A0Call')}
      </TransactionDescriptionContainer>
    );
  }

  switch (transaction.txType) {
    case TransactionType.BRIDGE: {
      return (
        <TransactionDescriptionContainer>
          {amount} {mainToken?.symbol} {t('bridged')}
        </TransactionDescriptionContainer>
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
        <TransactionDescriptionContainer>
          <Box
            component="span"
            sx={{ display: 'inline', '& *': { display: 'inline' } }}
          >
            <CollapsedTokenAmount
              amount={sourceToken?.amount?.toString() ?? '0'}
              regularProps={{ variant: 'body3' }}
              overlineProps={{ variant: 'caption2' }}
              stackProps={{
                justifyContent: 'flex-start',
                width: 'fit-content',
                display: 'inline',
              }}
            />
          </Box>{' '}
          {sourceToken?.symbol} {t('swapped for')} {targetToken?.symbol}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.SEND: {
      return (
        <TransactionDescriptionContainer>
          {amount} {mainToken?.symbol} {t('sent')}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.RECEIVE: {
      return (
        <TransactionDescriptionContainer>
          {amount} {mainToken?.symbol} {t('received')}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.NFT_BUY: {
      return (
        <TransactionDescriptionContainer>
          {t('NFT purchased')}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.NFT_SEND: {
      return (
        <TransactionDescriptionContainer>
          {t('NFT sent')}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.NFT_RECEIVE: {
      return (
        <TransactionDescriptionContainer>
          {t('NFT received')}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.TRANSFER:
    case TransactionType.UNKNOWN: {
      if (
        (mainToken && isNftTokenType(mainToken.type)) ||
        transaction.isContractCall
      ) {
        return (
          <TransactionDescriptionContainer>
            {amount} {mainToken?.symbol} {t('Contract\u00A0Call')}
          </TransactionDescriptionContainer>
        );
      }
    }
  }

  if (transaction.isSender) {
    return (
      <TransactionDescriptionContainer>
        {amount} {mainToken?.symbol} {t('sent')}
      </TransactionDescriptionContainer>
    );
  } else {
    return (
      <TransactionDescriptionContainer>
        {amount} {mainToken?.symbol} {t('received')}
      </TransactionDescriptionContainer>
    );
  }
};

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const TransactionDescriptionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StyledTypography
      variant="body3"
      component="span"
      justifyContent="flex-start"
    >
      {children}
    </StyledTypography>
  );
};
