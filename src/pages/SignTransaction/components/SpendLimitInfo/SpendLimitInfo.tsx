import {
  Transaction,
  TransactionType,
} from '@src/background/services/transactions/models';
import { TokenSpendLimit } from './TokenSpendLimit';
import { NftSpendLimit } from './NftSpendLimit';
import { NftCollectionSpendLimit } from './NftCollectionSpendLimit';

export const SpendLimitInfo = ({
  transaction,
  updateTransaction,
}: {
  transaction: Transaction | null;
  updateTransaction: (update: any) => Promise<string | Transaction>;
}) => {
  const approveTransactions = transaction?.displayValues?.actions.filter(
    (action) =>
      [
        TransactionType.APPROVE_TOKEN,
        TransactionType.REVOKE_TOKEN_APPROVAL,
        TransactionType.APPROVE_NFT,
        TransactionType.REVOKE_NFT_APPROVAL,
        TransactionType.APPROVE_NFT_COLLECTION,
        TransactionType.REVOKE_NFT_COLLECTION_APPROVAL,
      ].includes(action.type)
  );

  if (!approveTransactions?.length || !transaction) {
    return null;
  }

  return (
    <>
      {approveTransactions.map((action, index) => {
        switch (action.type) {
          case TransactionType.APPROVE_TOKEN:
          case TransactionType.REVOKE_TOKEN_APPROVAL:
            return (
              <TokenSpendLimit
                key={index}
                transaction={transaction}
                updateTransaction={updateTransaction}
                {...action}
              />
            );
          case TransactionType.APPROVE_NFT:
          case TransactionType.REVOKE_NFT_APPROVAL:
            return <NftSpendLimit {...action} />;
          case TransactionType.APPROVE_NFT_COLLECTION:
          case TransactionType.REVOKE_NFT_COLLECTION_APPROVAL:
            return <NftCollectionSpendLimit key={index} {...action} />;
          default:
            return null;
        }
      })}
    </>
  );
};
