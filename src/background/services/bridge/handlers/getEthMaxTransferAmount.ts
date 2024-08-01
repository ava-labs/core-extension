import {
  Blockchain,
  getAssets,
  getMaxTransferAmount as getEVMMaxTransferAmount,
} from '@avalabs/core-bridge-sdk';
import { bnToBig } from '@avalabs/core-utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { networkToBlockchain } from '@src/pages/Bridge/utils/blockchainConversion';
import Big from 'big.js';
import { injectable } from 'tsyringe';
import { NetworkService } from '../../network/NetworkService';
import { BridgeService } from '../BridgeService';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { BalanceAggregatorService } from '../../balances/BalanceAggregatorService';
import { AccountsService } from '../../accounts/AccountsService';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT,
  Big | null,
  [currentAsset: string]
>;

@injectable()
export class GetEthMaxTransferAmountHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT as const;

  constructor(
    private bridgeService: BridgeService,
    private networkService: NetworkService,
    private balanceAggregatorService: BalanceAggregatorService,
    private accountsService: AccountsService
  ) {}

  handle: HandlerType['handle'] = async ({ request, scope }) => {
    const [currentAsset] = request.params;

    const activeNetwork = await this.networkService.getNetwork(scope);
    const activeAccount = this.accountsService.activeAccount;
    const currentBlockchain = networkToBlockchain(activeNetwork);

    if (!activeNetwork || !activeAccount) {
      return {
        ...request,
        error: 'network or account not found',
      };
    }

    if (currentBlockchain !== Blockchain.ETHEREUM) {
      return {
        ...request,
        error: 'not on ethereum network',
      };
    }

    const balances = await this.balanceAggregatorService.getBalancesForNetworks(
      [activeNetwork.chainId],
      [activeAccount]
    );
    const token = Object.values(
      balances[activeNetwork?.chainId]?.[activeAccount?.addressC] ?? {}
    )?.find(({ symbol }) => symbol === currentAsset);

    try {
      const config = this.bridgeService.bridgeConfig.config;
      const provider = getProviderForNetwork(activeNetwork);

      if (!config || !(provider instanceof JsonRpcBatchInternal) || !token) {
        return {
          ...request,
          error: 'unable to determine max amount',
        };
      }
      const ethereumAssets = getAssets(currentBlockchain, config);

      const requiredForGas = await getEVMMaxTransferAmount({
        currentBlockchain,
        balance: bnToBig(token.balance, token.decimals),
        currentAsset,
        assets: ethereumAssets,
        provider,
        config,
      });

      return {
        ...request,
        result: requiredForGas,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };
}
