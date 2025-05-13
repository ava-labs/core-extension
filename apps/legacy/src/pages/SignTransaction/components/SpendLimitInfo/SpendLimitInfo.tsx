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
      {approvals.map((approval, index) => {
        switch (approval.token.type) {
          case TokenType.ERC721:
          case TokenType.ERC1155:
            return (
              <NftSpendLimit
                key={index}
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
                key={index}
                actionId={actionId}
                approval={
                  approval as TokenApproval & {
                    token: ERC20Token;
                  }
                }
                withTitle={index === 0}
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
