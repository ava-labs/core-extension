import { NetworkService } from '@src/background/services/network/NetworkService';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import {
  AppConfig,
  Asset,
  AssetType,
  Assets,
  BitcoinConfigAsset,
  Blockchain,
  EthereumConfigAsset,
  btcToSatoshi,
  getAssets,
  isNativeAsset,
  transferAssetBTC,
  transferAssetEVM,
} from '@avalabs/core-bridge-sdk';
import Big from 'big.js';
import { bnToBig, stringToBN } from '@avalabs/core-utils-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { BridgeService } from '../BridgeService';
import { BalanceAggregatorService } from '../../balances/BalanceAggregatorService';
import { ChainId } from '@avalabs/core-chains-sdk';
import { blockchainToNetwork } from '@src/pages/Bridge/utils/blockchainConversion';
import { findTokenForAsset } from '@src/pages/Bridge/utils/findTokenForAsset';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { isBitcoinNetwork } from '../../network/utils/isBitcoinNetwork';
import { AnalyticsServicePosthog } from '../../analytics/AnalyticsServicePosthog';
import { BridgeActionDisplayData } from '../models';
import { WalletService } from '../../wallet/WalletService';
import { ContractTransaction } from 'ethers';
import { FeatureFlagService } from '../../featureFlags/FeatureFlagService';
import { FeatureGates } from '../../featureFlags/models';
import { isWalletConnectAccount } from '../../accounts/utils/typeGuards';
import { NetworkFeeService } from '../../networkFee/NetworkFeeService';
import {
  buildBtcTx,
  getBtcInputUtxos,
  validateBtcSend,
} from '@src/utils/send/btcSendUtils';
import { resolve } from '@src/utils/promiseResolver';
import { TokenType, TokenWithBalanceBTC } from '@avalabs/vm-module-types';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';

