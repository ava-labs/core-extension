import { useMemo } from 'react';
import { Chain, Asset, TransferManager } from '@avalabs/unified-asset-transfer';

// Extracts keys that are required (not optional) in T
type RequiredKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type UseQuoterPropsBase = {
  manager: TransferManager;
  fromAddress: string;
  toAddress: string;
  sourceAsset: Asset;
  sourceChain: Chain;
  targetAsset: Asset;
  targetChain: Chain;
  amount: bigint;
  slippageBps?: number;
};

type RequiredQuoterProps = Pick<
  UseQuoterPropsBase,
  RequiredKeys<UseQuoterPropsBase>
>;

type OptionalQuoterProps = Exclude<
  keyof UseQuoterPropsBase,
  RequiredKeys<UseQuoterPropsBase>
>;

const OPTIONAL_QUOTER_PROPS: OptionalQuoterProps[] = ['slippageBps'];

export type UseQuoterProps = Partial<UseQuoterPropsBase>;

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
): props is RequiredQuoterProps =>
  Object.entries(props).every(
    ([key, value]) =>
      (OPTIONAL_QUOTER_PROPS as string[]).includes(key) || Boolean(value),
  );

const buildQuoter = ({ manager, ...props }: RequiredQuoterProps) =>
  manager.getQuoter(props);

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
