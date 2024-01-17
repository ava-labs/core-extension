import {
  Transaction,
  TransactionType,
} from '@src/background/services/transactions/models';
import { ApproveSendDetails } from './ApproveSendDetails';
import { ApproveTokenDetails } from './ApproveTokenDetails';
import { ApproveNftDetails } from './ApproveNftDetails';
import { ApproveNftCollectionDetails } from './ApproveNftCollectionDetails';
import { ApproveContractCallDetails } from './ApproveContractCallDetails';

export const TransactionActionInfo = ({
  transaction,
}: {
  transaction: Transaction | null;
}) => {
  if (!transaction?.displayValues?.actions.length) {
    return null;
  }

  return (
    <>
      {transaction.displayValues.actions.map((action, index) => {
        switch (action.type) {
          case TransactionType.SEND_NFT:
          case TransactionType.SEND_TOKEN:
            return <ApproveSendDetails key={index} {...action} />;
          case TransactionType.APPROVE_TOKEN:
          case TransactionType.REVOKE_TOKEN_APPROVAL:
            return <ApproveTokenDetails key={index} {...action} />;
          case TransactionType.APPROVE_NFT:
          case TransactionType.REVOKE_NFT_APPROVAL:
            return <ApproveNftDetails {...action} />;
          case TransactionType.APPROVE_NFT_COLLECTION:
          case TransactionType.REVOKE_NFT_COLLECTION_APPROVAL:
            return <ApproveNftCollectionDetails key={index} {...action} />;
          case TransactionType.CANCEL_TX:
          case TransactionType.DEPLOY_CONTRACT:
          case TransactionType.ADD_LIQUIDITY:
          case TransactionType.SWAP:
          case TransactionType.CALL:
            return <ApproveContractCallDetails key={index} {...action} />;
          default:
            return null;
        }
      })}
    </>
  );
};
