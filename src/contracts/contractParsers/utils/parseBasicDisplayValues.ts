import { txParams } from '@src/background/services/transactions/models';
import { DisplayValueParserProps } from '../models';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';

export function parseBasicDisplayValues(
  request: txParams,
  props: DisplayValueParserProps
) {
  const bnFee = props.gasPrice.bn.mul(new BN(parseInt(request.gas as string)));
  const fee = Utils.bigToLocaleString(Utils.bnToBig(bnFee, 18), 4);
  return {
    /**
     * Contract this is being sent to
     */
    toAddress: request.to,
    /**
     * The wallet this is being sent from
     */
    fromAddress: request.from,
    /**
     * The smart contract paths
     */
    gasPrice: props.gasPrice,
    gasLimit: parseInt(request.gas as string),
    fee,
    feeUSD: parseFloat((parseFloat(fee) * props.avaxPrice).toFixed(4)),
  };
}
