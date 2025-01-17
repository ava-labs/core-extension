import { Box, Button, Dialog, Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { useCallback, useState } from 'react';
import { CustomSpendLimit } from './CustomSpendLimit';
import { TransactionTokenCard } from '../TransactionTokenCard';
import { MaxUint256 } from 'ethers';
import {
  DisplayData,
  ERC20Token,
  TokenApproval,
} from '@avalabs/vm-module-types';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { UpdateActionTxDataHandler } from '@src/background/services/actions/handlers/updateTxData';

export enum Limit {
  DEFAULT = 'DEFAULT',
  UNLIMITED = 'UNLIMITED',
  CUSTOM = 'CUSTOM',
}
export const UNLIMITED_SPEND_LIMIT_LABEL = 'Unlimited';

export interface SpendLimit {
  limitType: Limit;
  value?: bigint;
}

export function TokenSpendLimit({
  actionId,
  approval,
  isEditable,
  withTitle = true,
}: {
  actionId: string;
  approval: TokenApproval & { token: ERC20Token };
  isEditable: boolean;
  withTitle?: boolean;
}) {
  const { t } = useTranslation();
  const { action } = useApproveAction<DisplayData>(actionId);
  const { request } = useConnectionContext();
  const [showCustomSpendLimit, setShowCustomSpendLimit] = useState(false);
  const [customSpendLimit, setCustomSpendLimit] = useState<SpendLimit>({
    limitType: Limit.DEFAULT,
  });

  const setSpendLimit = useCallback(
    (customSpendData: SpendLimit) => {
      let limitAmount = 0n;

      if (customSpendData.limitType === Limit.UNLIMITED) {
        setCustomSpendLimit({
          ...customSpendData,
          value: undefined,
        });
        limitAmount = MaxUint256;
      } else {
        setCustomSpendLimit(customSpendData);
        limitAmount =
          customSpendData.limitType === Limit.CUSTOM
            ? (customSpendData.value ?? 0n)
            : BigInt(approval.value ?? 0n);
      }
      request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params: [actionId, { approvalLimit: `0x${limitAmount.toString(16)}` }],
      });
    },
    [actionId, request, approval.value],
  );

  const isInfinite = customSpendLimit.limitType === Limit.UNLIMITED;
  const diffItemValue = isInfinite
    ? null
    : new TokenUnit(
        customSpendLimit.limitType === Limit.DEFAULT
          ? typeof approval.value === 'string'
            ? BigInt(approval.value)
            : (approval.value ?? 0n)
          : (customSpendLimit.value ?? '0'),
        approval.token.decimals,
        '',
      );

  return (
    <>
      <Dialog fullScreen open={showCustomSpendLimit}>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            py: 2,
          }}
        >
          <CustomSpendLimit
            setSpendLimit={setSpendLimit}
            spendLimit={customSpendLimit}
            requestedApprovalLimit={BigInt(approval.value ?? '0')}
            site={action?.site}
            token={approval.token}
            onClose={() => setShowCustomSpendLimit(false)}
          />
        </Box>
      </Dialog>

      <Stack sx={{ width: 1 }}>
        {withTitle && (
          <ApprovalSection sx={{ pb: 1 }}>
            <ApprovalSectionHeader label={t('Spend Limit')}>
              {isEditable && approval.value && (
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  sx={{ px: 0, minWidth: 'auto' }}
                  onClick={() => setShowCustomSpendLimit(true)}
                >
                  {t('Edit')}
                </Button>
              )}
            </ApprovalSectionHeader>
          </ApprovalSection>
        )}
        <TransactionTokenCard
          sx={{ py: 2 }}
          token={{
            ...approval.token,
            logoUri: approval.logoUri,
          }}
          diffItem={{
            displayValue: isInfinite
              ? t('Unlimited')
              : (diffItemValue as TokenUnit).toDisplay(),
            usdPrice: approval.usdPrice,
          }}
        />
      </Stack>
    </>
  );
}
