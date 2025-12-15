import { utils } from '@avalabs/avalanchejs';

import { getMaxUtxoSet, stripAddressPrefix } from '@core/common';
import { AvmCapableAccount, NetworkWithCaipId, XPAddresses } from '@core/types';

import { getAvalancheProvider } from '@/lib/getAvalancheProvider';
import { getAvalancheWallet } from '@/lib/getAvalancheWallet';

type BuildXChainSendTxArgs = {
  isLedgerWallet: boolean;
  account: AvmCapableAccount;
  amount: bigint;
  to: string;
  network: NetworkWithCaipId;
  addresses: XPAddresses;
};

export const buildXChainSendTx = async ({
  isLedgerWallet,
  account,
  amount,
  to,
  network,
  addresses,
}: BuildXChainSendTxArgs) => {
  const provider = getAvalancheProvider(network);
  const wallet = await getAvalancheWallet(account, addresses, provider);

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
  const utxosAddrs = new Set(
    unsignedTx.utxos.flatMap((utxo) =>
      utxo.getOutputOwners().addrs.map(String),
    ),
  );
  const externalIndices = addresses.externalAddresses.reduce(
    (indices, addy) => {
      if (utxosAddrs.has(stripAddressPrefix(addy.address))) {
        indices.push(addy.index);
      }

      return indices;
    },
    [] as number[],
  );
  const internalIndices = addresses.internalAddresses.reduce(
    (indices, addy) => {
      if (utxosAddrs.has(stripAddressPrefix(addy.address))) {
        indices.push(addy.index);
      }

      return indices;
    },
    [] as number[],
  );

  return {
    transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
    chainAlias: 'X',
    utxos: unsignedTx.utxos.map((utxo) =>
      utils.bufferToHex(utxo.toBytes(codec)),
    ),
    externalIndices,
    internalIndices,
  };
};

const correctAddressByPrefix = (address: string, prefix: string) => {
  return !address.startsWith(prefix) ? `${prefix}${address}` : address;
};
