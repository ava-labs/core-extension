import { txParams } from '@src/background/services/transactions/models';
import { DisplayValueParserProps } from '../models';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import * as ethers from 'ethers';
import { hexToBN } from '@src/utils/hexToBN';
import { bnToBig, bigToLocaleString } from '@avalabs/avalanche-wallet-sdk';

export function parseBasicDisplayValues(
  request: txParams,
  props: DisplayValueParserProps,
  description?: ethers.utils.TransactionDescription
) {
  const name = description?.name;

  let displayValue = '';

  if (description?.args._amount) {
    const big = bnToBig(hexToBN(description?.args._amount.toHexString()), 18);
    displayValue = `Depositing ${bigToLocaleString(big, 18)}`;
  }

  return {
    /**
     * Contract this is being sent to
     */
    toAddress: request.to,
    /**
     * The wallet this is being sent from
     */
    fromAddress: request.from,
    ...calculateGasAndFees(props.gasPrice, request.gas || 0, props.avaxPrice),
    site: props.site,
    description,
    name: name ? name[0].toUpperCase() + name.slice(1) : '',
    displayValue,
  };
}
