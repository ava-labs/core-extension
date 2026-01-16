import { styled, Typography } from '@avalabs/k2-alpine';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { TxHistoryItem } from '@core/types';
import { Trans, useTranslation } from 'react-i18next';
import { TransactionType } from '@avalabs/vm-module-types';
import { FC, useMemo } from 'react';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { getAllAddressesForAccount, isNftTokenType } from '@core/common';
import {
  isCctImportTransaction,
  isCctTransaction,
} from '../../../utils/cctTransaction';

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
      <CollapsedTokenAmount
        amount={mainToken?.amount?.toString() ?? '0'}
        regularProps={{ variant: 'body3', component: 'span' }}
        overlineProps={{ variant: 'caption2', component: 'span' }}
        stackProps={{
          justifyContent: 'flex-start',
          width: 'fit-content',
          display: 'inline-flex',
          component: 'span',
        }}
      />
    ),
    [mainToken],
  );
  if (transaction.bridgeAnalysis.isBridgeTx) {
    return (
      <TransactionDescriptionContainer>
        <Trans
          i18nKey="<amount /> {{symbol}} bridged"
          values={{ symbol: mainToken?.symbol }}
          components={{ amount }}
        />
      </TransactionDescriptionContainer>
    );
  }

  // Handle CCT (Cross-Chain Transfer) import/export transactions
  if (isCctTransaction(transaction)) {
    const isImport = isCctImportTransaction(transaction);
    return (
      <TransactionDescriptionContainer>
        <Trans
          i18nKey={
            isImport
              ? '<amount /> {{symbol}} imported'
              : '<amount /> {{symbol}} exported'
          }
          values={{ symbol: mainToken?.symbol }}
          components={{ amount }}
        />
      </TransactionDescriptionContainer>
    );
  }

  if (
    transaction.txType === TransactionType.SEND &&
    mainToken?.type === 'ERC1155'
  ) {
    return (
      <TransactionDescriptionContainer>
        <Trans
          i18nKey={`<amount /> {{symbol}} Contract${'\u00A0'}Call`}
          values={{ symbol: mainToken?.symbol }}
          components={{ amount }}
        />
      </TransactionDescriptionContainer>
    );
  }

  switch (transaction.txType) {
    case TransactionType.BRIDGE: {
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<amount /> {{symbol}} bridged"
            values={{ symbol: mainToken?.symbol }}
            components={{ amount }}
          />
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

      const sourceAmount = (
        <CollapsedTokenAmount
          amount={sourceToken?.amount?.toString() ?? '0'}
          regularProps={{ variant: 'body3', component: 'span' }}
          overlineProps={{ variant: 'caption2', component: 'span' }}
          stackProps={{
            justifyContent: 'flex-start',
            width: 'fit-content',
            display: 'inline-flex',
            component: 'span',
          }}
        />
      );
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<sourceAmount /> {{sourceSymbol}} swapped for {{targetSymbol}}"
            values={{
              sourceSymbol: sourceToken?.symbol,
              targetSymbol: targetToken?.symbol,
            }}
            components={{ sourceAmount }}
          />
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.SEND: {
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<amount /> {{symbol}} sent"
            values={{ symbol: mainToken?.symbol }}
            components={{ amount }}
          />
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.RECEIVE: {
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<amount /> {{symbol}} received"
            values={{ symbol: mainToken?.symbol }}
            components={{ amount }}
          />
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
            <Trans
              i18nKey={`<amount /> {{symbol}} Contract${'\u00A0'}Call`}
              values={{ symbol: mainToken?.symbol }}
              components={{ amount }}
            />
          </TransactionDescriptionContainer>
        );
      }
    }
  }

  if (transaction.isSender) {
    return (
      <TransactionDescriptionContainer>
        <Trans
          i18nKey="<amount /> {{symbol}} sent"
          values={{ symbol: mainToken?.symbol }}
          components={{ amount }}
        />
      </TransactionDescriptionContainer>
    );
  } else {
    return (
      <TransactionDescriptionContainer>
        <Trans
          i18nKey="<amount /> {{symbol}} received"
          values={{ symbol: mainToken?.symbol }}
          components={{ amount }}
        />
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
