import { TokenIcon as TokenImage } from '@/components/common/TokenIcon';
import {
  TokenType,
  TokenWithBalance,
  TokenWithBalanceEVM,
} from '@avalabs/vm-module-types';
import { calculateGasAndFees, stringToBigint } from '@core/common';
import { OptimalRate } from '@paraswap/sdk';
import { SwappableToken } from '../models';

interface GetTokenIconProps {
  token?: TokenWithBalanceEVM;
}

export const MIN_SLIPPAGE = 0.01;

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

export interface Token {
  icon?: JSX.Element;
  name?: string;
}

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
): token is SwappableToken => {
  if (token.type === TokenType.SPL) {
    return !token.name.includes('(Sanctum Automated)'); // Filter-out some automated LP tokens
  }

  return token.type === TokenType.ERC20 || token.type === TokenType.NATIVE;
};
