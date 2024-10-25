import { TokenSpendLimit } from './TokenSpendLimit';
import { NftSpendLimit } from './NftSpendLimit';
import {
  ERC1155Token,
  ERC20Token,
  ERC721Token,
  TokenApproval,
  TokenApprovals,
  TokenType,
} from '@avalabs/vm-module-types';

type SpendLimitInfoProps = TokenApprovals & { actionId: string };

export const SpendLimitInfo = ({
  approvals,
  isEditable,
  actionId,
}: SpendLimitInfoProps) => {
  return (
    <>
      {approvals.map((approval) => {
        switch (approval.token.type) {
          case TokenType.ERC721:
          case TokenType.ERC1155:
            return (
              <NftSpendLimit
                approval={
                  approval as TokenApproval & {
                    token: ERC1155Token | ERC721Token;
                  }
                }
              />
            );

          case TokenType.ERC20:
            return (
              <TokenSpendLimit
                actionId={actionId}
                approval={
                  approval as TokenApproval & {
                    token: ERC20Token;
                  }
                }
                isEditable={isEditable}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};
