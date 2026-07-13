import type { HypercoreLedgerUpdate } from '../schemas';

/**
 * Semantic label key for a ledger row.
 */
export type HypercoreLedgerLabel =
  | 'deposit'
  | 'withdraw'
  | 'sent'
  | 'received'
  | 'transferToPerp'
  | 'transferToSpot'
  | 'transfer'
  | 'liquidation'
  | 'other';

export type HypercoreLedgerDisplay = {
  readonly label: HypercoreLedgerLabel;
  /** Unsigned token amount, e.g. `0.1`. */
  readonly amount: string;
  readonly symbol: string;
  /** Signed USD value for the fiat line; undefined when there's nothing to show. */
  readonly usdValue?: number;
  readonly direction: 'positive' | 'negative' | 'neutral';
  readonly from?: string;
  readonly to?: string;
  readonly rawType: string;
};

const formatAmount = (value: string | undefined) => {
  if (value === undefined || value === '') {
    return '';
  }
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return value;
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(
    parsed,
  );
};

const toUsd = (value: string | undefined, sign: 1 | -1 | 0) => {
  if (value === undefined || value === '') {
    return undefined;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed * (sign === 0 ? 1 : sign) : undefined;
};

/**
 * Derives label, amount, signed USD value, and counterparties for a HyperCore
 * ledger update from the owner's perspective.
 */
export const getHypercoreLedgerDisplay = (
  update: HypercoreLedgerUpdate,
  evmAddress: string,
): HypercoreLedgerDisplay => {
  const { delta } = update;
  const owner = evmAddress.toLowerCase();
  const isOutgoing = delta.user?.toLowerCase() === owner;

  switch (delta.type) {
    case 'deposit':
      return {
        label: 'deposit',
        amount: formatAmount(delta.usdc),
        symbol: 'USDC',
        usdValue: toUsd(delta.usdc, 1),
        direction: 'positive',
        to: evmAddress,
        rawType: delta.type,
      };
    case 'withdraw':
      return {
        label: 'withdraw',
        amount: formatAmount(delta.usdc),
        symbol: 'USDC',
        usdValue: toUsd(delta.usdc, -1),
        direction: 'negative',
        from: evmAddress,
        rawType: delta.type,
      };
    case 'send':
    case 'spotTransfer':
      return {
        label: isOutgoing ? 'sent' : 'received',
        amount: formatAmount(delta.amount),
        symbol: delta.token ?? 'USDC',
        usdValue: toUsd(delta.usdcValue, isOutgoing ? -1 : 1),
        direction: isOutgoing ? 'negative' : 'positive',
        from: delta.user,
        to: delta.destination,
        rawType: delta.type,
      };
    case 'internalTransfer':
      return {
        label: 'transfer',
        amount: formatAmount(delta.usdc),
        symbol: 'USDC',
        usdValue: toUsd(delta.usdc, isOutgoing ? -1 : 1),
        direction: isOutgoing ? 'negative' : 'positive',
        from: delta.user,
        to: delta.destination,
        rawType: delta.type,
      };
    case 'accountClassTransfer':
      return {
        label: delta.toPerp ? 'transferToPerp' : 'transferToSpot',
        amount: formatAmount(delta.usdc),
        symbol: 'USDC',
        usdValue: toUsd(delta.usdc, 0),
        direction: 'neutral',
        rawType: delta.type,
      };
    case 'liquidation':
      return {
        label: 'liquidation',
        amount: formatAmount(delta.usdcValue ?? delta.usdc),
        symbol: 'USDC',
        usdValue: toUsd(delta.usdcValue ?? delta.usdc, -1),
        direction: 'negative',
        rawType: delta.type,
      };
    default:
      return {
        label: 'other',
        amount: formatAmount(delta.usdcValue ?? delta.usdc),
        symbol: 'USDC',
        usdValue: toUsd(delta.usdcValue ?? delta.usdc, 0),
        direction: 'neutral',
        rawType: delta.type,
      };
  }
};
