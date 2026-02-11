import { useMemo } from 'react';
import { Chain, Asset, TransferManager } from '@avalabs/unified-asset-transfer';

export type UseQuoterProps = Partial<{
  manager: TransferManager;
  fromAddress: string;
  toAddress: string;
  sourceAsset: Asset;
  sourceChain: Chain;
  targetAsset: Asset;
  targetChain: Chain;
  amount: bigint;
  slippageBps: number;
}>;

export const useQuoter = ({
  manager,
  fromAddress,
  toAddress,
  sourceAsset,
  sourceChain,
  targetAsset,
  targetChain,
  amount,
  slippageBps,
}: UseQuoterProps) => {
  const quoterProps = useMemoizedProps({
    manager,
    fromAddress,
    toAddress,
    sourceAsset,
    sourceChain,
    targetAsset,
    targetChain,
    amount,
    slippageBps,
  });

  return useMemo(
    () => (hasRequiredParams(quoterProps) ? buildQuoter(quoterProps) : null),
    [quoterProps],
  );
};

const hasRequiredParams = (
  props: UseQuoterProps,
): props is Required<UseQuoterProps> => Object.values(props).every(Boolean);

const buildQuoter = ({
  manager,
  fromAddress,
  toAddress,
  sourceAsset,
  sourceChain,
  targetAsset,
  targetChain,
  amount,
  slippageBps,
}: Required<UseQuoterProps>) =>
  manager.getQuoter({
    amount,
    slippageBps,
    fromAddress,
    sourceAsset,
    sourceChain,
    targetAsset,
    targetChain,
    toAddress,
  });

const useMemoizedProps = ({
  manager,
  fromAddress,
  toAddress,
  sourceAsset,
  sourceChain,
  targetAsset,
  targetChain,
  amount,
  slippageBps,
}: UseQuoterProps) =>
  useMemo(
    () => ({
      manager,
      fromAddress,
      toAddress,
      sourceAsset,
      sourceChain,
      targetAsset,
      targetChain,
      amount,
      slippageBps,
    }),
    [
      manager,
      fromAddress,
      toAddress,
      sourceAsset,
      sourceChain,
      targetAsset,
      targetChain,
      amount,
      slippageBps,
    ],
  );
