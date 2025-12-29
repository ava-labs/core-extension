import { BridgeIcon } from '@/components/BridgeIcon';
import { ContractCallIcon, SwapIcon } from '@avalabs/k2-alpine';
import { TransactionType } from '@avalabs/vm-module-types';
import { isNftTokenType } from '@core/common';
import { TxHistoryItem } from '@core/types';
import { FC } from 'react';
import {
  MdArrowDownward as ArrowDownIcon,
  MdArrowUpward as ArrowUpIcon,
} from 'react-icons/md';

export interface Props {
  transaction: TxHistoryItem;
}

const iconSize = 16;
const k2IconViewBoxFix = '0 0 24 24';

export const TransactionTypeIcon: FC<Props> = ({ transaction }) => {
  const [token] = transaction.tokens;

  if (transaction.bridgeAnalysis.isBridgeTx) {
    return <BridgeIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
  }

  if (
    transaction.txType === TransactionType.SEND &&
    token?.type === 'ERC1155'
  ) {
    return <ContractCallIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
  }

  switch (transaction.txType) {
    case TransactionType.BRIDGE: {
      return <BridgeIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
    }
    case TransactionType.SWAP: {
      return <SwapIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
    }
    case TransactionType.SEND: {
      return <ArrowUpIcon size={iconSize} />;
    }
    case TransactionType.RECEIVE: {
      return <ArrowDownIcon size={iconSize} />;
    }
    case TransactionType.NFT_BUY:
    case TransactionType.NFT_SEND:
    case TransactionType.NFT_RECEIVE: {
      return <ContractCallIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
    }
    case TransactionType.TRANSFER:
    case TransactionType.UNKNOWN: {
      if ((token && isNftTokenType(token.type)) || transaction.isContractCall) {
        return <ContractCallIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
      }
    }
  }

  const FallbackIcon = transaction.isSender ? ArrowUpIcon : ArrowDownIcon;
  return <FallbackIcon size={iconSize} />;
};
