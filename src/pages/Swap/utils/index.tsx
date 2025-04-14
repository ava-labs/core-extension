import { TokenIcon as TokenImage } from '@src/components/common/TokenIcon';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import {
  TokenType,
  TokenWithBalance,
  TokenWithBalanceEVM,
} from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';
import { WrappedError } from '@src/utils/errors';
import { OptimalRate } from '@paraswap/sdk';
import { SwappableToken } from '../models';
import { JupiterQuote } from '@src/contexts/SwapProvider/models';

interface GetTokenIconProps {
  token?: TokenWithBalanceEVM;
}

export const MIN_SLIPPAGE = 0.1;

export const TokenIcon = ({ token }: GetTokenIconProps) => {
  if (!token) {
    return null;
  }
  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoUri}
      name={token.name}
    />
  );
};

export const getTokenIcon = (token: TokenWithBalanceEVM) => {
  if (!token) {
    return null;
  }

  return (
    <TokenImage
      width="32px"
      height="32px"
      src={token.logoUri}
      name={token.name}
    />
  );
};

export const getMaxValue = (token?: SwappableToken, fee?: string) => {
  if (!token || !fee) {
    return;
  }

  if (token.type === TokenType.NATIVE) {
    return token.balance - stringToBigint(fee, token.decimals);
  }
  return token.balance;
};

export function isAPIError(rate: any): rate is WrappedError {
  return typeof rate.message === 'string';
}

export const getTokenAddress = (token?: SwappableToken) => {
  if (!token) {
    return undefined;
  }
  return token.type === TokenType.NATIVE ? token.symbol : token.address;
};

export const getMaxValueWithGas = ({
  customGasPrice,
  gasLimit,
  avaxPrice,
  tokenDecimals,
  selectedFromToken,
}: {
  customGasPrice: bigint;
  gasLimit?: number;
  avaxPrice: number;
  tokenDecimals?: number;
  selectedFromToken: SwappableToken;
}) => {
  const newFees = calculateGasAndFees({
    gasPrice: customGasPrice,
    tokenPrice: avaxPrice,
    tokenDecimals,
    gasLimit,
  });

  const max = getMaxValue(selectedFromToken, newFees.fee);
  return max;
};

export const calculateRate = (optimalRate: OptimalRate | JupiterQuote) => {
  if ('destAmount' in optimalRate) {
    const { destAmount, destDecimals, srcAmount, srcDecimals } = optimalRate;
    const destAmountNumber =
      parseInt(destAmount, 10) / Math.pow(10, destDecimals);
    const sourceAmountNumber =
      parseInt(srcAmount, 10) / Math.pow(10, srcDecimals);
    return destAmountNumber / sourceAmountNumber;
  }

  return 0; // TODO: handle jupiter quote
};

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

export type DestinationInput = 'from' | 'to' | '';

export interface SwapRate extends OptimalRate {
  status?: number;
  message?: string;
}

export interface Amount {
  bigint: bigint;
  amount: string;
}

export const formatBasisPointsToPercentage = (basisPoints: number): string => {
  // E.g. 85 -> 0.85%

  // Use Intl.NumberFormat to format the number as a percentage
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(basisPoints / 10_000);
};

export const isSlippageValid = (value: string) => {
  if (MIN_SLIPPAGE <= parseFloat(value) && parseFloat(value) <= 100) {
    return true;
  }
  return false;
};

export const isSwappableToken = (
  token: TokenWithBalance,
): token is SwappableToken =>
  token.type === TokenType.ERC20 ||
  token.type === TokenType.NATIVE ||
  token.type === TokenType.SPL;
