import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { Network } from '@avalabs/chains-sdk';
import { TransactionDescription } from 'ethers';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionToken,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { bigintToBig } from '@src/utils/bigintToBig';
import { findToken } from '../../../../../../../utils/findToken';

export async function parseBasicDisplayValues(
  network: Network,
  request: EthSendTransactionParamsWithGas,
  description: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  const networkTokenWithBalance = await findToken(
    network.networkToken.symbol,
    network
  );
  const name = description?.name;

  const sendTokenList: TransactionToken[] = [];

  if (request.value && BigInt(request.value) > 0n) {
    sendTokenList.push({
      address: network.networkToken.symbol,
      decimals: network.networkToken.decimals,
      symbol: network.networkToken.symbol,
      name: network.networkToken.name,
      logoUri: network.networkToken.logoUri,
      amount: BigInt(request.value),
      usdValue: networkTokenWithBalance.priceUSD
        ? networkTokenWithBalance.priceUSD *
          bigintToBig(
            BigInt(request.value),
            network.networkToken.decimals
          ).toNumber()
        : undefined,
      usdPrice: networkTokenWithBalance.priceUSD,
    });
  }
  const gasInfo = calculateGasAndFees({
    maxFeePerGas: BigInt(request.maxFeePerGas),
    gasLimit: Number(request.gasLimit),
    tokenPrice: networkTokenWithBalance.priceUSD,
    tokenDecimals: network.networkToken.decimals,
  });

  return {
    /**
     * The wallet this is being sent from
     */
    fromAddress: request.from,

    gas: {
      maxFeePerGas: BigInt(gasInfo.maxFeePerGas ?? 0),
      gasLimit: gasInfo.gasLimit,
    },
    abi: description
      ? {
          func: name ? (name[0] || '').toUpperCase() + name.slice(1) : '',
          params: description?.args.toArray() ?? [],
        }
      : undefined,
    actions: [],
    balanceChange: {
      sendTokenList,
      receiveTokenList: [],
      sendNftList: [],
      receiveNftList: [],
    },
  };
}
