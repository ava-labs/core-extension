import { useCallback, useMemo, useState } from 'react';

import type { FrequencyUnit } from '../contexts/RecurringSwapContext';

// Minimal token shape needed to render an order's pair icon and labels. The
// real Fusion SDK order will carry token address/chain references that we map
// down to this shape.
export type RecurringSwapOrderToken = {
  symbol: string;
  coreChainId: number;
  logoUri?: string;
};

export type RecurringSwapOrderStatus = 'active' | 'completed' | 'cancelled';

export type RecurringSwapOrder = {
  id: string;
  status: RecurringSwapOrderStatus;
  sourceToken: RecurringSwapOrderToken;
  targetToken: RecurringSwapOrderToken;
  // Amount swapped on each execution, denominated in the source token.
  amountPerSwap: number;
  frequencyQuantity: number;
  frequencyUnit: FrequencyUnit;
  ordersTotal: number;
  ordersExecuted: number;
  // Epoch milliseconds for the next scheduled execution, or null once the
  // schedule has finished / been cancelled.
  nextSwapAt: number | null;
};

// Avalanche C-Chain. The Fusion recurring-swap flow is C-Chain only for now.
const AVALANCHE_C_CHAIN_ID = 43114;

const DAY_MS = 24 * 60 * 60 * 1000;

// TODO: Replace this placeholder data with the real recurring-orders query
// once the Fusion SDK exposes it. The hook's public shape (orders + cancel)
// is intended to stay stable when that wiring lands.
const MOCK_ORDERS: RecurringSwapOrder[] = [
  {
    id: 'mock-order-1',
    status: 'active',
    sourceToken: {
      symbol: 'USDC',
      coreChainId: AVALANCHE_C_CHAIN_ID,
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/29mOyHuS6koJfoF8WNivTy/9c5e4b101e5ab7545f26b541f45b0fe2/usdc.png',
    },
    targetToken: {
      symbol: 'AVAX',
      coreChainId: AVALANCHE_C_CHAIN_ID,
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/3e4b8ff10b69bfa31e70080a4b142cd0/avalanche-avax-logo.svg',
    },
    amountPerSwap: 30,
    frequencyQuantity: 4,
    frequencyUnit: 'week',
    ordersTotal: 4,
    ordersExecuted: 1,
    nextSwapAt: Date.now() + 20 * DAY_MS,
  },
  {
    id: 'mock-order-2',
    status: 'active',
    sourceToken: {
      symbol: 'USDC',
      coreChainId: AVALANCHE_C_CHAIN_ID,
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/29mOyHuS6koJfoF8WNivTy/9c5e4b101e5ab7545f26b541f45b0fe2/usdc.png',
    },
    targetToken: {
      symbol: 'BTC.b',
      coreChainId: AVALANCHE_C_CHAIN_ID,
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/aeab859f-78aa-4a05-8f77-b7e3492beb39/12c3dad31c4e71389d11661e4504c34b/43114-0x152b9d0FdC40C096757F570A51E494bd4b943E50.png',
    },
    amountPerSwap: 500,
    frequencyQuantity: 4,
    frequencyUnit: 'week',
    ordersTotal: 4,
    ordersExecuted: 0,
    nextSwapAt: Date.now() + 2 * DAY_MS,
  },
  {
    id: 'mock-order-3',
    status: 'active',
    sourceToken: {
      symbol: 'USDC',
      coreChainId: AVALANCHE_C_CHAIN_ID,
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/29mOyHuS6koJfoF8WNivTy/9c5e4b101e5ab7545f26b541f45b0fe2/usdc.png',
    },
    targetToken: {
      symbol: 'WETH.e',
      coreChainId: AVALANCHE_C_CHAIN_ID,
      logoUri:
        'https://images.ctfassets.net/gcj8jwzm6086/accf4706-937e-48fd-8e5c-a96321ab827b/620da5219fc362787d4ab93cc3328223/43114-0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB.png',
    },
    amountPerSwap: 20,
    frequencyQuantity: 1,
    frequencyUnit: 'month',
    ordersTotal: 6,
    ordersExecuted: 2,
    nextSwapAt: Date.now() + 9 * DAY_MS,
  },
];

type UseRecurringSwapOrdersResult = {
  orders: RecurringSwapOrder[];
  scheduledCount: number;
  isLoading: boolean;
  cancelOrder: (id: string) => void;
};

export const useRecurringSwapOrders = (): UseRecurringSwapOrdersResult => {
  const [orders, setOrders] = useState<RecurringSwapOrder[]>(MOCK_ORDERS);

  const cancelOrder = useCallback((id: string) => {
    setOrders((current) => current.filter((order) => order.id !== id));
  }, []);

  const scheduledCount = useMemo(
    () => orders.filter((order) => order.status === 'active').length,
    [orders],
  );

  return {
    orders,
    scheduledCount,
    isLoading: false,
    cancelOrder,
  };
};
