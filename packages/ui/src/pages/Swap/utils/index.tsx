import { TokenIcon as TokenImage } from '@/components/common/TokenIcon';
import { TokenType, TokenWithBalanceEVM } from '@avalabs/vm-module-types';
import { calculateGasAndFees, stringToBigint, WrappedError } from '@core/common';
import { OptimalRate } from '@paraswap/sdk';

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

export const getMaxValue = (token?: TokenWithBalanceEVM, fee?: string) => {
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

export const getTokenAddress = (token?: TokenWithBalanceEVM) => {
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
  selectedFromToken: TokenWithBalanceEVM;
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

export const calculateRate = (optimalRate: OptimalRate) => {
  const { destAmount, destDecimals, srcAmount, srcDecimals } = optimalRate;
  const destAmountNumber =
    parseInt(destAmount, 10) / Math.pow(10, destDecimals);
  const sourceAmountNumber =
    parseInt(srcAmount, 10) / Math.pow(10, srcDecimals);
  return destAmountNumber / sourceAmountNumber;
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
