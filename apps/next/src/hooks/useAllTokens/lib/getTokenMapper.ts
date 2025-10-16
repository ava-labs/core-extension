import { NetworkContractToken } from '@avalabs/core-chains-sdk';
import { TokenType } from '@avalabs/vm-module-types';
import { FungibleTokenBalance } from '@core/types';
import { memoize } from 'lodash';

export const getTokenMapper = memoize(
  (chainId: number) =>
    (tokenData: NetworkContractToken): FungibleTokenBalance => ({
      type: tokenData.contractType === 'SPL' ? TokenType.SPL : TokenType.ERC20,
      address: tokenData.address,
      name: tokenData.name,
      symbol: tokenData.symbol,
      decimals: tokenData.decimals,
      balance: 0n,
      balanceDisplayValue: '0',
      reputation: null,
      assetType: tokenData.contractType === 'SPL' ? 'svm_spl' : 'evm_erc20',
      coreChainId: chainId,
      logoUri: tokenData.logoUri,
    }),
);
