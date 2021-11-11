import {
  TransactionDisplayValues,
  txParams,
} from '@src/background/services/transactions/models';
import {
  ContractCall,
  ContractParser,
  DisplayValueParserProps,
} from './models';
import { parseBasicDisplayValues } from './utils/parseBasicDisplayValues';

export function approveTxHandler(
  /**
   * The from on request represents the wallet and the to represents the contract
   */
  request: txParams,
  /**
   * Data is the values sent to the above contract and this is the instructions on how to
   * execute
   */
  _data: any,
  props: DisplayValueParserProps
): TransactionDisplayValues {
  const erc20sIndexedByAddress = props.erc20Tokens.reduce(
    (acc, token) => ({ ...acc, [token.address]: token }),
    {}
  );

  const tokenToBeApproved = erc20sIndexedByAddress[request.to];

  const result = {
    tokenToBeApproved,
    contractType: ContractCall.APPROVE,
    ...parseBasicDisplayValues(request, props),
  };

  return result;
}

export const ApproveTxParser: ContractParser = [
  ContractCall.APPROVE,
  approveTxHandler,
];
