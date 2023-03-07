import { Divider, Stack, Typography } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from './ApprovalSection';
import { TokenAmount } from './TokenAmount';
import { TxDetailsRow } from './TxDetailsRow';
import { TokenWithBalance } from '@src/background/services/balances/models';

export type TokenWithAmountAndValue = TokenWithBalance & {
  amount: string;
  value?: number;
};

type TxBalanceChangeProps = {
  transactionType: string;
  tokens: TokenWithAmountAndValue[];
  divider: JSX.Element;
};

export const TxBalanceChange = ({
  transactionType,
  tokens,
  divider = <Divider />,
}: TxBalanceChangeProps) => {
  const { t } = useTranslation();
  const { currencyFormatter } = useSettingsContext();

  return (
    <ApprovalSection>
      <ApprovalSectionHeader label={t('Balance Change')} />
      <ApprovalSectionBody
        divider={<Divider orientation="horizontal" />}
        sx={{ gap: 1 }}
      >
        <TxDetailsRow label={t('Transaction Type')}>
          <Typography variant="caption">{transactionType}</Typography>
        </TxDetailsRow>
        <Stack divider={divider} sx={{ pt: 1 }}>
          {tokens.map((t) => (
            <TokenAmount
              key={t.symbol}
              token={t}
              amount={t.amount}
              fiatValue={t.value ? currencyFormatter(t.value) : undefined}
            />
          ))}
        </Stack>
      </ApprovalSectionBody>
    </ApprovalSection>
  );
};
