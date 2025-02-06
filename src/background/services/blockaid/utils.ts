import type Blockaid from '@blockaid/client';
import type { TransactionValidationResponse } from '@blockaid/client/resources';

export const isToken = (
  asset: Asset,
): asset is Blockaid.Erc20TokenDetails | Blockaid.NativeAssetDetails =>
  asset.type === 'ERC20' || asset.type === 'NATIVE' ? true : false;

export const isNft = (
  asset: Asset,
): asset is Blockaid.Erc1155TokenDetails | Blockaid.Erc721TokenDetails =>
  asset.type === 'ERC1155' ||
  asset.type === 'ERC721' ||
  asset.type === 'NONERC';

export type Asset =
  | Blockaid.Erc20TokenDetails
  | Blockaid.Erc1155TokenDetails
  | Blockaid.Erc721TokenDetails
  | Blockaid.NonercTokenDetails
  | Blockaid.NativeAssetDetails;

export type NftDetails =
  | Blockaid.Erc1155TokenDetails
  | Blockaid.Erc721TokenDetails
  | Blockaid.NonercTokenDetails;

export type TokenDetails =
  | Blockaid.Erc20TokenDetails
  | Blockaid.NativeAssetDetails;

export const getValidationResultType = (
  validation?: TransactionValidationResponse,
) => ({
  isMalicious: validation?.result_type === 'Malicious',
  isSuspicious: validation?.result_type === 'Warning',
});
