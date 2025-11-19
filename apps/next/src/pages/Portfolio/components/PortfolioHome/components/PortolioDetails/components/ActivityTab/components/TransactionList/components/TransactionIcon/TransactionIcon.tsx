import { ChainBadge } from '@/components/ChainBadge';
import {
  Badge,
  BridgeIcon,
  ContractCallIcon,
  Stack,
  SwapIcon,
} from '@avalabs/k2-alpine';
import { TransactionType } from '@avalabs/vm-module-types';
import { isNftTokenType } from '@core/common';
import { TxHistoryItem } from '@core/types';
import { FC } from 'react';
import {
  MdArrowDownward as ArrowDownIcon,
  MdArrowUpward as ArrowUpIcon,
} from 'react-icons/md';
import { CollectibleMedia } from './components/CollectibleMedia';

export interface Props {
  transaction: TxHistoryItem;
}

const TransactionIconWithNetworkBadge: FC<Props> = ({ transaction }) => {
  return (
    <Badge
      sx={{ isolation: 'isolate' }}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <ChainBadge coreChainId={Number(transaction.chainId)} size={18} />
      }
    >
      <Stack
        width={32}
        height={32}
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        bgcolor="background.paper"
      >
        <TransactionIcon transaction={transaction} />
      </Stack>
    </Badge>
  );
};

const TransactionIcon: FC<Props> = ({ transaction }) => {
  const iconSize = 16;
  const k2IconViewBoxFix = '0 0 24 24';
  const [token] = transaction.tokens;

  if (transaction.bridgeAnalysis.isBridgeTx) {
    return <BridgeIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
  }

  if (
    transaction.txType === TransactionType.SEND &&
    token?.type === 'ERC1155'
  ) {
    return <CollectibleMedia token={token} />;
  }

  const FallbackIcon = transaction.isSender ? ArrowUpIcon : ArrowDownIcon;

  switch (transaction.txType) {
    case TransactionType.BRIDGE:
      return <BridgeIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
    case TransactionType.SWAP:
      return <SwapIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
    case TransactionType.SEND:
      return <ArrowUpIcon size={iconSize} />;
    case TransactionType.RECEIVE:
      return <ArrowDownIcon size={iconSize} />;
    case TransactionType.NFT_BUY:
    case TransactionType.NFT_SEND:
    case TransactionType.NFT_RECEIVE:
      return <CollectibleMedia token={token} />;
      break;

    case TransactionType.TRANSFER:
    case TransactionType.UNKNOWN:
      if (token && isNftTokenType(token.type)) {
        return <CollectibleMedia token={token} />;
      }

      if (transaction.isContractCall) {
        return <ContractCallIcon size={iconSize} viewBox={k2IconViewBoxFix} />;
      }

      return <FallbackIcon size={iconSize} />;
  }
};

export { TransactionIconWithNetworkBadge as TransactionIcon };