type BridgeActionParams = [
  currentBlockchain: Blockchain,
  amountStr: string,
  asset: Asset,
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
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private walletService: WalletService,
    private featureFlagService: FeatureFlagService,
    private networkFeeService: NetworkFeeService,
  ) {
    super();
  }

  handleAuthenticated = async ({ request, scope }) => {
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
    const config = this.#getConfig();
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
      (await this.networkService.allNetworks.promisify()) ?? {},
    );

    const activeNetwork = await this.networkService.getNetwork(scope);

    const sourceNetwork = blockchainToNetwork(
      currentBlockchain,
      networks,
      this.bridgeService.bridgeConfig,
      activeNetwork?.isTestnet,
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
        activeNetwork?.isTestnet,
      );

    const { activeAccount } = this.accountsService;
    if (!sourceNetwork) {
      return {
        ...request,
        error: 'Unknown active network',
      };
    }

    if (!activeAccount) {
      return {
        ...request,
        error: 'No active account',
      };
    }

    // get the correct balance information for the asset
    const { tokens } =
      await this.balanceAggregatorService.getBalancesForNetworks(
        [sourceNetwork.chainId],
        [activeAccount],
        [
          asset.assetType === AssetType.ERC20
            ? TokenType.ERC20
            : TokenType.NATIVE,
        ],
      );

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
        Object.values(tokens?.[sourceNetwork.chainId]?.[balanceAddress] ?? {}),
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
          asset,
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

  #getSourceAccount = () => {
    if (!this.accountsService.activeAccount) {
      throw new Error('no active account found');
    }

    return this.accountsService.activeAccount;
  };

  #getConfig = (): AppConfig => {
    if (!this.bridgeService.bridgeConfig.config) {
      throw new Error('missing bridge config');
    }

    return this.bridgeService.bridgeConfig.config;
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
    frontendTabId?: number,
  ) => {
    const currentBlockchain = pendingAction?.displayData.currentBlockchain;

    if (currentBlockchain === Blockchain.UNKNOWN) {
      onError('Unsupported blockchain');
      return;
    }
    try {
      this.featureFlagService.ensureFlagEnabled(FeatureGates.BRIDGE);
    } catch {
      onError('Bridge feature is currently disabled');
      return;
    }

    const amountStr = pendingAction?.displayData.amountStr;
    const asset = pendingAction?.displayData.asset;
    const denomination = asset.denomination;
    const amount = bnToBig(stringToBN(amountStr, denomination), denomination);
    const sourceChainId = this.#getSourceChainId(currentBlockchain);
    const network = await this.networkService.getNetwork(sourceChainId);

    if (!network) {
      onError('Unsupported source network');
      return;
    }

    const feeData = await this.networkFeeService.getNetworkFee(network);

    if (currentBlockchain === Blockchain.BITCOIN) {
      try {
        const account = this.#getSourceAccount();

        if (isWalletConnectAccount(account)) {
          throw new Error(
            'WalletConnect accounts are not supported by Bridge yet',
          );
        }
        const { addressBTC } = account;

        if (!addressBTC) {
          throw new Error('No active account found');
        }

        const balances =
          await this.balanceAggregatorService.getBalancesForNetworks(
            [network.chainId],
            [account],
            [TokenType.NATIVE], // We only care about BTC here, which is a native token
          );

        const highFeeRate = Number(
          (await this.networkFeeService.getNetworkFee(network))?.high
            .maxFeePerGas ?? 0,
        );

        const token = balances.tokens[network.chainId]?.[addressBTC]?.[
          'BTC'
        ] as TokenWithBalanceBTC;

        const btcProvider = await this.networkService.getBitcoinProvider();

        const utxos = await getBtcInputUtxos(btcProvider, token, highFeeRate);

        const hash = await transferAssetBTC({
          fromAccount: addressBTC,
          config: this.#getConfig(),
          amount: btcToSatoshi(amount),
          feeRate:
            Number(pendingAction.displayData.gasSettings?.maxFeePerGas ?? 0) ||
            highFeeRate,
          onStatusChange: () => {},
          onTxHashChange: () => {},
          signAndSendBTC: async ({ amount: signAmount, feeRate, to, from }) => {
            const error = validateBtcSend(
              from,
              {
                address: to,
                amount: signAmount,
                feeRate,
                token,
              },
              utxos,
              !network.isTestnet,
            );

            if (error) {
              throw new Error(
                'Building BTC transaction for Bridge failed: ' + error,
              );
            }

            const { inputs, outputs } = await buildBtcTx(
              addressBTC,
              btcProvider,
              {
                amount: signAmount,
                address: to,
                token,
                feeRate,
              },
            );

            if (!inputs || !outputs) {
              throw new Error('Unable to create transaction');
            }

            const result = await this.walletService.sign(
              { inputs, outputs },
              network,
              frontendTabId,
            );

            return this.networkService.sendTransaction(result, network);
          },
        });

        const [tx, txError] = await resolve(btcProvider.waitForTx(hash));

        if (!tx || txError) {
          throw new Error('Failed to fetch transaction details.');
        }

        await this.bridgeService.createTransaction(
          Blockchain.BITCOIN,
          tx.hash,
          Date.now(),
          Blockchain.AVALANCHE,
          amount,
          'BTC',
        );
        this.analyticsServicePosthog.captureEncryptedEvent({
          name: 'avalanche_bridgeAsset_success',
          windowId: crypto.randomUUID(),
          properties: {
            address: this.accountsService.activeAccount?.addressBTC,
            txHash: tx.hash,
            chainId: sourceChainId,
          },
        });
        onSuccess(tx);
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
        const txHash = await transferAssetEVM({
          currentBlockchain,
          amount,
          account: this.#getSourceAccount().addressC,
          asset,
          avalancheProvider: await this.networkService.getAvalancheProvider(),
          ethereumProvider: await this.networkService.getEthereumProvider(),
          config: this.#getConfig(),
          signAndSendEVM: async (txData) => {
            const tx = txData as ContractTransaction; // TODO: update types in the SDK?

            const provider = (await getProviderForNetwork(
              network,
            )) as JsonRpcBatchInternal;

            const nonce = await provider.getTransactionCount(
              this.#getSourceAccount().addressC,
            );

            // Get fee-related properties from the approval screen first,
            // then use current instant (high) fee rate as a fallback.
            const customGasSettings = pendingAction.displayData.gasSettings;
            const maxFeePerGas =
              customGasSettings?.maxFeePerGas ?? feeData?.high.maxFeePerGas;
            const maxPriorityFeePerGas =
              customGasSettings?.maxPriorityFeePerGas ??
              feeData?.high.maxPriorityFeePerGas;

            if (!maxFeePerGas) {
              throw new Error('Required option missing: maxFeePerGas');
            }

            const signResult = await this.walletService.sign(
              {
                ...tx,
                nonce,
                maxFeePerGas,
                maxPriorityFeePerGas,
              },
              network,
              frontendTabId,
            );

            return this.networkService.sendTransaction(signResult, network);
          },
          // Unused, but required.
          onStatusChange: () => {},
          onTxHashChange: () => {},
        });

        if (txHash) {
          await this.bridgeService.createTransaction(
            currentBlockchain,
            txHash,
            Date.now(),
            Blockchain.AVALANCHE === currentBlockchain
              ? Blockchain.ETHEREUM
              : Blockchain.AVALANCHE,
            amount,
            asset.symbol,
          );

          this.analyticsServicePosthog.captureEncryptedEvent({
            name: 'avalanche_bridgeAsset_success',
            windowId: crypto.randomUUID(),
            properties: {
              address: this.accountsService.activeAccount?.addressC,
              txHash: txHash,
              chainId: sourceChainId,
            },
          });
        }

        onSuccess(txHash);
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
