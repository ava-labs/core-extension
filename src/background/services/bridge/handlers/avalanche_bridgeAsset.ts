import { NetworkService } from '@src/background/services/network/NetworkService';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import {
  Asset,
  Assets,
  BitcoinConfigAsset,
  Blockchain,
  EthereumConfigAsset,
  getAssets,
  isNativeAsset,
} from '@avalabs/bridge-sdk';
import Big from 'big.js';
import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { BridgeService } from '../BridgeService';
import { BalanceAggregatorService } from '../../balances/BalanceAggregatorService';
import { ChainId } from '@avalabs/chains-sdk';
import { blockchainToNetwork } from '@src/pages/Bridge/utils/blockchainConversion';
import { findTokenForAsset } from '@src/pages/Bridge/utils/findTokenForAsset';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { isBitcoinNetwork } from '../../network/utils/isBitcoinNetwork';
import { AnalyticsServicePosthog } from '../../analytics/AnalyticsServicePosthog';
import { BridgeActionDisplayData } from '../models';

type BridgeActionParams = [
  currentBlockchain: Blockchain,
  amountStr: string,
  asset: Asset
];

// this is used for core web
@injectable()
export class AvalancheBridgeAsset extends DAppRequestHandler<BridgeActionParams> {
  methods = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET];

  constructor(
    private bridgeService: BridgeService,
    private accountsService: AccountsService,
    private balanceAggregatorService: BalanceAggregatorService,
    private networkService: NetworkService,
    private analyticsServicePosthog: AnalyticsServicePosthog
  ) {
    super();
  }

  handleAuthenticated = async (rpcCall) => {
    const { request } = rpcCall;
    const params: BridgeActionParams = request.params || [];
    const currentBlockchain = params[0];

    if (!currentBlockchain) {
      return {
        ...request,
        error: 'Missing param: blockchain',
      };
    }
    const amountStr = params[1];
    if (!amountStr) {
      return {
        ...request,
        error: 'Missing param: amount',
      };
    }

    // map asset from params to bridge config asset
    const bridgeConfig = this.bridgeService.bridgeConfig;
    const config = bridgeConfig.config;
    const assets: Assets | undefined =
      config && getAssets(currentBlockchain, config);
    const assetSymbol =
      currentBlockchain === Blockchain.BITCOIN ? 'BTC' : params[2]?.symbol;

    const asset: Asset | undefined =
      assetSymbol && assets ? assets[assetSymbol] : undefined;

    if (!asset) {
      return {
        ...request,
        error: 'Invalid param: unknown asset',
      };
    }

    if (
      currentBlockchain !== asset.nativeNetwork &&
      (isNativeAsset(asset) || currentBlockchain !== asset.wrappedNetwork)
    ) {
      return {
        ...request,
        error: 'Invalid param: asset',
      };
    }

    const networks = Object.values(
      (await this.networkService.allNetworks.promisify()) ?? {}
    );

    const sourceNetwork = blockchainToNetwork(
      currentBlockchain,
      networks,
      this.bridgeService.bridgeConfig,
      this.networkService.activeNetwork?.isTestnet
    );

    const wrappedNetwork = isNativeAsset(asset)
      ? (
          assets?.[asset.wrappedAssetSymbol] as
            | BitcoinConfigAsset
            | EthereumConfigAsset
            | undefined
        )?.wrappedNetwork
      : asset.wrappedNetwork;

    const targetNetwork =
      wrappedNetwork &&
      blockchainToNetwork(
        currentBlockchain === asset.nativeNetwork
          ? ((wrappedNetwork ?? '') as Blockchain)
          : asset.nativeNetwork,
        networks,
        this.bridgeService.bridgeConfig,
        this.networkService.activeNetwork?.isTestnet
      );

    const { activeAccount } = this.accountsService;
    // refresh balances so we have the correct balance information for the asset
    sourceNetwork &&
      activeAccount &&
      (await this.balanceAggregatorService.updateBalancesForNetworks(
        [sourceNetwork.chainId],
        [activeAccount]
      ));

    const balanceAddress =
      sourceNetwork && isBitcoinNetwork(sourceNetwork)
        ? activeAccount?.addressBTC
        : activeAccount?.addressC;

    const token =
      sourceNetwork &&
      balanceAddress &&
      findTokenForAsset(
        asset.symbol,
        asset.nativeNetwork,
        Object.values(
          this.balanceAggregatorService.balances?.[sourceNetwork.chainId]?.[
            balanceAddress
          ] ?? {}
        )
      );

    const action: Action<BridgeActionDisplayData> = {
      ...request,
      displayData: {
        currentBlockchain,
        sourceNetwork,
        targetNetwork,
        amountStr,
        asset,
        token,
        gasLimit: await this.bridgeService.estimateGas(
          currentBlockchain,
          new Big(amountStr),
          asset
        ),
      },
    };

    await openApprovalWindow(action, `approve`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  #getSourceChainId = (currentBlockchain: Blockchain) => {
    const isMainnet = this.networkService.isMainnet();

    switch (currentBlockchain) {
      case Blockchain.BITCOIN:
        return isMainnet ? ChainId.BITCOIN : ChainId.BITCOIN_TESTNET;

      case Blockchain.AVALANCHE:
        return isMainnet
          ? ChainId.AVALANCHE_MAINNET_ID
          : ChainId.AVALANCHE_TESTNET_ID;

      case Blockchain.ETHEREUM:
        return isMainnet
          ? ChainId.ETHEREUM_HOMESTEAD
          : ChainId.ETHEREUM_TEST_SEPOLIA;

      default:
        throw 'Unknown source chain';
    }
  };

  onActionApproved = async (
    pendingAction: Action<BridgeActionDisplayData>,
    _result, // Unused
    onSuccess,
    onError,
    frontendTabId?: number
  ) => {
    const currentBlockchain = pendingAction?.displayData.currentBlockchain;
    const amountStr = pendingAction?.displayData.amountStr;
    const asset = pendingAction?.displayData.asset;
    const denomination = asset.denomination;
    const amount = bnToBig(stringToBN(amountStr, denomination), denomination);
    const sourceChainId = this.#getSourceChainId(currentBlockchain);

    if (currentBlockchain === Blockchain.BITCOIN) {
      try {
        // Refresh UTXOs before to ensure that it is updated
        this.accountsService.activeAccount &&
          (await this.balanceAggregatorService.updateBalancesForNetworks(
            [sourceChainId],
            [this.accountsService.activeAccount]
          ));

        const result = await this.bridgeService.transferBtcAsset(
          amount,
          undefined,
          frontendTabId
        );
        await this.bridgeService.createTransaction(
          Blockchain.BITCOIN,
          result.hash,
          Date.now(),
          Blockchain.AVALANCHE,
          amount,
          'BTC'
        );

        this.analyticsServicePosthog.captureEncryptedEvent({
          name: 'avalanche_bridgeAsset_success',
          windowId: crypto.randomUUID(),
          properties: {
            address: this.accountsService.activeAccount?.addressBTC,
            txHash: result.hash,
            chainId: sourceChainId,
          },
        });

        // Refresh UTXOs
        this.accountsService.activeAccount &&
          this.balanceAggregatorService.updateBalancesForNetworks(
            [sourceChainId],
            [this.accountsService.activeAccount]
          );
        onSuccess(result);
      } catch (e) {
        this.analyticsServicePosthog.captureEncryptedEvent({
          name: 'avalanche_bridgeAsset_failed',
          windowId: crypto.randomUUID(),
          properties: {
            address: this.accountsService.activeAccount?.addressBTC,
            chainId: sourceChainId,
          },
        });

        onError(e);
      }
    } else {
      try {
        const result = await this.bridgeService.transferAsset(
          currentBlockchain,
          amount,
          asset as Exclude<Asset, BitcoinConfigAsset>,
          pendingAction.displayData.gasSettings,
          frontendTabId
        );
        if (result) {
          await this.bridgeService.createTransaction(
            currentBlockchain,
            result.hash,
            Date.now(),
            Blockchain.AVALANCHE === currentBlockchain
              ? Blockchain.ETHEREUM
              : Blockchain.AVALANCHE,
            amount,
            asset.symbol
          );

          this.analyticsServicePosthog.captureEncryptedEvent({
            name: 'avalanche_bridgeAsset_success',
            windowId: crypto.randomUUID(),
            properties: {
              address: this.accountsService.activeAccount?.addressC,
              txHash: result.hash,
              chainId: sourceChainId,
            },
          });
        }

        onSuccess(result);
      } catch (e) {
        this.analyticsServicePosthog.captureEncryptedEvent({
          name: 'avalanche_bridgeAsset_failed',
          windowId: crypto.randomUUID(),
          properties: {
            address: this.accountsService.activeAccount?.addressC,
            chainId: sourceChainId,
          },
        });

        onError(e);
      }
    }
  };
}
