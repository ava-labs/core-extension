import { stringToBigint, findMatchingBridgeAsset } from '@core/common';
import { TokenWithBalanceERC20 } from '@avalabs/vm-module-types';

export interface BridgeFunctionParams {
  amount: string;
  token: string;
  sourceNetwork: string;
  destinationNetwork: string;
}

export interface BridgeFunctionDeps {
  tokens: any[];
  transferableAssets: any[];
  targetChain: any;
  transfer: (
    config: any,
    amount?: bigint,
    destination?: string,
    asset?: any,
  ) => Promise<any>;
}

export const createBridgeFunction = ({
  tokens,
  transferableAssets,
  targetChain,
  transfer,
}: BridgeFunctionDeps) => {
  return async ({
    amount,
    token,
    sourceNetwork,
    destinationNetwork,
  }: BridgeFunctionParams) => {
    if (!amount) {
      throw new Error('You have to grant the amount you want to bridge.');
    }
    if (!token) {
      throw new Error('You have to grant the token you want to bridge.');
    }
    const tokenData = tokens.find(
      (item) => item.symbol === token,
    ) as TokenWithBalanceERC20;

    if (!tokenData) {
      throw new Error('You have to grant the token you want to bridge.');
    }
    const newAmount = stringToBigint(amount, tokenData?.decimals);

    const foundAsset = findMatchingBridgeAsset(transferableAssets, tokenData);
    if (!foundAsset) {
      throw new Error(`You cannot bridge the token ${token}.`);
    }

    if (!sourceNetwork) {
      throw new Error(
        'You have to grant the source network you want to bridge.',
      );
    }
    if (!destinationNetwork) {
      throw new Error(
        'You have to grant the destination network you want to bridge.',
      );
    }
    const [bridgeType] =
      foundAsset?.destinations[targetChain?.caipId ?? ''] ?? [];
    await transfer(
      {
        bridgeType,
        gasSettings: undefined,
      },
      newAmount,
      destinationNetwork,
      foundAsset,
    );
    return {
      content: `Bridge initiated ${amount}${foundAsset.symbol} to ${destinationNetwork}.`,
    };
  };
};
