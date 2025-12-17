import {
  Asset,
  BitcoinConfigAsset,
  Blockchain,
  BridgeSDKProvider,
  Environment,
  estimateGas as sdkEstimateGas,
  setBridgeEnvironment,
  transferAssetEVM,
  useBridgeSDK,
  WrapStatus,
} from '@avalabs/core-bridge-sdk';
import { ChainId } from '@avalabs/core-chains-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import {
  BridgeState,
  DefaultBridgeState,
  ExtensionRequest,
  PartialBridgeTransaction,
} from '@core/types';
import {
  BridgeCreateTransactionHandler,
  BridgeGetStateHandler,
  BridgeRemoveTransactionHandler,
  BridgeSetIsDevEnvHandler,
} from '@core/service-worker';
import Big from 'big.js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { filter, map } from 'rxjs';
import { useAccountsContext } from './AccountsProvider';
import { useConnectionContext } from './ConnectionProvider';
import { useNetworkContext } from './NetworkProvider';
import { type ContractTransaction, toBeHex } from 'ethers';
import {
  filterBridgeStateToNetwork,
  isBridgeStateUpdateEventListener,
} from '@core/common';

export interface BridgeContext {
  createBridgeTransaction(tx: PartialBridgeTransaction): Promise<void>;
  removeBridgeTransaction(txHash: string): Promise<void>;
  bridgeTransactions: BridgeState['bridgeTransactions'];
  estimateGas: (amount: Big, asset: Asset) => Promise<bigint | undefined>;
  transferEVMAsset: (amount: Big, asset: Asset) => Promise<{ hash: string }>;
  isBridgeDevEnv: boolean;
  setIsBridgeDevEnv: (enabled: boolean) => void;
  bridgeState: BridgeState;
}

const bridgeContext = createContext<BridgeContext>({} as any);

export function BridgeProvider({ children }: { children: any }) {
  const { network } = useNetworkContext();

  useEffect(() => {
    setBridgeEnvironment(
      network?.chainId === ChainId.AVALANCHE_MAINNET_ID
        ? Environment.PROD
        : Environment.TEST,
    );
  }, [network]);

  return (
    <BridgeSDKProvider>
      <InnerBridgeProvider>{children}</InnerBridgeProvider>
    </BridgeSDKProvider>
  );
}

export function useBridgeContext() {
  return useContext(bridgeContext);
}

