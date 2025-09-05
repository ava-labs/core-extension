import { Stack } from '@avalabs/k2-alpine';
import { FC, useRef } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';

import { Action, EnsureDefined } from '@core/types';
import { useBalancesContext } from '@core/ui';

import { DetailsSection } from '../../generic/DetailsSection';
import { getApprovalValue, isUnlimitedApproval } from './lib';
import { CustomApprovalLimit, TokenSpendLimitCard } from './components';

type EvmTokenApprovalsProps = {
  action: Action<EnsureDefined<DisplayData, 'tokenApprovals'>>;
};

export const EvmTokenApprovals: FC<EvmTokenApprovalsProps> = ({ action }) => {
  const { getTokenPrice } = useBalancesContext();

  const { tokenApprovals } = action.displayData;

  const requestedApprovalRef = useRef(tokenApprovals.approvals[0]);
  const hasOnlyOneEditableApproval =
    tokenApprovals.approvals.length === 1 && tokenApprovals.isEditable;

  const firstApproval = tokenApprovals.approvals[0];
  const currentApprovalValue = firstApproval
    ? getApprovalValue(firstApproval, getTokenPrice)
    : null;
  const requestedApproval = requestedApprovalRef.current;

  if (!currentApprovalValue || !requestedApproval) {
    return null;
  }

  const requestedApprovalValue = getApprovalValue(
    requestedApproval,
    getTokenPrice,
  );

  if (!requestedApprovalValue) {
    return null;
  }

  return (
    <Stack width="100%" gap={1}>
      <DetailsSection sx={{ py: 2 }}>
        {tokenApprovals.approvals.map((approval) => (
          <TokenSpendLimitCard
            key={approval.token.address}
            approval={approval}
            approvalValue={currentApprovalValue}
          />
        ))}
      </DetailsSection>
      {hasOnlyOneEditableApproval && firstApproval && requestedApproval && (
        <CustomApprovalLimit
          action={action}
          requestedValue={requestedApprovalValue}
          approval={firstApproval}
          approvalValue={currentApprovalValue}
          isUnlimitedRequested={isUnlimitedApproval(requestedApproval)}
        />
      )}
    </Stack>
  );
};
