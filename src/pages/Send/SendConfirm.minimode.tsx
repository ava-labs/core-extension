import {
  bigToLocaleString,
  bnToBig,
  bnToLocaleString,
} from '@avalabs/avalanche-wallet-sdk';
import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  ComponentSize,
  Card,
  HorizontalFlex,
  SecondaryButton,
  AvaxTokenIcon,
  HorizontalSeparator,
  Tooltip,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { Contact } from '@src/background/services/contacts/models';
import { SendErrors, TokenWithBalance } from '@avalabs/wallet-react-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { SendStateWithActions } from './models';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useHistory } from 'react-router-dom';
import { useLedgerDisconnectedDialog } from '../SignTransaction/hooks/useLedgerDisconnectedDialog';
import { TokenIcon } from '@src/components/common/TokenImage';
import { CustomFees } from '@src/components/common/CustomFees';
import { GasPrice } from '@src/background/services/gas/models';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import {
  PageTitleMiniMode,
  PageTitleVariant,
} from '@src/components/common/PageTitle';

const SummaryAvaxTokenIcon = styled(AvaxTokenIcon)`
  position: absolute;
  top: -28px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  border: 8px solid;
  border-color: ${({ theme }) => theme.colors.bg1};
  border-radius: 50%;
`;

const SummaryTokenIcon = styled(TokenIcon)`
  position: absolute;
  top: -28px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  border: 8px solid;
  border-color: ${({ theme }) => theme.colors.bg1};
  border-radius: 50%;
`;

const CardLabel = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryAmount = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
`;

const SummaryToken = styled.span`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryAmountInCurrency = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
  margin: 3px 0 0 0;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryCurrency = styled.span`
  font-size: 12px;
  line-height: 15px;
  font-weight: 400;
  margin-left: 4px;
`;

const ContactName = styled(Typography)`
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 14px;
  line-height: 17px;
`;

const ContactAddress = styled(Typography)`
  text-align: right;
  margin-top: 2px;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.text2};
`;

type SendConfirmProps = {
  sendState: (SendStateWithActions & { errors: SendErrors }) | null;
  contact: Contact;
  token: TokenWithBalance;
  fallbackAmountDisplayValue?: string;
  onSubmit(): void;
  onGasChanged(gasLimit: string, gasPrice: GasPrice): void;
};

