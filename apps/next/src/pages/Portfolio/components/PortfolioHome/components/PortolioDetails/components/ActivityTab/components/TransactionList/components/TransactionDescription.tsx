import { styled, truncateAddress, Typography } from '@avalabs/k2-alpine';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { TxHistoryItem } from '@core/types';
import { Trans, useTranslation } from 'react-i18next';
import { TokenType, TransactionType } from '@avalabs/vm-module-types';
import { FC, useMemo } from 'react';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { getAllAddressesForAccount, isNftTokenType } from '@core/common';
import { useActivityListNativeSymbol } from './ActivityListNativeSymbols';
import {
  isCctImportTransaction,
  isCctTransaction,
} from '../../../utils/cctTransaction';

function isHexAddress(address: string): boolean {
  return address.startsWith('0x') || address.startsWith('0X');
}

function addressMatchesUser(
  transferAddress: string | undefined,
  userAddresses: readonly string[],
): boolean {
  if (!transferAddress) {
    return false;
  }
  return userAddresses.some((userAddr) => {
    if (isHexAddress(transferAddress) && isHexAddress(userAddr)) {
      return transferAddress.toLowerCase() === userAddr.toLowerCase();
    }
    return transferAddress === userAddr;
  });
}

function tokenHasContractAddress(
  token: TxHistoryItem['tokens'][number],
): token is TxHistoryItem['tokens'][number] & { address: string } {
  return (
    'address' in token &&
    typeof token.address === 'string' &&
    token.address.trim() !== ''
  );
}

function displayTokenSymbol(
  token: TxHistoryItem['tokens'][number] | undefined,
  networkNativeSymbol: string | undefined,
): string | undefined {
  const trimmed = token?.symbol?.trim();
  if (trimmed) {
    return trimmed;
  }
  const nativeFallback = networkNativeSymbol?.trim();
  if (nativeFallback && token?.type === TokenType.NATIVE) {
    return nativeFallback;
  }
  if (
    nativeFallback &&
    token &&
    !isNftTokenType(token.type) &&
    !tokenHasContractAddress(token)
  ) {
    return nativeFallback;
  }
  if (token && tokenHasContractAddress(token) && !isNftTokenType(token.type)) {
    const trimmedAddress = token.address.trim();
    const normalizedLower = trimmedAddress.toLowerCase();
    if (!isHexAddress(normalizedLower) || normalizedLower.length < 12) {
      return trimmedAddress;
    }
    return truncateAddress(normalizedLower, 6, 4);
  }
  return undefined;
}

function tokenIsIncomingToUser(
  token: TxHistoryItem['tokens'][number],
  transaction: TxHistoryItem,
  userAddresses: readonly string[],
): boolean {
  if (addressMatchesUser(token.to?.address, userAddresses)) {
    return true;
  }
  const toUnset = !token.to?.address;
  return (
    toUnset &&
    token.type === TokenType.NATIVE &&
    addressMatchesUser(transaction.to, userAddresses)
  );
}

function tokenIsOutgoingFromUser(
  token: TxHistoryItem['tokens'][number],
  transaction: TxHistoryItem,
  userAddresses: readonly string[],
): boolean {
  if (addressMatchesUser(token.from?.address, userAddresses)) {
    return true;
  }
  const fromUnset = !token.from?.address;
  return (
    fromUnset &&
    token.type === TokenType.NATIVE &&
    addressMatchesUser(transaction.from, userAddresses)
  );
}

function pickIncomingToken(
  tokens: TxHistoryItem['tokens'],
  transaction: TxHistoryItem,
  userAddresses: readonly string[],
): TxHistoryItem['tokens'][number] | undefined {
  if (tokens.length === 0) {
    return undefined;
  }
  const [first] = tokens;
  if (first == null) {
    return undefined;
  }
  const candidates = tokens.filter((token) =>
    tokenIsIncomingToUser(token, transaction, userAddresses),
  );
  const list = candidates.length > 0 ? candidates : [first];
  const withSymbol = list.find((token) => token.symbol?.trim());
  return withSymbol ?? first;
}

function pickOutgoingToken(
  tokens: TxHistoryItem['tokens'],
  transaction: TxHistoryItem,
  userAddresses: readonly string[],
): TxHistoryItem['tokens'][number] | undefined {
  if (tokens.length === 0) {
    return undefined;
  }
  const [first] = tokens;
  if (first == null) {
    return undefined;
  }
  const candidates = tokens.filter((token) =>
    tokenIsOutgoingFromUser(token, transaction, userAddresses),
  );
  const list = candidates.length > 0 ? candidates : [first];
  const withSymbol = list.find((token) => token.symbol?.trim());
  return withSymbol ?? first;
}

export interface Props {
  transaction: TxHistoryItem;
}

