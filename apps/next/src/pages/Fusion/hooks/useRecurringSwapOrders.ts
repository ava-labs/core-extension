import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { truncateAddress } from '@avalabs/k2-alpine';
import { ChainId } from '@avalabs/core-chains-sdk';
import { bigIntToString } from '@avalabs/core-utils-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { ERC_ZERO_ADDRESS } from '@avalabs/fusion-sdk';
import type { Address } from 'viem';

import {
  toast,
  useAccountsContext,
  useErrorMessage,
  useNetworkContext,
} from '@core/ui';
import { isUserRejectionError, Monitoring } from '@core/common';
import type { FungibleTokenBalance } from '@core/types';

import { useAllTokens } from '@/hooks/useAllTokens';

import { useTransferManager } from '../contexts/hooks/useTransferManager';
import { buildChain } from '../contexts/hooks/useAssetAndChain/lib/buildChain';
import type { RecurringSignerContext } from '../lib/signers';

import type { FrequencyUnit } from '../contexts/RecurringSwapContext';
import { useIsRecurringSwapsEnabled } from './useIsRecurringSwapsEnabled';
import { useSubscribeRecurringSwapNotifications } from './useSubscribeRecurringSwapNotifications';
import {
  mapStatus,
  useOptimisticOrderStatuses,
  type RecurringSwapOrderStatus,
} from './useOptimisticOrderStatuses';

export type { RecurringSwapOrderStatus };

export type RecurringSwapOrderToken = {
  symbol: string;
  coreChainId: number;
  logoUri?: string;
};

export type RecurringSwapOrderAction = 'pause' | 'unpause' | 'cancel';

export type RecurringSwapOrder = {
  id: string;
  status: RecurringSwapOrderStatus;
  sourceToken: RecurringSwapOrderToken;
  targetToken: RecurringSwapOrderToken;
  amountPerSwap: number;
  frequencyQuantity: number;
  frequencyUnit: FrequencyUnit;
  ordersTotal: number;
  ordersExecuted: number;
  nextSwapAt: number | null;
  /** In-flight order action (set while its approval / broadcast is pending). */
  pendingAction?: RecurringSwapOrderAction;
};

// Recurring swaps are C-Chain only for now.
const RECURRING_CHAIN_ID = ChainId.AVALANCHE_MAINNET_ID;

type UseRecurringSwapOrdersResult = {
  orders: RecurringSwapOrder[];
  scheduledCount: number;
  isLoading: boolean;
  pauseOrder: (id: string) => void;
  unpauseOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
};

const toOrderToken = (
  token: FungibleTokenBalance | undefined,
  fallbackAddress: string,
  fallbackChainId: number,
): RecurringSwapOrderToken =>
  token
    ? {
        symbol: token.symbol,
        coreChainId: token.coreChainId,
        logoUri: token.logoUri,
      }
    : {
        symbol: truncateAddress(fallbackAddress),
        coreChainId: fallbackChainId,
      };

