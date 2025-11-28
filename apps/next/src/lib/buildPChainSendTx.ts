import { utils } from '@avalabs/avalanchejs';

import { getMaxUtxoSet } from '@core/common';
import { NetworkWithCaipId, PvmCapableAccount } from '@core/types';

import { getAvalancheProvider } from '@/lib/getAvalancheProvider';
import { getAvalancheWallet } from '@/lib/getAvalancheWallet';

type BuildPChainSendTxArgs = {
  isLedgerWallet: boolean;
  account: PvmCapableAccount;
  amount: bigint;
  to: string;
  network: NetworkWithCaipId;
  preloadedUtxoSet?: utils.UtxoSet;
};

export const buildPChainSendTx = async ({
  isLedgerWallet,
  account,
  amount,
  to,
  network,
  preloadedUtxoSet,
}: BuildPChainSendTxArgs) => {
  const provider = getAvalancheProvider(network);
  const wallet = getAvalancheWallet(account, provider);

  const feeState = await provider.getApiP().getFeeState();

  const { utxos, balance } = await getMaxUtxoSet(
    isLedgerWallet,
    provider,
    wallet,
    network,
    feeState,
    preloadedUtxoSet,
  );

  if (balance.available < amount) {
    throw new Error('Insufficient balance');
  }

  const assetId = provider.getAvaxID();
  const changeAddressBytes = utils.parse(account.addressPVM)[2];

  return wallet.baseTX({
    utxoSet: utxos,
    chain: 'P',
    toAddress: correctAddressByPrefix(to, 'P-'),
    amountsPerAsset: {
      [assetId]: amount,
    },
    options: {
      changeAddresses: [changeAddressBytes],
    },
    feeState,
  });
};

const correctAddressByPrefix = (address: string, prefix: string) => {
  return !address.startsWith(prefix) ? `${prefix}${address}` : address;
};
