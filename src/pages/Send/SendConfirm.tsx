import { useMemo } from 'react';
import {
  Button,
  Card,
  Divider,
  Stack,
  StackProps,
  styled,
  Tooltip,
  Typography,
  TypographyProps,
} from '@avalabs/k2-components';
import { BN } from 'bn.js';
import type { Contact } from '@avalabs/types';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useHistory } from 'react-router-dom';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { TokenIcon } from '@src/components/common/TokenImage';
import { GasFeeModifier } from '@src/components/common/CustomFeesK2';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { BigNumber } from 'ethers';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isBitcoin } from '@src/utils/isBitcoin';
import { calculateGasAndFees } from '@src/utils/calculateGasAndFees';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { useNativeTokenPrice } from '@src/hooks/useTokenPrice';
import { SendState } from '@src/background/services/send/models';
import { NetworkVMType } from '@avalabs/chains-sdk';
import {
  bigToLocaleString,
  bnToBig,
  bnToLocaleString,
} from '@avalabs/utils-sdk';
import { satoshiToBtc } from '@avalabs/bridge-sdk';
import { useTranslation } from 'react-i18next';
import { TruncatedAddress } from './components/TruncatedAddress';

const SummaryTokenIcon = styled(TokenIcon)`
  position: absolute;
  top: -28px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  border: 8px solid ${({ theme }) => theme.palette.common.black};
  border-radius: 50%;
  height: 56px;
  width: 56px;
`;

const Container: React.FC<StackProps> = (props) => (
  <Stack
    sx={{
      flexGrow: 1,
      alignItems: 'center',
      width: '100%',
      px: 2,
      pb: 3,
      pt: 2,
      gap: 2,
    }}
    {...props}
  />
);

const Section: React.FC<StackProps> = ({ ...props }) => (
  <Card
    sx={{
      width: '100%',
      position: 'relative',
      p: 2,
      overflow: 'visible',
    }}
  >
    <Stack sx={{ width: '100%', gap: 1 }} divider={<Divider />} {...props} />
  </Card>
);

const SectionRow: React.FC<StackProps> = ({ sx = {}, ...props }) => (
  <Stack
    sx={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      ...sx,
    }}
    {...props}
  />
);

const SectionLabel: React.FC<TypographyProps> = (props) => (
  <Typography variant="body2" color="text.secondary" {...props} />
);

const SectionData: React.FC<StackProps> = (props) => (
  <Stack sx={{ textAlign: 'end', gap: 0.5 }} {...props} />
);