export const TransactionDescription: FC<Props> = ({ transaction }) => {
  const { t } = useTranslation();
  const nativeSymbolForTxChain = useActivityListNativeSymbol(
    transaction.chainId,
  );
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const userAddresses = useMemo(
    () => (activeAccount ? getAllAddressesForAccount(activeAccount) : []),
    [activeAccount],
  );

  const mainToken = useMemo(() => {
    const { tokens } = transaction;
    if (tokens.length === 0) {
      return undefined;
    }

    const [first] = tokens;
    const incoming =
      pickIncomingToken(tokens, transaction, userAddresses) ?? first;
    const outgoing =
      pickOutgoingToken(tokens, transaction, userAddresses) ?? first;

    if (transaction.bridgeAnalysis.isBridgeTx) {
      return first;
    }

    if (isCctTransaction(transaction)) {
      return first;
    }

    switch (transaction.txType) {
      case TransactionType.BRIDGE:
        return first;
      case TransactionType.SEND:
        return outgoing;
      case TransactionType.RECEIVE:
        return incoming;
      case TransactionType.TRANSFER:
      case TransactionType.UNKNOWN:
        if (
          (first && isNftTokenType(first.type)) ||
          transaction.isContractCall
        ) {
          return transaction.isSender ? outgoing : incoming;
        }
        break;
      default:
        break;
    }

    return transaction.isSender ? outgoing : incoming;
  }, [transaction, userAddresses]);

  const symbolForDisplay = useMemo(
    () => displayTokenSymbol(mainToken, nativeSymbolForTxChain),
    [mainToken, nativeSymbolForTxChain],
  );

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
          values={{ symbol: symbolForDisplay }}
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
          values={{ symbol: symbolForDisplay }}
          components={{ amount }}
        />
      </TransactionDescriptionContainer>
    );
  }

  if (
    transaction.txType === TransactionType.SEND &&
    mainToken &&
    isNftTokenType(mainToken.type)
  ) {
    return (
      <TransactionDescriptionContainer>
        {t('NFT sent')}
      </TransactionDescriptionContainer>
    );
  }

  switch (transaction.txType) {
    case TransactionType.BRIDGE: {
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<amount /> {{symbol}} bridged"
            values={{ symbol: symbolForDisplay }}
            components={{ amount }}
          />
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.SWAP: {
      const sourceToken = pickOutgoingToken(
        transaction.tokens,
        transaction,
        userAddresses,
      );

      const targetToken = pickIncomingToken(
        transaction.tokens,
        transaction,
        userAddresses,
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
              sourceSymbol: displayTokenSymbol(
                sourceToken,
                nativeSymbolForTxChain,
              ),
              targetSymbol: displayTokenSymbol(
                targetToken,
                nativeSymbolForTxChain,
              ),
            }}
            components={{ sourceAmount }}
          />
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.APPROVE: {
      return (
        <TransactionDescriptionContainer>
          {t('Spend limit approved')}
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.SEND: {
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<amount /> {{symbol}} sent"
            values={{ symbol: symbolForDisplay }}
            components={{ amount }}
          />
        </TransactionDescriptionContainer>
      );
    }
    case TransactionType.RECEIVE: {
      if (mainToken && isNftTokenType(mainToken.type)) {
        return (
          <TransactionDescriptionContainer>
            {t('NFT received')}
          </TransactionDescriptionContainer>
        );
      }
      return (
        <TransactionDescriptionContainer>
          <Trans
            i18nKey="<amount /> {{symbol}} received"
            values={{ symbol: symbolForDisplay }}
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
      if (mainToken && isNftTokenType(mainToken.type)) {
        return (
          <TransactionDescriptionContainer>
            {transaction.isSender ? t('NFT sent') : t('NFT received')}
          </TransactionDescriptionContainer>
        );
      }
      if (transaction.isContractCall) {
        return (
          <TransactionDescriptionContainer>
            <Trans
              i18nKey={`<amount /> {{symbol}} Contract${'\u00A0'}Call`}
              values={{ symbol: symbolForDisplay }}
              components={{ amount }}
            />
          </TransactionDescriptionContainer>
        );
      }
    }
  }

  if (transaction.isSender) {
    if (mainToken && isNftTokenType(mainToken.type)) {
      return (
        <TransactionDescriptionContainer>
          {t('NFT sent')}
        </TransactionDescriptionContainer>
      );
    }
    return (
      <TransactionDescriptionContainer>
        <Trans
          i18nKey="<amount /> {{symbol}} sent"
          values={{ symbol: symbolForDisplay }}
          components={{ amount }}
        />
      </TransactionDescriptionContainer>
    );
  }
  if (mainToken && isNftTokenType(mainToken.type)) {
    return (
      <TransactionDescriptionContainer>
        {t('NFT received')}
      </TransactionDescriptionContainer>
    );
  }
  return (
    <TransactionDescriptionContainer>
      <Trans
        i18nKey="<amount /> {{symbol}} received"
        values={{ symbol: symbolForDisplay }}
        components={{ amount }}
      />
    </TransactionDescriptionContainer>
  );
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
