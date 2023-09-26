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
import { isBitcoinNetwork } from '../../network/utils/isBitcoinNetwork';

// this is used for core web
@injectable()
export class AvalancheBridgeAsset extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET];

  constructor(
    private bridgeService: BridgeService,
    private accountsService: AccountsService,
    private balanceAggregatorService: BalanceAggregatorService,
    private networkService: NetworkService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const params = request.params || [];
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

    const asset: Asset | undefined = assetSymbol && assets?.[assetSymbol];

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

    const action = {
      ...request,
      displayData: {
        currentBlockchain,
        sourceNetwork,
        targetNetwork,
        amountStr,
        asset,
        token,
      },
      tabId: request.site.tabId,
    };

    await this.openApprovalWindow(action, `approve`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  onActionApproved = async (
    pendingAction: Action,
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

    if (currentBlockchain === Blockchain.BITCOIN) {
      try {
        const btcChainID = this.networkService.isMainnet()
          ? ChainId.BITCOIN
          : ChainId.BITCOIN_TESTNET;

        // Refresh UTXOs before to ensure that it is updated
        this.accountsService.activeAccount &&
          (await this.balanceAggregatorService.updateBalancesForNetworks(
            [btcChainID],
            [this.accountsService.activeAccount]
          ));

        const result = await this.bridgeService.transferBtcAsset(
          amount,
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

        // Refresh UTXOs
        this.accountsService.activeAccount &&
          this.balanceAggregatorService.updateBalancesForNetworks(
            [btcChainID],
            [this.accountsService.activeAccount]
          );
        onSuccess(result);
      } catch (e) {
        onError(e);
      }
    } else {
      try {
        const result = await this.bridgeService.transferAsset(
          currentBlockchain,
          amount,
          asset,
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
        }

        onSuccess(result);
      } catch (e) {
        onError(e);
      }
    }
  };
}
