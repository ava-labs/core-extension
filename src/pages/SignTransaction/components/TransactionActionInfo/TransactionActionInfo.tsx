import { ApproveSendDetails } from './ApproveSendDetails';
import { ApproveTokenDetails } from './ApproveTokenDetails';
import { ApproveNftDetails } from './ApproveNftDetails';
import { ApproveNftCollectionDetails } from './ApproveNftCollectionDetails';
import { ApproveContractCallDetails } from './ApproveContractCallDetails';
import {
  Transaction,
  TransactionAction,
  TransactionType,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { Action } from '@src/background/services/actions/models';
import { serializeToJSON } from '@src/background/serialization/serialize';

const CALL_WITH_NO_DETAILS = JSON.stringify({ type: 'call' });

const isCallWithNoDetails = (actions: TransactionAction[]) =>
  actions.length === 1 && serializeToJSON(actions[0]) === CALL_WITH_NO_DETAILS;

export const TransactionActionInfo = ({
  transaction,
}: {
  transaction: Action<Transaction> | null;
}) => {
  if (!transaction?.displayData?.displayValues?.actions.length) {
    return null;
  }

  const actions = transaction.displayData.displayValues.actions ?? [];
  const hasNoDetails = isCallWithNoDetails(actions);

  if (hasNoDetails) {
    return null;
  }

  return (
    <>
      {transaction.displayData.displayValues.actions.map((action, index) => {
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
