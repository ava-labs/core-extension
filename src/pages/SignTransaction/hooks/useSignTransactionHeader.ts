import {
  Transaction,
  TransactionType,
} from '@src/background/services/transactions/models';
import { useTranslation } from 'react-i18next';

export const useSignTransactionHeader = (transaction: Transaction | null) => {
  const { t } = useTranslation();

  const transactionTypes = transaction?.displayValues?.actions.map(
    (a) => a.type
  );

  if (!transactionTypes || transactionTypes?.length > 1) {
    return t('Transaction Approval');
  }

  switch (transactionTypes[0]) {
    case TransactionType.SEND_TOKEN:
      return t('Token Send Approval');
    case TransactionType.SEND_NFT:
      return t('NFT Send Approval');
    case TransactionType.APPROVE_TOKEN:
      return t('Token Spend Approval');
    case TransactionType.APPROVE_NFT:
      return t('NFT Spend Approval');
    case TransactionType.APPROVE_NFT_COLLECTION:
      return t('NFT Collection Spend Approval');
    case TransactionType.REVOKE_TOKEN_APPROVAL:
      return t('Revoke Token Spend Approval');
    case TransactionType.REVOKE_NFT_APPROVAL:
      return t('Revoke NFT Collection Approval');
    case TransactionType.REVOKE_NFT_COLLECTION_APPROVAL:
      return t('Revoke NFT Collection Spend Approval');
    case TransactionType.CANCEL_TX:
      return t('Cancel Transaction Approval');
    case TransactionType.DEPLOY_CONTRACT:
      return t('Contract Deployment Approval');
    case TransactionType.CALL:
      return t('Transaction Approval');
    case TransactionType.ADD_LIQUIDITY:
      return t('Pool Approval');
    case TransactionType.SWAP:
      return t('Swap Approval');
    default:
      return t('Transaction Approval');
  }
};
