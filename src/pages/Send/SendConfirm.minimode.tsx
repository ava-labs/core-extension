import { Utils } from '@avalabs/avalanche-wallet-sdk';
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
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import {
  PageTitleMiniMode,
  PageContentMiniMode,
} from './components/Page.minimode';
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
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryAmount = styled.span`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  font-weight: 700;
`;

const SummaryToken = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryAmountInCurrency = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  padding-top: 8px;
  color: ${({ theme }) => theme.colors.text2};
`;

const SummaryCurrency = styled.span`
  font-size: 12px;
  font-weight: 400;
`;

const FeeAmount = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text2};
`;

const FeeToken = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text2};
`;

const ContactName = styled(Typography)`
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
`;

const ContactAddress = styled(Typography)`
  text-align: right;
  margin-top: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text2};
`;

type SendConfirmProps = {
  sendState: (SendStateWithActions & { errors: SendErrors }) | null;
  contact: Contact;
  token: TokenWithBalance;
  fallbackAmountDisplayValue?: string;
  cancelConfirm(): void;
  onSubmit(): void;
};

export const SendConfirmMiniMode = ({
  sendState,
  contact,
  token,
  fallbackAmountDisplayValue,
  cancelConfirm,
  onSubmit,
}: SendConfirmProps) => {
  const theme = useTheme();
  const history = useHistory();
  const { activeAccount } = useAccountsContext();
  const { currencyFormatter, currency } = useSettingsContext();
  useLedgerDisconnectedDialog();

  const amount = Utils.bnToLocaleString(
    sendState?.amount || new BN(0),
    token.denomination
  );

  // Need separate formatting for high-value (ETH/BTC) vs low-value (DOGE/SHIB) tokens
  // For expensive tokens, display up to 4 decimals.
  // For low value, fallback to CSS ellipsis
  const amountDisplayValue =
    token?.priceUSD && token.priceUSD > 1
      ? Utils.bigToLocaleString(
          Utils.bnToBig(sendState?.amount || new BN(0), 18),
          4
        )
      : fallbackAmountDisplayValue;

  const amountInCurrency = currencyFormatter(
    Number(amount || 0) * (token?.priceUSD ?? 0)
  );

  const balanceAfter = token.balance
    .sub(sendState?.amount || new BN(0))
    .sub(token.isAvax ? sendState?.sendFee || new BN(0) : new BN(0));
  const balanceAfterDisplay = Utils.bigToLocaleString(
    Utils.bnToBig(balanceAfter, 18),
    4
  );
  const balanceAfterInCurrencyDisplay = currencyFormatter(
    Number(
      Utils.bigToLocaleString(
        Utils.bnToBig(balanceAfter.mul(new BN(token?.priceUSD || 0)), 18),
        2
      ).replace(',', '')
    )
  );

  const sendFeeDisplay = Utils.bigToLocaleString(
    Utils.bnToBig(sendState?.sendFee || new BN(0), 18),
    4
  );

  if (!activeAccount) {
    history.push('/home');
    return null;
  }

  return (
    <>
      <VerticalFlex height="100%" width="100%">
        <PageTitleMiniMode onBackClick={cancelConfirm}>
          Confirm Transaction
        </PageTitleMiniMode>
        <PageContentMiniMode padding="0 16px 16px 16px">
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
              <HorizontalSeparator margin="16px 0" />
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

          <HorizontalFlex justify="space-between" width="100%" margin="16px">
            <Typography size={12} weight={400} color={theme.colors.text2}>
              Network Fee
            </Typography>
            <VerticalFlex>
              <Typography align="right">
                <FeeAmount>{sendFeeDisplay}</FeeAmount>{' '}
                <FeeToken>AVAX</FeeToken>
              </Typography>
            </VerticalFlex>
          </HorizontalFlex>

          <HorizontalFlex justify="space-between" margin="8px 0" width="100%">
            <Typography size={12} weight={400} color={theme.colors.text2}>
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
                  weight={400}
                  height="16px"
                  color={theme.colors.text2}
                  align="right"
                >
                  {balanceAfterInCurrencyDisplay} {currency}
                </Typography>
              )}
            </VerticalFlex>
          </HorizontalFlex>

          <VerticalFlex align="center" justify="flex-end" width="100%" grow="1">
            <HorizontalFlex justify="center">
              <SecondaryButton
                size={ComponentSize.MEDIUM}
                onClick={cancelConfirm}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                size={ComponentSize.MEDIUM}
                margin="0 0 0 16px"
                onClick={onSubmit}
              >
                Send now
              </PrimaryButton>
            </HorizontalFlex>
          </VerticalFlex>
        </PageContentMiniMode>
      </VerticalFlex>
    </>
  );
};
