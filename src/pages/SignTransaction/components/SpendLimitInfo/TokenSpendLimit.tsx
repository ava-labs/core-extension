import { Box, Button, Dialog, Stack } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import {
  Transaction,
  TransactionToken,
} from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { useCallback, useState } from 'react';
import { CustomSpendLimit } from './CustomSpendLimit';
import { TransactionTokenCard } from '../TransactionTokenCard';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { MaxUint256 } from 'ethers';
import Web3 from 'web3';
import { TokenIcon } from '@src/components/common/TokenIcon';
import {
  Action,
  ActionStatus,
  ActionUpdate,
} from '@src/background/services/actions/models';

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
  spender,
  token,
  transaction,
  updateTransaction,
}: {
  spender: {
    address: string;
    protocol?: {
      id: string;
      name: string;
      logoUri: string;
    };
  };
  token: TransactionToken;
  transaction: Action<Transaction>;
  updateTransaction: (update: ActionUpdate<Transaction>) => Promise<boolean>;
}) {
  const { t } = useTranslation();
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
            : (token.amount ?? 0n).toString();
      }

      // create hex string for approval amount
      const web3 = new Web3();
      const contract = new web3.eth.Contract(ERC20.abi as any, token.address);

      const hashedCustomSpend =
        limitAmount &&
        contract.methods.approve(spender.address, limitAmount).encodeABI();

      updateTransaction({
        id: transaction?.actionId,
        status: ActionStatus.PENDING,
        displayData: {
          ...transaction.displayData,
          txParams: {
            ...transaction.displayData.txParams,
            data: hashedCustomSpend,
          },
        },
      });
    },
    [
      token.address,
      token.amount,
      spender.address,
      updateTransaction,
      transaction?.actionId,
      transaction.displayData,
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
            requestedApprovalLimit={token.amount}
            site={transaction.site}
            token={token}
            onClose={() => setShowCustomSpendLimit(false)}
          />
        </Box>
      </Dialog>

      <Stack>
        <ApprovalSection sx={{ pb: 1 }}>
          <ApprovalSectionHeader label={t('Spend Limit')}>
            {token.amount && (
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
            ...token,
            isInfinity: customSpendLimit.limitType === Limit.UNLIMITED,
            amount:
              customSpendLimit.limitType === Limit.DEFAULT
                ? token.amount
                : customSpendLimit.value,
          }}
        >
          <TokenIcon
            width="32px"
            height="32px"
            src={token.logoUri}
            name={token.name}
          />
        </TransactionTokenCard>
      </Stack>
    </>
  );
}
