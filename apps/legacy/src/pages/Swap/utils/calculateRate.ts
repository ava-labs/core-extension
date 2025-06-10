import { OptimalRate } from '@paraswap/sdk';
import {
  isJupiterQuote,
  isParaswapQuote,
  JupiterQuote,
  UnwrapOperation,
  WrapOperation,
} from '@core/ui';

type RateCalculationContext = { srcDecimals: number; destDecimals: number };
type RateCalculationStrategy = {
  calculate(
    quote: OptimalRate | JupiterQuote | WrapOperation | UnwrapOperation,
    context: RateCalculationContext,
  ): number;
};

const ParaswapRateStrategy: RateCalculationStrategy = {
  calculate(quote: OptimalRate): number {
    const { destAmount, destDecimals, srcAmount, srcDecimals } = quote;
    const destAmountNumber = parseInt(destAmount, 10) / 10 ** destDecimals;
    const sourceAmountNumber = parseInt(srcAmount, 10) / 10 ** srcDecimals;
    return destAmountNumber / sourceAmountNumber;
  },
};

const JupiterRateStrategy: RateCalculationStrategy = {
  calculate(quote: JupiterQuote, context): number {
    const { inAmount, outAmount } = quote;
    const realOutValue = parseInt(outAmount, 10) / 10 ** context.destDecimals;
    const realInValue = parseInt(inAmount, 10) / 10 ** context.srcDecimals;
    return realOutValue / realInValue;
  },
};

const WrapUnwrapRateStrategy: RateCalculationStrategy = {
  calculate(): number {
    return 1; // wrap/unwrap always has 1:1 rate
  },
};

export const calculateRate = (
  quote: OptimalRate | JupiterQuote | WrapOperation | UnwrapOperation,
  context: RateCalculationContext,
) => {
  let strategy: RateCalculationStrategy;

  if (isParaswapQuote(quote)) {
    strategy = ParaswapRateStrategy;
  } else if (isJupiterQuote(quote)) {
    strategy = JupiterRateStrategy;
  } else {
    strategy = WrapUnwrapRateStrategy;
  }

  return strategy.calculate(quote, context);
};
