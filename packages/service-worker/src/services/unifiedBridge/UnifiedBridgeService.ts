import {
  AnalyzeTxParams,
  AnalyzeTxResult,
  BridgeInitializer,
  BridgeType,
  createUnifiedBridgeService,
  Environment,
  getEnabledBridgeServices,
} from '@avalabs/bridge-unified';
import { wait } from '@avalabs/core-utils-sdk';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { singleton } from 'tsyringe';

import { NetworkService } from '../network/NetworkService';

import { getExponentialBackoffDelay, Monitoring } from '@core/common';

@singleton()
export class UnifiedBridgeService {
  #core?: ReturnType<typeof createUnifiedBridgeService>;
  #failedInitAttempts = 0;

  constructor(private networkService: NetworkService) {
    this.#recreateService();

    // When testnet mode is toggled, we need to recreate the instance.
    this.networkService.developerModeChanged.add(() => {
      this.#recreateService();
    });
  }

  #getBridgeInitializers(
    bitcoinProvider: BitcoinProvider,
  ): BridgeInitializer[] {
    // initializers for all bridge types since it's only used for TX history
    return [
      BridgeType.CCTP,
      BridgeType.ICTT_ERC20_ERC20,
      BridgeType.AVALANCHE_EVM,
      BridgeType.LOMBARD_BTC_TO_BTCB,
      BridgeType.LOMBARD_BTCB_TO_BTC,
    ].map((type) => this.#getInitializerForBridgeType(type, bitcoinProvider));
  }

  #getInitializerForBridgeType(
    type: BridgeType,
    bitcoinProvider: BitcoinProvider,
  ): BridgeInitializer {
    // This backend service is only used for transaction tracking purposes,
    // therefore we don't need to provide true signing capabilities.
    const dummySigner = {
      async sign() {
        return '0x' as const;
      },
      async signMessage() {
        return '0x' as const;
      },
    };

    switch (type) {
      case BridgeType.CCTP:
      case BridgeType.ICTT_ERC20_ERC20:
      case BridgeType.AVALANCHE_EVM:
        return {
          type,
          signer: dummySigner,
        };

      case BridgeType.LOMBARD_BTC_TO_BTCB:
      case BridgeType.LOMBARD_BTCB_TO_BTC:
        return {
          type,
          evmSigner: dummySigner,
          btcSigner: dummySigner,
          bitcoinFunctions: bitcoinProvider,
        };

      default:
        throw new Error(`Unsupported bridge type: ${type}`);
    }
  }

  async #recreateService() {
    const environment = this.networkService.isMainnet()
      ? Environment.PROD
      : Environment.TEST;

    try {
      const bitcoinProvider = await this.networkService.getBitcoinProvider();

      this.#core = createUnifiedBridgeService({
        environment,
        enabledBridgeServices: await getEnabledBridgeServices(
          environment,
          this.#getBridgeInitializers(bitcoinProvider),
        ),
      });
      this.#failedInitAttempts = 0;
    } catch (err: any) {
      // If it failed, it's most likely a network issue.
      // Wait a bit and try again.
      this.#failedInitAttempts += 1;

      const delay = getExponentialBackoffDelay({
        attempt: this.#failedInitAttempts,
        startsAfter: 1,
      });

      Monitoring.sentryCaptureException(
        err,
        Monitoring.SentryExceptionTypes.UNIFIED_BRIDGE,
      );
      console.log(
        `Initialization of UnifiedBridgeService failed, attempt #${
          this.#failedInitAttempts
        }. Retry in ${delay / 1000}s`,
      );

      await wait(delay);

      // Do not attempt again if it succeded in the meantime
      // (e.g. user switched developer mode or feature flags updated)
      if (this.#failedInitAttempts > 0) {
        this.#recreateService();
      }
    }
  }

  analyzeTx(txInfo: AnalyzeTxParams): AnalyzeTxResult {
    if (!this.#core) {
      return {
        isBridgeTx: false,
      };
    }

    return this.#core.analyzeTx(txInfo);
  }
}
