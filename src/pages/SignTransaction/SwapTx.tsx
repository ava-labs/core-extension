import {
  SwapExactTokensForTokenDisplayValues,
  SwapTokenIn,
  SwapTokenOut,
} from '@src/contracts/contractParsers/models';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownIcon,
  CodeIcon,
  IconButton,
  Stack,
} from '@avalabs/k2-components';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from './components/ApprovalSection';
import {
  AccountDetails,
  ContractDetails,
  NetworkDetails,
} from './components/ApprovalTxDetails';
import {
  TokenWithAmountAndValue,
  TxBalanceChange,
} from './components/TxBalanceChange';

const SwapTokensDivider = () => (
  <ArrowDownIcon size={20} sx={{ px: 0.75, py: 1.75 }} />
);

export function SwapTx({
  path,
  toAddress,
  fromAddress,
  setShowRawTransactionData,
  network,
}: SwapExactTokensForTokenDisplayValues) {
  const { t } = useTranslation();
  const firstToken = path[0] as SwapTokenIn;
  const lastToken = path[path.length - 1] as SwapTokenOut;

  const sentToken: TokenWithAmountAndValue = {
    ...firstToken,
    amount: firstToken.amountIn.value,
    value: Number(firstToken.amountUSDValue),
  };
  const receivingToken: TokenWithAmountAndValue = {
    ...lastToken,
    amount: lastToken.amountOut.value,
    value: Number(lastToken.amountUSDValue),
  };
  const tokens = [sentToken, receivingToken];

  return (
    <Stack sx={{ width: '100%', gap: 3, pt: 1 }}>
      <ApprovalSection>
        <ApprovalSectionHeader label={t('Transaction Details')}>
          <IconButton
            size="small"
            sx={{ px: 0, minWidth: 'auto' }}
            onClick={() => setShowRawTransactionData(true)}
          >
            <CodeIcon />
          </IconButton>
        </ApprovalSectionHeader>
        <ApprovalSectionBody sx={{ py: 1 }}>
          {fromAddress && <AccountDetails address={fromAddress} />}
          {toAddress && (
            <ContractDetails contractAddress={toAddress} network={network} />
          )}
          {network && <NetworkDetails network={network} />}
        </ApprovalSectionBody>
      </ApprovalSection>
      <TxBalanceChange
        tokens={tokens}
        transactionType={t('Swap')}
        divider={<SwapTokensDivider />}
      />
    </Stack>
  );
}
