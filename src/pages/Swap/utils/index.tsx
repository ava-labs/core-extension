import { TokenIcon as TokenImage } from '@src/components/common/TokenIcon';
import { APIError } from 'paraswap';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import { OptimalRate } from 'paraswap-core';
import { TokenType, TokenWithBalanceEVM } from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';

interface GetTokenIconProps {
  token?: TokenWithBalanceEVM;
}

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

export function isAPIError(rate: any): rate is APIError {
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
