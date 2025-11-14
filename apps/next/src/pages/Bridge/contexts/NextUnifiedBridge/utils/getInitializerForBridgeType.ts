import {
  BitcoinFunctions,
  BridgeInitializer,
  BridgeType,
  BtcSigner,
  EvmSigner,
} from '@avalabs/bridge-unified';

type BridgeSigners = { evm: EvmSigner; btc: BtcSigner };

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
  }
}
