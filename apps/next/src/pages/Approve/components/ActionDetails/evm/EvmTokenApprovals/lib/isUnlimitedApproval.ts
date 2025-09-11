import { MaxUint256 } from 'ethers';
import { TokenApproval } from '@avalabs/vm-module-types';

const MAX_UINT256_HEX = `0x${MaxUint256.toString(16)}`;

export const isUnlimitedApproval = (approval: TokenApproval) => {
  return approval.value === MAX_UINT256_HEX;
};