export const useRecurringSwapOrders = (): UseRecurringSwapOrdersResult => {
  const isRecurringSwapsEnabled = useIsRecurringSwapsEnabled();
  const { manager } = useTransferManager();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();
  const getTranslatedError = useErrorMessage();

  const address = active?.addressC as Address | undefined;

  const networks = useMemo(() => {
    const network = getNetwork(RECURRING_CHAIN_ID);
    return network ? [network] : [];
  }, [getNetwork]);

  const sourceChain = useMemo(
    () => buildChain(RECURRING_CHAIN_ID, getNetwork),
    [getNetwork],
  );

  // Full token list (not just held tokens) so we can resolve the
  // metadata for an order's target token even when the user doesn't hold it.
  const tokens = useAllTokens(networks, true);

  const { tokensByAddress, nativeToken } = useMemo(() => {
    const lookup = new Map<string, FungibleTokenBalance>();
    let native: FungibleTokenBalance | undefined;

    for (const token of tokens) {
      if (token.type === TokenType.NATIVE) {
        native = token;
      } else if ('address' in token && token.address) {
        lookup.set(token.address.toLowerCase(), token);
      }
    }

    return { tokensByAddress: lookup, nativeToken: native };
  }, [tokens]);

  const resolveToken = useCallback(
    (tokenAddress: string): FungibleTokenBalance | undefined =>
      tokenAddress.toLowerCase() === ERC_ZERO_ADDRESS.toLowerCase()
        ? nativeToken
        : tokensByAddress.get(tokenAddress.toLowerCase()),
    [nativeToken, tokensByAddress],
  );

  const {
    data: fetchedOrders = [],
    status,
    refetch,
  } = useQuery({
    queryKey: ['recurringSwapOrders', address, manager?.id],
    enabled: isRecurringSwapsEnabled,
    queryFn:
      manager && address
        ? () =>
            manager.recurring
              .listOrders({ address, chainId: RECURRING_CHAIN_ID })
              .then((response) => response.orders)
        : skipToken,
  });

  // `pending` covers both the initial fetch and the window before the manager /
  // address are ready (when the query is still `skipToken`), so consumers don't
  // briefly see an empty "0 scheduled" list. Background refetches keep the
  // status at `success`, so they don't flip back to a loading state.
  const isLoading = isRecurringSwapsEnabled && status === 'pending';

  const [pendingActionById, setPendingActionById] = useState<
    Map<string, RecurringSwapOrderAction>
  >(() => new Map());

  // Server status only flips once Markr observes the on-chain event, so we
  // overlay an optimistic status for immediate feedback (shared across hook
  // instances) and drop terminal orders from the list.
  const { optimisticStatusById, setOptimisticStatus } =
    useOptimisticOrderStatuses(fetchedOrders);

  const orders = useMemo<RecurringSwapOrder[]>(
    () =>
      fetchedOrders.reduce<RecurringSwapOrder[]>((acc, order) => {
        const effectiveStatus =
          optimisticStatusById.get(order.orderId) ?? mapStatus(order.status);

        if (
          effectiveStatus === 'completed' ||
          effectiveStatus === 'cancelled'
        ) {
          return acc;
        }

        const sourceTokenBalance = resolveToken(order.tokenIn);
        const targetTokenBalance = resolveToken(order.tokenOut);
        const decimals = sourceTokenBalance?.decimals ?? 18;
        const isPaused = effectiveStatus === 'paused';

        acc.push({
          id: order.orderId,
          status: effectiveStatus,
          sourceToken: toOrderToken(
            sourceTokenBalance,
            order.tokenIn,
            order.chainId,
          ),
          targetToken: toOrderToken(
            targetTokenBalance,
            order.tokenOut,
            order.chainId,
          ),
          amountPerSwap: Number(bigIntToString(order.amount, decimals)),
          frequencyQuantity: order.frequency.value,
          frequencyUnit: order.frequency.unit,
          ordersTotal: order.numberOfOrders,
          ordersExecuted: order.executedOrders,
          // A paused schedule has no upcoming execution until it resumes.
          nextSwapAt:
            isPaused || order.nextExecutionAt === null
              ? null
              : order.nextExecutionAt * 1000,
          pendingAction: pendingActionById.get(order.orderId),
        });

        return acc;
      }, []),
    [fetchedOrders, optimisticStatusById, pendingActionById, resolveToken],
  );

  // Subscribe the device to push updates for every order still on the books
  // (active + paused; terminal orders are already filtered out of `orders`).
  // The backend upsert is idempotent and the service worker gates it behind the
  // Balance changes preference, so this is safe to fire whenever the set changes.
  const activeOrderIds = useMemo(
    () => orders.map((order) => order.id),
    [orders],
  );
  useSubscribeRecurringSwapNotifications(activeOrderIds);

  // Latest orders snapshot for the action callbacks, so building the approval
  // note (token symbols) doesn't churn their identities every render.
  const ordersRef = useRef<RecurringSwapOrder[]>(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const runOrderAction = useCallback(
    async (id: string, action: RecurringSwapOrderAction) => {
      if (!manager || !address || !sourceChain) {
        return;
      }

      const order = ordersRef.current.find((entry) => entry.id === id);

      setPendingActionById((current) => new Map(current).set(id, action));

      const orderId = id as `0x${string}`;
      // Rides with the request onto `step.signerContext` so the approval screen
      // can render token symbols (the SDK's synthetic quote ships empty ones).
      const signerContext: RecurringSignerContext = {
        fromTokenSymbol: order?.sourceToken.symbol,
        toTokenSymbol: order?.targetToken.symbol,
      };
      const params = { orderId, address, sourceChain, signerContext };

      try {
        if (action === 'pause') {
          await manager.recurring.executePause(params);
          setOptimisticStatus(id, 'paused');
        } else if (action === 'unpause') {
          await manager.recurring.executeUnpause(params);
          setOptimisticStatus(id, 'active');
        } else {
          await manager.recurring.executeCancellation(params);
          setOptimisticStatus(id, 'cancelled');
        }

        refetch();
      } catch (err) {
        if (isUserRejectionError(err)) {
          return;
        }

        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.SWAP,
        );

        const { title, hint } = getTranslatedError(err);
        toast.error(title, { description: hint });
      } finally {
        setPendingActionById((current) => {
          const next = new Map(current);
          next.delete(id);
          return next;
        });
      }
    },
    [
      manager,
      address,
      sourceChain,
      refetch,
      getTranslatedError,
      setOptimisticStatus,
    ],
  );

  const pauseOrder = useCallback(
    (id: string) => runOrderAction(id, 'pause'),
    [runOrderAction],
  );
  const unpauseOrder = useCallback(
    (id: string) => runOrderAction(id, 'unpause'),
    [runOrderAction],
  );
  const cancelOrder = useCallback(
    (id: string) => runOrderAction(id, 'cancel'),
    [runOrderAction],
  );

  // Paused schedules are still on the books, so they count toward "scheduled".
  const scheduledCount = orders.length;

  return {
    orders,
    scheduledCount,
    isLoading,
    pauseOrder,
    unpauseOrder,
    cancelOrder,
  };
};
