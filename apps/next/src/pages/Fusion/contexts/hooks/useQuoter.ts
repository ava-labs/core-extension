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
}: Required<UseQuoterProps>) =>
  manager.getQuoter({
    amount,
    slippageBps: 100, // TODO:
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
    ],
  );
