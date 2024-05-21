import { utils } from '@avalabs/avalanchejs';
import { Network } from '@avalabs/chains-sdk';
import { Avalanche } from '@avalabs/wallets-sdk';
import { LEDGER_TX_SIZE_LIMIT_BYTES } from '@src/background/services/ledger/models';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
const MAX_LEDGER_OUTPUTS = 64;
enum CHAIN_ALIAS {
  P = 'P',
  X = 'X',
}

export async function getMaxUtxoSet(
  isLedgerWallet: boolean,
  provider: Avalanche.JsonRpcProvider,
  wallet: Avalanche.AddressWallet,
  network: Network
) {
  const chainAliasToUse = isPchainNetwork(network)
    ? CHAIN_ALIAS.P
    : CHAIN_ALIAS.X;
  const utxos = await wallet.getUTXOs(chainAliasToUse);
  let filteredUtxos = Avalanche.sortUTXOsByAmount(utxos.getUTXOs(), true);

  if (isPchainNetwork(network)) {
    try {
      filteredUtxos = Avalanche.getMaximumUtxoSet(
        wallet,
        utxos.getUTXOs(),
        Avalanche.SizeSupportedTx.BaseP,
        isLedgerWallet ? LEDGER_TX_SIZE_LIMIT_BYTES : undefined
      );
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
