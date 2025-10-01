import {
  BitcoinFunctions,
  BridgeInitializer,
  BridgeType,
  BtcSigner,
  EvmSigner,
} from '@avalabs/bridge-unified';

export function getInitializerForBridgeType(
  type: BridgeType,
  bitcoinFunctions: BitcoinFunctions,
  signers: { evm: EvmSigner; btc: BtcSigner },
): BridgeInitializer {
  switch (type) {
    case BridgeType.CCTP:
    case BridgeType.ICTT_ERC20_ERC20:
    case BridgeType.AVALANCHE_EVM:
      return {
        type,
        signer: signers.evm,
      };

    case BridgeType.AVALANCHE_AVA_BTC:
      return {
        type,
        signer: signers.evm,
        bitcoinFunctions,
      };

    case BridgeType.AVALANCHE_BTC_AVA:
      return {
        type,
        signer: signers.btc,
        bitcoinFunctions,
      };
  }
}
