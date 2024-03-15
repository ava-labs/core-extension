import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { ethers } from 'ethers';
import { NetworkContractToken } from '@avalabs/chains-sdk';

export function parseWithERC20Abi(
  tx: EthSendTransactionParamsWithGas,
  token: NetworkContractToken
): TransactionDisplayValues {
  if (!tx.data) {
    throw new Error('Invalid input');
  }
  const iface = new ethers.Interface(ERC20.abi);
  const calledFunction = iface.getFunction(tx.data.slice(0, 10));

  if (!calledFunction) {
    throw new Error('Unable to get function');
  }

  const decodeFunctionData = iface.decodeFunctionData(
    tx.data.slice(0, 10),
    tx.data
  );

  const displayData: TransactionDisplayValues = {
    fromAddress: tx.from,
    abi: {
      func: calledFunction?.name ?? '',
      params: decodeFunctionData.toArray(),
    },
    actions: [],
    balanceChange: {
      sendTokenList: [],
      sendNftList: [],
      receiveNftList: [],
      receiveTokenList: [],
    },
    gas: {
      maxFeePerGas: BigInt(tx.maxFeePerGas),
      gasLimit: Number(tx.gasLimit),
    },
    preExecSuccess: false,
  };

  if (calledFunction?.name === 'transfer') {
    displayData.actions.push({
      type: TransactionType.SEND_TOKEN,
      fromAddress: tx.from,
      toAddress: decodeFunctionData['to'],
      token: {
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        logoUri: token.logoUri,

        amount: BigInt(decodeFunctionData['amount']),
      },
    });
  } else if (calledFunction?.name === 'approve') {
    displayData.actions.push({
      type: TransactionType.APPROVE_TOKEN,
      spender: {
        address: decodeFunctionData['spender'],
      },
      token: {
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        logoUri: token.logoUri,

        amount: BigInt(decodeFunctionData['amount']),
      },
    });
  } else {
    displayData.actions.push({
      type: TransactionType.CALL,
      fromAddress: tx.from,
      contract: {
        address: token.address,
      },
    });
  }

  return displayData;
}
