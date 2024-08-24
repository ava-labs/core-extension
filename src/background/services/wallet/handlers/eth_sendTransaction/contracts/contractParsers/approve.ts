import { Network } from '@avalabs/core-chains-sdk';
import {
  EthSendTransactionParamsWithGas,
  TransactionDisplayValues,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { ContractCall, ContractParser } from './models';
import { findToken } from '../../../../../../utils/findToken';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';
import { TransactionDescription } from 'ethers';
import { bigintToBig } from '@src/utils/bigintToBig';
import {
  TokenType,
  TokenWithBalanceEVM,
} from '@src/background/services/balances/models';

type ApproveData = {
  spender: string;
  amount?: string;
  rawAmount?: string;
};

export async function approveTxHandler(
  network: Network,
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: EthSendTransactionParamsWithGas,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  data: ApproveData,
  txDetails: TransactionDescription | null
): Promise<TransactionDisplayValues> {
  if (!request.to) {
    throw new Error('Contract address not defined');
  }
  const tokenToBeApproved = (await findToken(
    request.to.toLowerCase(),
    network
  )) as TokenWithBalanceEVM;

  const displayData = await parseBasicDisplayValues(
    network,
    request,
    txDetails
  );

  const amount = data.amount ?? data.rawAmount;

  displayData.actions.push({
    type: TransactionType.APPROVE_TOKEN,
    token: {
      address:
        tokenToBeApproved.type === TokenType.ERC20
          ? tokenToBeApproved.address
          : tokenToBeApproved.symbol,
      decimals: tokenToBeApproved.decimals,
      symbol: tokenToBeApproved.symbol,
      name: tokenToBeApproved.name,
      logoUri: tokenToBeApproved.logoUri,

      amount: amount ? BigInt(amount) : undefined,
      usdValue:
        amount && tokenToBeApproved.priceUSD
          ? Number(tokenToBeApproved.priceUSD) *
            bigintToBig(BigInt(amount), tokenToBeApproved.decimals).toNumber()
          : undefined,
      usdPrice: tokenToBeApproved.priceUSD,
    },
    spender: {
      address: data.spender,
    },
  });

  return displayData;
}

export const ApproveTxParser: ContractParser<ApproveData> = [
  ContractCall.APPROVE,
  approveTxHandler,
];
