import { utils } from '@avalabs/avalanchejs';
import type { pvm } from '@avalabs/avalanchejs';
import { Network } from '@avalabs/core-chains-sdk';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { CommonError, LEDGER_TX_SIZE_LIMIT_BYTES } from '@core/types';
import { assert, isPchainNetwork } from '@core/common';
const MAX_LEDGER_OUTPUTS = 64;
enum CHAIN_ALIAS {
  P = 'P',
  X = 'X',
}

export async function getMaxUtxoSet(
  isLedgerWallet: boolean,
  provider: Avalanche.JsonRpcProvider,
  wallet: Avalanche.AddressWallet,
  network: Network,
  feeState?: pvm.FeeState,
  preloadedUtxoSet?: utils.UtxoSet,
) {
  const chainAliasToUse = isPchainNetwork(network)
    ? CHAIN_ALIAS.P
    : CHAIN_ALIAS.X;
  const utxos = preloadedUtxoSet ?? (await wallet.getUTXOs(chainAliasToUse));
  let filteredUtxos = Avalanche.sortUTXOsByAmount(utxos.getUTXOs(), true);

  if (isPchainNetwork(network)) {
    assert(feeState, CommonError.UnknownNetworkFee);

    try {
      filteredUtxos = Avalanche.getMaximumUtxoSet({
        wallet,
        utxos: utxos.getUTXOs(),
        sizeSupportedTx: Avalanche.SizeSupportedTx.BaseP,
        limit: isLedgerWallet ? LEDGER_TX_SIZE_LIMIT_BYTES : undefined,
        feeState,
      });
    } catch (error) {
      console.error('Error calculating maximum utxo set', {
        e: error,
        txType: Avalanche.SizeSupportedTx.BaseP,
        utxos,
      });
    }
  }

  filteredUtxos = isLedgerWallet
    ? filteredUtxos.slice(0, MAX_LEDGER_OUTPUTS)
    : filteredUtxos;

  const utxoSet = new utils.UtxoSet(filteredUtxos);
  const avax = provider.getAvaxID();
  return {
    utxos: utxoSet,
    balance: Avalanche.getAssetBalance(utxoSet, avax),
  };
}
