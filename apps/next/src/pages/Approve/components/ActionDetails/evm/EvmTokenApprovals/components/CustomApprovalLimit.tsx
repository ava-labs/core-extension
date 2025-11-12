import { MaxUint256 } from 'ethers';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useState } from 'react';
import { DisplayData, TokenApproval } from '@avalabs/vm-module-types';

import { useConnectionContext } from '@core/ui';
import type { UpdateActionTxDataHandler } from '@core/service-worker';
import { Action, EnsureDefined, ExtensionRequest } from '@core/types';

import { DetailsSection } from '../../../generic/DetailsSection';
import { TxDetailsRow } from '../../../generic/DetailsItem/items/DetailRow';

import { ApprovalValue, SpendLimit } from '../types';
import { CustomLimitTrigger } from './CustomLimitTrigger';
import { CustomApprovalLimitOverlay } from './CustomApprovalLimitOverlay';

type CustomApprovalLimitProps = {
  action: Action<EnsureDefined<DisplayData, 'tokenApprovals'>>;
  approval: TokenApproval;
  requestedValue: ApprovalValue;
  approvalValue: ApprovalValue;
  isUnlimitedRequested: boolean;
};

export const CustomApprovalLimit: FC<CustomApprovalLimitProps> = ({
  action,
  approval,
  requestedValue,
  approvalValue,
  isUnlimitedRequested,
}) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { tokenValue } = approvalValue;

  const [spendLimit, setSpendLimit] = useState<SpendLimit>({
    type: isUnlimitedRequested ? 'unlimited' : 'requested',
    value: tokenValue?.toSubUnit() ?? 0n,
  });

  const updateApprovalLimit = useCallback(() => {
    if (!action.actionId) return;

    const limitAmount =
      spendLimit.type === 'unlimited' ? MaxUint256 : (spendLimit.value ?? 0n);

    request<UpdateActionTxDataHandler>({
      method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
      params: [
        action.actionId,
        { approvalLimit: `0x${limitAmount.toString(16)}` },
      ],
    });
  }, [request, action.actionId, spendLimit]);

  const handleSave = () => {
    setIsDialogOpen(false);
    updateApprovalLimit();
  };

  if (!tokenValue) {
    return null;
  }

  return (
    <>
      <DetailsSection>
        <TxDetailsRow label={t('Spend limit')}>
          <CustomLimitTrigger
            approval={approval}
            approvalValue={approvalValue}
            spendLimit={spendLimit}
            onClick={() => setIsDialogOpen(true)}
          />
        </TxDetailsRow>
        <CustomApprovalLimitOverlay
          isDialogOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          spendLimit={spendLimit}
          setSpendLimit={setSpendLimit}
          approval={approval}
          requestedValue={requestedValue}
          isUnlimitedRequested={isUnlimitedRequested}
          onSave={handleSave}
        />
      </DetailsSection>
    </>
  );
};