type TokenAmountProps = {
  amount?: string;
  symbol?: string;
  fiatValue?: string;
};
const TokenAmount: React.FC<TokenAmountProps & StackProps> = ({
  amount,
  symbol,
  fiatValue,
  ...props
}) => (
  <Stack sx={{ textAlign: 'end' }} {...props}>
    <Stack
      sx={{
        flexDirection: 'row',
        gap: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}
    >
      <Typography variant="h5" component="span" color="text.primary">
        {amount}
      </Typography>
      <Typography
        variant="h5"
        component="span"
        color="text.secondary"
        sx={{ fontSize: 'body1.fontSize' }}
      >
        {symbol}
      </Typography>
    </Stack>
    {fiatValue && (
      <Typography variant="body2" color="text.secondary">
        {fiatValue}
      </Typography>
    )}
  </Stack>
);

type SendConfirmProps = {
  sendState: SendState;
  contact: Contact;
  token: TokenWithBalance | undefined;
  fallbackAmountDisplayValue?: string;
  onSubmit(): void;
  maxGasPrice?: string;
  gasPrice?: BigNumber;
  selectedGasFee?: GasFeeModifier;
};

export const SendConfirm = ({
  sendState,
  contact,
  token,
  fallbackAmountDisplayValue,
  onSubmit,
  gasPrice,
  selectedGasFee,
}: SendConfirmProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();
  const nativeTokenPrice = useNativeTokenPrice(network);

  useLedgerDisconnectedDialog(history.goBack);

  const amount = bnToLocaleString(
    sendState?.amount || new BN(0),
    token?.decimals
  );

  // Show actual send amount
  const amountDisplayValue = token
    ? bnToLocaleString(sendState?.amount || new BN(0), token.decimals)
    : fallbackAmountDisplayValue;

  const amountInCurrency = currencyFormatter(
    Number(amount || 0) * (token?.priceUSD ?? 0)
  );

  const balanceAfter = token?.balance
    .sub(sendState?.amount || new BN(0))
    .sub(
      token.type === TokenType.NATIVE
        ? sendState?.sendFee || new BN(0)
        : new BN(0)
    );
  const balanceAfterDisplay =
    balanceAfter &&
    bigToLocaleString(bnToBig(balanceAfter, token?.decimals), 4);
  const balanceAfterInCurrencyDisplay =
    balanceAfter &&
    currencyFormatter(
      Number(
        bigToLocaleString(
          bnToBig(
            balanceAfter.mul(new BN(token?.priceUSD || 0)),
            token?.decimals
          ),
          2
        ).replace(',', '')
      )
    );

  const gasLimit = sendState.customGasLimit || sendState.gasLimit;
  const networkFee = useMemo(() => {
    if (network?.vmName === NetworkVMType.BITCOIN) {
      const amount =
        typeof sendState.sendFee !== 'undefined'
          ? satoshiToBtc(sendState.sendFee.toNumber()).toString()
          : '';
      const fiatValue = amount
        ? currencyFormatter(Number(amount) * nativeTokenPrice)
        : '';

      return {
        amount,
        fiatValue,
      };
    }

    if (gasPrice && gasLimit) {
      const fees = calculateGasAndFees({
        gasPrice,
        tokenPrice: nativeTokenPrice,
        tokenDecimals: network?.networkToken.decimals,
        gasLimit,
      });

      return {
        amount: fees.fee,
        fiatValue: currencyFormatter(fees.feeUSD),
      };
    }

    return {};
  }, [
    gasLimit,
    gasPrice,
    nativeTokenPrice,
    sendState.sendFee,
    network?.networkToken.decimals,
    network?.vmName,
    currencyFormatter,
  ]);

  if (!activeAccount) {
    history.push('/home');
    return null;
  }

  return (
    <Stack sx={{ width: '100%' }}>
      <PageTitle variant={PageTitleVariant.PRIMARY} margin="8px 0 12px">
        {t('Confirm Transaction')}
      </PageTitle>
      <Container>
        <Section divider={null} sx={{ pt: 2 }}>
          <SectionRow>
            <SectionLabel>{t('Sending')}</SectionLabel>
            <TokenAmount
              data-testid="token-send-amount"
              amount={amountDisplayValue}
              symbol={token?.symbol}
              fiatValue={
                typeof token?.priceUSD !== 'undefined' ? amountInCurrency : ''
              }
            />
          </SectionRow>
          <SummaryTokenIcon src={token?.logoUri} name={token?.name} />
        </Section>

        <Section divider={<Divider />}>
          <SectionRow>
            <SectionLabel>{t('From')}</SectionLabel>
            <SectionData data-testid="send-from-contact">
              <Typography variant="body2" color="text.primary">
                {activeAccount?.name ?? t('Unknown Address')}
              </Typography>
              <TruncatedAddress
                address={
                  isBitcoin(network)
                    ? activeAccount?.addressBTC
                    : activeAccount?.addressC
                }
              />
            </SectionData>
          </SectionRow>
          <SectionRow>
            <SectionLabel>{t('To')}</SectionLabel>
            <SectionData data-testid="send-to-contact">
              <Typography variant="body2" color="text.primary">
                {contact?.name ?? t('Unknown Address')}
              </Typography>
              <TruncatedAddress
                address={
                  isBitcoin(network) ? contact?.addressBTC : contact?.address
                }
              />
            </SectionData>
          </SectionRow>
        </Section>

        <Section>
          <SectionRow>
            <SectionLabel variant="caption">{t('Network Fee')}</SectionLabel>
            <SectionData>
              <Typography
                variant="body2"
                sx={{ color: 'text.primary', fontWeight: 'semibold' }}
                data-testid="send-network-fee-amount"
              >
                {networkFee.amount} {network?.networkToken.symbol}
              </Typography>
              {networkFee.fiatValue && (
                <Typography variant="caption">
                  {networkFee.fiatValue}
                </Typography>
              )}
            </SectionData>
          </SectionRow>
        </Section>

        <SectionRow sx={{ pt: 0.5 }}>
          <SectionLabel variant="caption">
            {t('Balance after transaction')}
          </SectionLabel>
          <SectionData data-testid="balance-after-send-amount">
            <TokenAmount
              amount={balanceAfterDisplay}
              symbol={token?.symbol}
              fiatValue={
                token?.priceUSD
                  ? `${balanceAfterInCurrencyDisplay} ${currency}`
                  : ''
              }
            />
          </SectionData>
        </SectionRow>

        <Stack
          sx={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'flex-end',
            flexGrow: 1,
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            data-testid="send-cancel-button"
            fullWidth
            onClick={() => {
              capture('SendCancel', {
                selectedGasFee,
              });
              history.goBack();
            }}
            sx={{ height: '40px', maxHeight: 'none' }}
          >
            {t('Cancel')}
          </Button>
          <Tooltip
            sx={{ width: '100%' }}
            title={sendState?.error?.error ? sendState?.error?.message : ''}
          >
            <Button
              color="primary"
              data-testid="send-now-button"
              fullWidth
              onClick={onSubmit}
              disabled={!sendState?.canSubmit}
              sx={{ height: '40px', maxHeight: 'none' }}
            >
              {t('Send Now')}
            </Button>
          </Tooltip>
        </Stack>
      </Container>
    </Stack>
  );
};