// This component is separate so it has access to useBridgeSDK
function InnerBridgeProvider({ children }: { children: any }) {
  const { t } = useTranslation();
  const { request, events } = useConnectionContext();
  const { currentBlockchain, bridgeConfig } = useBridgeSDK();
  const { network, avaxProviderC, ethereumProvider } = useNetworkContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const [bridgeState, setBridgeState] =
    useState<BridgeState>(DefaultBridgeState);
  // Separate from bridgeState so they can be filtered to the current network
  const [bridgeTransactions, setBridgeTransactions] = useState<
    BridgeState['bridgeTransactions']
  >({});
  const [isBridgeDevEnv, setIsDevEnvInternal] = useState<boolean>(false);

  useEffect(() => {
    if (!events) {
      return;
    }

    request<BridgeGetStateHandler>({
      method: ExtensionRequest.BRIDGE_GET_STATE,
    }).then((txs) => {
      setBridgeState(txs);
    });

    const subscription = events()
      .pipe(
        filter(isBridgeStateUpdateEventListener),
        map((evt) => evt.value),
      )
      .subscribe((txs) => {
        setBridgeState(txs);
      });

    return () => subscription.unsubscribe();
  }, [events, request]);

  useEffect(() => {
    if (!network) return;
    const filteredState = filterBridgeStateToNetwork(bridgeState, network);

    setBridgeTransactions(filteredState.bridgeTransactions);
    setIsDevEnvInternal(filteredState.isDevEnv);
  }, [bridgeState, network]);

  const createBridgeTransaction = useCallback<
    BridgeContext['createBridgeTransaction']
  >(
    async (bridgeTransaction) => {
      await request<BridgeCreateTransactionHandler>({
        method: ExtensionRequest.BRIDGE_TRANSACTION_CREATE,
        params: bridgeTransaction,
      });
    },
    [request],
  );

  const removeBridgeTransaction = useCallback<
    BridgeContext['removeBridgeTransaction']
  >(
    async (txHash) => {
      await request<BridgeRemoveTransactionHandler>({
        method: ExtensionRequest.BRIDGE_TRANSACTION_REMOVE,
        params: [txHash],
      });
    },
    [request],
  );

  const setIsBridgeDevEnv = useCallback(
    (enabled: boolean) => {
      request<BridgeSetIsDevEnvHandler>({
        method: ExtensionRequest.BRIDGE_SET_IS_DEV_ENV,
        params: [enabled],
      });
    },
    [request],
  );

  const estimateGas = useCallback(
    async (amount: Big, asset: Asset) => {
      const isEvmSourceChain =
        currentBlockchain === Blockchain.ETHEREUM || Blockchain.AVALANCHE;

      if (
        !isEvmSourceChain ||
        !active?.addressC ||
        !ethereumProvider ||
        !avaxProviderC ||
        !bridgeConfig.config
      ) {
        return;
      }

      return sdkEstimateGas(
        amount,
        active.addressC,
        asset as Exclude<Asset, BitcoinConfigAsset>,
        {
          ethereum: ethereumProvider,
          avalanche: avaxProviderC,
        },
        bridgeConfig.config,
        currentBlockchain,
      );
    },
    [
      currentBlockchain,
      active?.addressC,
      avaxProviderC,
      ethereumProvider,
      bridgeConfig.config,
    ],
  );

  const transferEVMAsset = useCallback(
    async (amount: Big, asset: Asset) => {
      let currentSignature = 1;
      let requiredSignatures = 1;

      if (
        currentBlockchain !== Blockchain.ETHEREUM &&
        currentBlockchain !== Blockchain.AVALANCHE
      ) {
        throw new Error('Wrong source chain');
      }

      const result = await transferAssetEVM({
        currentBlockchain,
        amount,
        account: active?.addressC as string,
        asset,
        avalancheProvider: avaxProviderC!,
        ethereumProvider: ethereumProvider!,
        config: bridgeConfig.config!,
        onStatusChange: (status) => {
          if (status === WrapStatus.WAITING_FOR_DEPOSIT_CONFIRMATION) {
            requiredSignatures = 2;
          }

          if (
            requiredSignatures > 1 &&
            status === WrapStatus.WAITING_FOR_CONFIRMATION
          ) {
            currentSignature = 2;
          }
        },
        onTxHashChange: () => {},
        signAndSendEVM: (txData) => {
          const tx = txData as ContractTransaction;

          return request(
            {
              method: RpcMethod.ETH_SEND_TRANSACTION,
              params: [
                {
                  ...mapNumberishToHex(tx),
                  // erase gasPrice if maxFeePerGas can be used
                  gasPrice: tx.maxFeePerGas
                    ? undefined
                    : tx.gasPrice
                      ? toBeHex(tx.gasPrice)
                      : undefined,
                },
              ],
            },
            {
              context: {
                customApprovalScreenTitle: t('Confirm Bridge'),
                // Mark as bridge to skip toast/confetti (bridge has its own status tracking)
                isBridge: true,
                alert:
                  requiredSignatures > currentSignature
                    ? {
                        type: 'info',
                        title: t(
                          'This operation requires {{total}} approvals.',
                          {
                            total: requiredSignatures,
                          },
                        ),
                        notice: t(
                          'You will be prompted {{remaining}} more time(s).',
                          {
                            remaining: requiredSignatures - currentSignature,
                          },
                        ),
                      }
                    : undefined,
              },
            },
          );
        },
      });

      return { hash: result };
    },
    [
      active?.addressC,
      avaxProviderC,
      bridgeConfig.config,
      currentBlockchain,
      ethereumProvider,
      request,
      t,
    ],
  );

  return (
    <bridgeContext.Provider
      value={{
        bridgeTransactions,
        estimateGas,
        transferEVMAsset,
        removeBridgeTransaction,
        createBridgeTransaction,
        isBridgeDevEnv,
        setIsBridgeDevEnv,
        bridgeState,
      }}
    >
      {children}
    </bridgeContext.Provider>
  );
}

const mapNumberishToHex = (tx: ContractTransaction) =>
  Object.fromEntries(
    Object.entries(tx).map(([key, value]) => [
      key,
      typeof value === 'number' || typeof value === 'bigint'
        ? toBeHex(value)
        : value,
    ]),
  );
