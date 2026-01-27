import {
  BitcoinFunctions,
  BridgeInitializer,
  BridgeType,
  BtcSigner,
  EvmSignerWithMessage,
} from '@avalabs/bridge-unified';

type BridgeSigners = { evm: EvmSignerWithMessage; btc: BtcSigner };

export function getInitializerForBridgeType(
  type: BridgeType,
  bitcoinFunctions: BitcoinFunctions,
  { btc, evm }: BridgeSigners,
): BridgeInitializer {
  switch (type) {
    case BridgeType.CCTP:
    case BridgeType.ICTT_ERC20_ERC20:
    case BridgeType.AVALANCHE_EVM:
      return {
        type,
        signer: evm,
      };

    case BridgeType.AVALANCHE_AVA_BTC:
      return {
        type,
        signer: evm,
        bitcoinFunctions,
      };

    case BridgeType.AVALANCHE_BTC_AVA:
      return {
        type,
        signer: btc,
        bitcoinFunctions,
      };

    case BridgeType.LOMBARD_BTC_TO_BTCB:
      return {
        type,
        evmSigner: evm,
        btcSigner: btc,
        bitcoinFunctions,
      };

    case BridgeType.LOMBARD_BTCB_TO_BTC:
      return {
        type,
        evmSigner: evm,
        btcSigner: btc,
        bitcoinFunctions,
      };
  }
}
