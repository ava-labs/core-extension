import { utils } from '@avalabs/avalanchejs';

import { getMaxUtxoSet } from '@core/common';
import { AvmCapableAccount, NetworkWithCaipId } from '@core/types';

import { getAvalancheProvider } from '@/lib/getAvalancheProvider';
import { getAvalancheWallet } from '@/lib/getAvalancheWallet';

type BuildXChainSendTxArgs = {
  isLedgerWallet: boolean;
  account: AvmCapableAccount;
  amount: bigint;
  to: string;
  network: NetworkWithCaipId;
};

export const buildXChainSendTx = async ({
  isLedgerWallet,
  account,
  amount,
  to,
  network,
}: BuildXChainSendTxArgs) => {
  const provider = getAvalancheProvider(network);
  const wallet = getAvalancheWallet(account, provider);

  const { utxos } = await getMaxUtxoSet(
    isLedgerWallet,
    provider,
    wallet,
    network,
  );
  const assetId = provider.getAvaxID();
  const changeAddressBytes = utils.parse(account.addressAVM)[2];

  const unsignedTx = wallet.baseTX({
    utxoSet: utxos,
    chain: 'X',
    toAddress: correctAddressByPrefix(to, 'X-'),
    amountsPerAsset: {
      [assetId]: amount,
    },
    options: {
      changeAddresses: [changeAddressBytes],
    },
  });

  const manager = utils.getManagerForVM(unsignedTx.getVM());
  const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());

  return {
    transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
    chainAlias: 'X',
    utxos: unsignedTx.utxos.map((utxo) =>
      utils.bufferToHex(utxo.toBytes(codec)),
    ),
  };
};

const correctAddressByPrefix = (address: string, prefix: string) => {
  return !address.startsWith(prefix) ? `${prefix}${address}` : address;
};
