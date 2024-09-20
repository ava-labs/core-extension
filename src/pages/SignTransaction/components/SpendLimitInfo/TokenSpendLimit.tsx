import { Box, Button, Dialog, Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { useCallback, useState } from 'react';
import { CustomSpendLimit } from './CustomSpendLimit';
import { TransactionTokenCard } from '../TransactionTokenCard';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { MaxUint256 } from 'ethers';
import Web3 from 'web3';
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
}: {
  actionId: string;
  approval: TokenApproval & { token: ERC20Token };
  isEditable: boolean;
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
      let limitAmount = '';

      if (customSpendData.limitType === Limit.UNLIMITED) {
        setCustomSpendLimit({
          ...customSpendData,
          value: undefined,
        });
        limitAmount = `0x${MaxUint256.toString(16)}`;
      } else {
        setCustomSpendLimit(customSpendData);
        limitAmount =
          customSpendData.limitType === Limit.CUSTOM
            ? (customSpendData.value ?? 0n).toString()
            : (approval.value ?? 0n).toString();
      }

      // create hex string for approval amount
      const web3 = new Web3();
      const contract = new web3.eth.Contract(
        ERC20.abi as any,
        approval.token.address
      );

      const hashedCustomSpend =
        limitAmount &&
        contract.methods
          .approve(approval.spenderAddress, limitAmount)
          .encodeABI();

      request<UpdateActionTxDataHandler>({
        method: ExtensionRequest.ACTION_UPDATE_TX_DATA,
        params: [actionId, { data: hashedCustomSpend }],
      });
    },
    [
      actionId,
      request,
      approval.token.address,
      approval.value,
      approval.spenderAddress,
    ]
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

      <Stack>
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
        <TransactionTokenCard
          sx={{ py: 2 }}
          token={{
            ...approval.token,
            logoUri: approval.logoUri,
          }}
          diffItem={{
            displayValue: new TokenUnit(
              customSpendLimit.limitType === Limit.DEFAULT
                ? approval.value ?? '0'
                : customSpendLimit.value ?? '0',
              approval.token.decimals,
              ''
            ).toDisplay(),
            usdPrice: '0',
          }}
        />
      </Stack>
    </>
  );
}
