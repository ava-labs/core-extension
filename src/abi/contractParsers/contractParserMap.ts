import { ContractParserHandler } from './models';
import { SwapExactTokensForTokenParser } from './swapExactTokensForTokens';

export const contractParserMap = new Map<string, ContractParserHandler>([
  SwapExactTokensForTokenParser,
]);
