import { txParams } from '@src/background/services/transactions/models';
import { DisplayValueParserProps } from '../models';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';

export function parseBasicDisplayValues(
  request: txParams,
  props: DisplayValueParserProps
) {
  return {
    /**
     * Contract this is being sent to
     */
    toAddress: request.to,
    /**
     * The wallet this is being sent from
     */
    fromAddress: request.from,
    ...calculateGasAndFees(
      props.gasPrice,
      request.gas as string,
      props.avaxPrice
    ),
    domain: props.domain,
    icon: props.icon,
  };
}
