/* eslint-disable no-prototype-builtins */

import { EthSendTransactionParams } from './handlers/eth_sendTransaction';
import { TokenType } from '../balances/models';
import { DomainMetadata } from '@src/background/models';

export enum TxStatus {
  // user has been shown the UI and we are waiting on approval
  PENDING = 'pending',
  // user has approved and we are waiting on the background to confirm
  SUBMITTING = 'submitting',
  // tx was submitted and returned successful
  SIGNED = 'signed',
  ERROR = 'error',
  ERROR_USER_CANCELED = 'error-user-canceled',
}

export enum AvalancheChainStrings {
  AVM = 'X Chain',
  PVM = 'P Chain',
  EVM = 'C Chain',
}

export enum TransactionEvent {
  TRANSACTIONS_UPDATED = 'transactions-updated',
  TRANSACTION_FINALIZED = 'transaction-finalized',
}

export enum TransactionType {
  SEND_TOKEN = 'send_token',
  SEND_NFT = 'send_nft',
  APPROVE_TOKEN = 'approve_token',
  APPROVE_NFT = 'approve_nft',
  APPROVE_NFT_COLLECTION = 'approve_nft_collection',
  REVOKE_TOKEN_APPROVAL = 'revoke_token_approval',
  REVOKE_NFT_APPROVAL = 'revoke_nft_approval',
  REVOKE_NFT_COLLECTION_APPROVAL = 'revoke_nft_collection_approval',
  CANCEL_TX = 'cancel_tx',
  DEPLOY_CONTRACT = 'deploy_contract',
  SWAP = 'swap',
  ADD_LIQUIDITY = 'add_liquidity',
  CALL = 'call',
}

export interface TransactionToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoUri?: string;

  amount?: bigint;
  usdValue?: number;
  usdPrice?: number;

  isScam?: boolean;
  isInfinity?: boolean;
  isSuspicious?: boolean;
}

export interface TransactionNft {
  type: TokenType.ERC721 | TokenType.ERC1155;
  address: string;
  name: string;
  description: string;
  logoUri?: string;
  symbol?: string;

  amount: bigint;

  collection?: {
    name: string;
    description: string | null;
    logoUri: string;
  };

  isScam?: boolean;
  isSuspicious?: boolean;
}

export type TransactionAction =
  | {
      type: TransactionType.SEND_TOKEN;
      fromAddress: string;
      toAddress: string;
      token: TransactionToken;
    }
  | {
      type: TransactionType.SEND_NFT;
      fromAddress: string;
      toAddress: string;
      nft: TransactionNft;
    }
  | {
      type:
        | TransactionType.APPROVE_TOKEN
        | TransactionType.REVOKE_TOKEN_APPROVAL;
      spender: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
      token: TransactionToken;
      customSpendLimit?: bigint;
    }
  | {
      type: TransactionType.APPROVE_NFT | TransactionType.REVOKE_NFT_APPROVAL;
      owner: string;
      spender: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
      token: TransactionNft;
    }
  | {
      type:
        | TransactionType.APPROVE_NFT_COLLECTION
        | TransactionType.REVOKE_NFT_COLLECTION_APPROVAL;
      owner: string;
      spender: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
      collection: {
        id: string;
        name: string;
        description: string;
        address: string;
        logoUri: string;
        type: TokenType.ERC721 | TokenType.ERC1155;

        isScam?: boolean;
        isSuspicious?: boolean;
      };
    }
  | {
      type: TransactionType.CANCEL_TX;
      fromAddress: string;
    }
  | {
      type: TransactionType.DEPLOY_CONTRACT;
      fromAddress: string;
    }
  | {
      type: TransactionType.CALL;
      fromAddress: string;
      contract?: {
        address: string;
        protocol?: {
          id: string;
          name: string;
          logoUri: string;
        };
      };
    }
  | {
      type: TransactionType.ADD_LIQUIDITY | TransactionType.SWAP;
      fromAddress: string;
      contract?: {
        address: string;
      };
    };

export interface TransactionDisplayValues {
  fromAddress: string;

  abi?: {
    func: string;
    params: unknown[];
  };

  actions: TransactionAction[];

  gas: {
    maxPriorityFeePerGas?: bigint;
    maxFeePerGas: bigint;
    gasLimit: number;
    recommendedGasLimit?: number;
  };

  balanceChange?: {
    usdValueChange?: number;
    sendTokenList: TransactionToken[];
    receiveTokenList: TransactionToken[];
    sendNftList: TransactionNft[];
    receiveNftList: TransactionNft[];
  };

  preExecSuccess?: boolean;
}

export interface Transaction {
  id: string;
  requestId: string;
  method: string;
  time: number;
  status: TxStatus;
  chainId: string;
  txParams: EthSendTransactionParamsWithGas;
  txHash?: string;
  displayValues?: TransactionDisplayValues;
  error?: string;
  tabId?: number;
  site?: DomainMetadata;
}

export function isTxParams(
  params: Partial<EthSendTransactionParams>
): params is EthSendTransactionParams {
  return !!params.from;
}

export type PendingTransactions = {
  [id: string]: Transaction;
};

export interface EthSendTransactionParamsWithGas
  extends EthSendTransactionParams {
  type: number;
  gasLimit: string;
  maxFeePerGas: string;
}

/**
 * This is updating the gasPrice and gasEstimate for a pending tx
 */
export interface txParamsUpdate {
  id: any;
  params: Partial<EthSendTransactionParamsWithGas>;
  tabId?: number;
}
/**
 * This is updating the result with the txHash or the status
 */
export interface txStatusUpdate {
  status: TxStatus;
  id: Transaction['id'];
  result?: string;
  error?: string;
  tabId?: number;
}

export function isTxParamsUpdate(
  update: txParamsUpdate | txStatusUpdate
): update is txParamsUpdate {
  return update?.hasOwnProperty('id') && update.hasOwnProperty('params');
}

export function isTxStatusUpdate(
  update: txParamsUpdate | txStatusUpdate
): update is txStatusUpdate {
  return (
    update?.hasOwnProperty('id') &&
    update.hasOwnProperty('status') &&
    !update.hasOwnProperty('result') &&
    (update as txStatusUpdate).status !== TxStatus.SIGNED
  );
}

export function isTxFinalizedUpdate(
  update: txParamsUpdate | txStatusUpdate
): update is txStatusUpdate {
  return (
    (update as txStatusUpdate).status === TxStatus.ERROR ||
    (update as txStatusUpdate).status === TxStatus.ERROR_USER_CANCELED ||
    (update?.hasOwnProperty('id') &&
      update.hasOwnProperty('result') &&
      update.hasOwnProperty('status') &&
      (update as txStatusUpdate).status === TxStatus.SIGNED)
  );
}

export const TRANSACTIONS_STORAGE_KEY = 'transactions';
