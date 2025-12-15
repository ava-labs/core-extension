import { MaxUint256 } from 'ethers';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenApproval, TokenType } from '@avalabs/vm-module-types';

export const getApprovalValue = (
  approval: TokenApproval,
  tokenPrice: number | null,
) => {
  if (!approval.value) {
    return null;
  }

  const isNFT =
    approval.token.type === TokenType.ERC721 ||
    approval.token.type === TokenType.ERC1155;
  const tokenAmount = new TokenUnit(
    typeof approval.value === 'string'
      ? BigInt(approval.value)
      : (approval.value ?? 0n),
    approval.token.type !== TokenType.ERC20 ? 0 : approval.token.decimals,
    '',
  );
  const isUnlimited = tokenAmount.toSubUnit() === MaxUint256;

  return {
    isNFT,
    isUnlimited,
    tokenValue: tokenAmount,
    logoUri: approval.token.logoUri,
    currencyValue:
      typeof tokenPrice === 'number' && Number.isFinite(tokenPrice)
        ? tokenAmount.toDisplay({ asNumber: true }) * tokenPrice
        : undefined,
  };
};
