import { txParams } from '@src/background/services/transactions/models';
import { DisplayValueParserProps } from '../models';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { Network } from '@avalabs/chains-sdk';
import { bigToLocaleString, bnToBig, hexToBN } from '@avalabs/utils-sdk';
import { TransactionDescription } from 'ethers';

export function parseBasicDisplayValues(
  network: Network,
  request: txParams,
  props: DisplayValueParserProps,
  description?: TransactionDescription
) {
  const name = description?.name;

  let displayValue = '';

  if (description?.args._amount) {
    const big = bnToBig(hexToBN(description?.args._amount.toHexString()), 18);
    displayValue = bigToLocaleString(big, 18);
  } else if (request.value) {
    const big = bnToBig(hexToBN(request.value), network.networkToken.decimals);
    displayValue = `${bigToLocaleString(big, network.networkToken.decimals)} ${
      network.networkToken.symbol
    }`;
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
    ...calculateGasAndFees({
      maxFeePerGas: props.maxFeePerGas,
      gasLimit: Number(request.gas || 0),
      tokenPrice: props.avaxPrice,
      tokenDecimals: network.networkToken.decimals,
    }),
    site: props.site,
    name: name ? (name[0] || '').toUpperCase() + name.slice(1) : '',
    displayValue,
  };
}
