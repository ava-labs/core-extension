import { UnsignedTx } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';

import { getMaxUtxoSet } from '@core/common';
import { NetworkWithCaipId, PvmCapableAccount } from '@core/types';

import { buildPChainSendTx } from '@/lib/buildPChainSendTx';
import { getAvalancheWallet } from '@/lib/getAvalancheWallet';
import { getAvalancheProvider } from '@/lib/getAvalancheProvider';

// FIXME: Replicating Core Web's behavior in terms of estimating the maximum
// amount here. There might be a better way to do this.
// Unfortunately, we need to withhold an arbitrary amount, as we don't know
// how much fees the maximum sized tx will consume.
const ARBITRARY_FEE = 10_000_000n;

export const getPChainMaxAmount = async (
  from: PvmCapableAccount,
  isLedgerWallet: boolean,
  network?: NetworkWithCaipId,
) => {
  if (!network) {
    return {
      maxAmount: 0n,
      estimatedFee: 0n,
    };
  }

  const provider = getAvalancheProvider(network);
  const feeState = await provider.getApiP().getFeeState();
  const wallet = getAvalancheWallet(from, provider);
  const utxos = await getMaxUtxoSet(
    isLedgerWallet,
    provider,
    wallet,
    network,
    feeState,
  );

  // If available balance is larger than what we withhold, we use the difference.
  // Otherwise, we'll estimate the fee for the smallest possible transaction and
  // use that as the estimated fee. This way the user can at least try to transfer
  // and tweak the amount if needed.
  const available = utxos?.balance.available ?? BigInt(0);
  const estimatedFee =
    available > ARBITRARY_FEE
      ? ARBITRARY_FEE
      : await getFeeForMinimalTx({
          from,
          isLedgerWallet,
          network,
          provider,
        });

  const maxAmount =
    available - estimatedFee > 0n ? available - estimatedFee : 0n;

  return {
    maxAmount,
    estimatedFee,
  };
};

const getFeeForMinimalTx = async ({
  from,
  isLedgerWallet,
  network,
  provider,
}) => {
  const unsignedTx = await buildPChainSendTx({
    isLedgerWallet,
    account: from,
    amount: 1n, // Minimum possible amount to send
    to: from.addressPVM,
    network,
  });

  // Parse transaction to estimate the fee
  const { txFee: estimatedFee } = await parsePChainTx(
    unsignedTx,
    provider,
    from,
  );

  return estimatedFee;
};

const parsePChainTx = async (
  unsignedTx: UnsignedTx,
  provider: Avalanche.JsonRpcProvider,
  account: PvmCapableAccount,
) => {
  const parsedTx = await Avalanche.parseAvalancheTx(
    unsignedTx,
    provider,
    account.addressPVM,
  );

  return parsedTx;
};
