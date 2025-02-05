import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import ERC1155 from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import type { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import type { TransactionRequest } from 'ethers';
import { Contract } from 'ethers';

import type {
  Erc20SendOptions,
  NativeSendOptions,
  NftSendOptions,
  SendOptions,
} from '../models';
import { TokenType } from '@avalabs/vm-module-types';
import { stringToBigint } from '@src/utils/stringToBigint';

const asHex = (value: bigint) => `0x${value.toString(16)}`;

export const buildErc20Tx = async (
  from: string,
  provider: JsonRpcBatchInternal,
  { address, amount, token }: Erc20SendOptions,
) => {
  const contract = new Contract(token.address || '', ERC20.abi, provider);

  const populatedTransaction = await contract.transfer!.populateTransaction(
    address,
    asHex(stringToBigint(amount, token.decimals)),
  );
  const unsignedTx: TransactionRequest = {
    ...populatedTransaction, // only includes `to` and `data`
    chainId: populatedTransaction.chainId
      ? Number(populatedTransaction.chainId)
      : undefined,
    from,
  };

  return unsignedTx;
};

export const buildErc721Tx = async (
  from: string,
  provider: JsonRpcBatchInternal,
  { address, token }: NftSendOptions,
) => {
  const contract = new Contract(token.address || '', ERC721.abi, provider);

  const populatedTransaction = await contract[
    'safeTransferFrom(address,address,uint256)'
  ]!.populateTransaction(from, address, token.tokenId);

  const unsignedTx: TransactionRequest = {
    ...populatedTransaction,
    chainId: populatedTransaction.chainId
      ? Number(populatedTransaction.chainId)
      : undefined,
    from,
  };
  return unsignedTx;
};

export const buildErc1155Tx = async (
  from: string,
  provider: JsonRpcBatchInternal,
  { address, token }: NftSendOptions,
) => {
  const contract = new Contract(token.address || '', ERC1155.abi, provider);

  const populatedTransaction = await contract[
    'safeTransferFrom(address,address,uint256,uint256,bytes)'
  ]!.populateTransaction(from, address, token.tokenId, 1, new Uint8Array());

  const unsignedTx: TransactionRequest = {
    ...populatedTransaction,
    chainId: populatedTransaction.chainId
      ? Number(populatedTransaction.chainId)
      : undefined,
    from,
  };

  return unsignedTx;
};

export const buildNativeTx = (
  from: string,
  { address, amount, token }: NativeSendOptions,
): TransactionRequest => ({
  from,
  to: address,
  value: asHex(stringToBigint(amount, token.decimals)),
});

export const isNativeSend = (
  options: SendOptions,
): options is NativeSendOptions => options.token.type === TokenType.NATIVE;

export const isErc20Send = (
  options: SendOptions,
): options is Erc20SendOptions => options.token.type === TokenType.ERC20;

export const isErc721Send = (options: SendOptions): options is NftSendOptions =>
  options.token.type === TokenType.ERC721;

export const isErc1155Send = (
  options: SendOptions,
): options is NftSendOptions => options.token.type === TokenType.ERC1155;

export const buildTx = async (
  from: string,
  provider: JsonRpcBatchInternal,
  options: SendOptions,
) => {
  if (isNativeSend(options)) {
    return buildNativeTx(from, options);
  }

  if (isErc20Send(options)) {
    return buildErc20Tx(from, provider, options);
  }

  if (isErc721Send(options)) {
    return buildErc721Tx(from, provider, options);
  }

  if (isErc1155Send(options)) {
    return buildErc1155Tx(from, provider, options);
  }

  throw new Error(`Unknown send options object`);
};