export const SendConfirmMiniMode = ({
  sendState,
  contact,
  token,
  fallbackAmountDisplayValue,
  onSubmit,
  onGasChanged,
}: SendConfirmProps) => {
  const theme = useTheme();
  const history = useHistory();
  const { activeAccount } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();
  useLedgerDisconnectedDialog(() => {
    history.goBack();
  });

  const amount = bnToLocaleString(
    sendState?.amount || new BN(0),
    token.denomination
  );

  // Need separate formatting for high-value (ETH/BTC) vs low-value (DOGE/SHIB) tokens
  // For expensive tokens, display up to 4 decimals.
  // For low value, fallback to CSS ellipsis
  const amountDisplayValue =
    token?.priceUSD && token.priceUSD > 1
      ? bigToLocaleString(bnToBig(sendState?.amount || new BN(0), 18), 4)
      : fallbackAmountDisplayValue;

  const amountInCurrency = currencyFormatter(
    Number(amount || 0) * (token?.priceUSD ?? 0)
  );

  const balanceAfter = token.balance
    .sub(sendState?.amount || new BN(0))
    .sub(token.isAvax ? sendState?.sendFee || new BN(0) : new BN(0));
  const balanceAfterDisplay = bigToLocaleString(bnToBig(balanceAfter, 18), 4);
  const balanceAfterInCurrencyDisplay = currencyFormatter(
    Number(
      bigToLocaleString(
        bnToBig(balanceAfter.mul(new BN(token?.priceUSD || 0)), 18),
        2
      ).replace(',', '')
    )
  );

  if (!activeAccount) {
    history.push('/home');
    return null;
  }

  return (
    <>
      <VerticalFlex height="100%" width="100%">
        <PageTitleMiniMode variant={PageTitleVariant.PRIMARY}>
          Confirm Transaction
        </PageTitleMiniMode>
        <VerticalFlex
          grow="1"
          align="center"
          width="100%"
          padding="0 16px 24px 16px"
        >
          <Card
            style={{ position: 'relative' }}
            margin="44px 0 0 0"
            padding="16px"
          >
            <HorizontalFlex justify="space-between" grow="1" paddingTop="16px">
              <CardLabel>Sending</CardLabel>
              <VerticalFlex>
                <Typography align="right">
                  <SummaryAmount>{amountDisplayValue}</SummaryAmount>{' '}
                  <SummaryToken>{token.symbol}</SummaryToken>
                </Typography>

                {token?.priceUSD && (
                  <SummaryAmountInCurrency align="right">
                    {amountInCurrency}{' '}
                    <SummaryCurrency>{currency}</SummaryCurrency>
                  </SummaryAmountInCurrency>
                )}
              </VerticalFlex>
            </HorizontalFlex>
            {token?.isAvax ? (
              <SummaryAvaxTokenIcon height="56px" />
            ) : (
              <SummaryTokenIcon
                height="56px"
                width="56px"
                src={token.logoURI}
                name={token.name}
              />
            )}
          </Card>

          <Card padding="16px" margin="16px 0 0 0">
            <VerticalFlex width="100%">
              <HorizontalFlex justify="space-between" width="100%">
                <CardLabel>From</CardLabel>
                <VerticalFlex>
                  <ContactName>{activeAccount?.name}</ContactName>
                  <ContactAddress>
                    {truncateAddress(activeAccount?.addressC || '')}
                  </ContactAddress>
                </VerticalFlex>
              </HorizontalFlex>
              <HorizontalSeparator margin="8px 0" />
              <HorizontalFlex justify="space-between" width="100%">
                <CardLabel>To</CardLabel>
                <VerticalFlex>
                  <ContactName>{contact?.name}</ContactName>
                  <ContactAddress>
                    {truncateAddress(contact?.address || '')}
                  </ContactAddress>
                </VerticalFlex>
              </HorizontalFlex>
            </VerticalFlex>
          </Card>

          <HorizontalFlex margin="16px 0 8px" width="100%" align="center">
            <Typography size={12} height="15px" margin="0 8px 0 0">
              Network Fee
            </Typography>
            <TransactionFeeTooltip
              gasPrice={sendState?.gasPrice}
              gasLimit={sendState?.gasLimit}
            />
          </HorizontalFlex>
          <HorizontalFlex width="100%">
            <CustomFees
              gasPrice={{
                bn: sendState?.gasPrice || new BN(0),
              }}
              limit={`${sendState?.gasLimit}`}
              onChange={onGasChanged}
            />
          </HorizontalFlex>

          <HorizontalFlex
            justify="space-between"
            margin="16px 0 0"
            width="100%"
          >
            <Typography size={12} height="15px">
              Balance after transaction
            </Typography>
            <VerticalFlex>
              <Typography align="right">
                <SummaryAmount>{balanceAfterDisplay}</SummaryAmount>{' '}
                <SummaryToken>{token.symbol}</SummaryToken>
              </Typography>
              {token?.priceUSD && (
                <Typography
                  size={12}
                  height="15px"
                  color={theme.colors.text2}
                  align="right"
                >
                  {balanceAfterInCurrencyDisplay} {currency}
                </Typography>
              )}
            </VerticalFlex>
          </HorizontalFlex>

          <VerticalFlex align="center" justify="flex-end" width="100%" grow="1">
            <HorizontalFlex width="100%" justify="space-between" align="center">
              <SecondaryButton
                width="168px"
                size={ComponentSize.LARGE}
                onClick={() => history.goBack()}
              >
                Cancel
              </SecondaryButton>
              <Tooltip
                content={
                  <Typography size={14}>{sendState?.error?.message}</Typography>
                }
                disabled={!sendState?.error?.error}
              >
                <PrimaryButton
                  width="168px"
                  size={ComponentSize.LARGE}
                  onClick={onSubmit}
                  disabled={!sendState?.canSubmit}
                >
                  Send Now
                </PrimaryButton>
              </Tooltip>
            </HorizontalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
};
