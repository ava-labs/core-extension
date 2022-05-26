import { useCallback, useEffect, useState } from 'react';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import {
  toast,
  ComponentSize,
  PrimaryButton,
  Tooltip,
  Typography,
  VerticalFlex,
  TransactionToastType,
  TransactionToast,
  LoadingSpinnerIcon,
  WarningIcon,
} from '@avalabs/react-components';
import { SendForm } from './components/SendForm';
import { bnToLocaleString, stringToBN } from '@avalabs/utils-sdk';
import { Contact } from '@src/background/services/contacts/models';
import { SendConfirm } from './SendConfirm';
import { useSend } from './hooks/useSend';
import { Route, Switch, useHistory } from 'react-router-dom';
import { getTransactionLink } from '@avalabs/wallet-react-components';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { PageTitle } from '@src/components/common/PageTitle';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useTheme } from 'styled-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useContactFromParams } from './hooks/useContactFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { GasFeeModifier } from '@src/components/common/CustomFees';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { BigNumber } from 'ethers';
import BN from 'bn.js';
import { TokenWithBalance } from '@src/background/services/balances/models';

export function SendPage() {
  const theme = useTheme();
  const { flags } = useAnalyticsContext();
  const { walletType } = useWalletContext();
  const selectedToken = useTokenFromParams();
  const contactInput = useContactFromParams();
  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();
  const [amountInput, setAmountInput] = useState<BN>();
  const [amountInputDisplay, setAmountInputDisplay] = useState<string>();

  const sendState = useSend(selectedToken);

  const setSendState = sendState.setValues;
  const tokensWBalances = useTokensWithBalances(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );

  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [gasPriceState, setGasPrice] = useState<BigNumber>();
  const { capture } = useAnalyticsContext();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const isMainnet = useIsMainnet();

  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();

  const pageHistory: {
    address?: string;
    token?: TokenWithBalance;
    amountInput?: string;
  } = getPageHistoryData();

  // we send the default selected token to the posthog
  useEffect(() => {
    if (selectedToken) {
      sendTokenSelectedAnalytics(
        selectedToken.isERC20 ? selectedToken.address : selectedToken.symbol
      );
    }
    // we don't need to run this block again just when it is first time loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this will prevent the amount reset after come back from Confirmation page or when the user set the amount before choose the destionation address
  useEffect(() => {
    if (amountInputDisplay && !pageHistory?.amountInput) {
      setNavigationHistoryData({
        amountInput: amountInputDisplay,
      });
    }
  }, [amountInputDisplay, pageHistory?.amountInput, setNavigationHistoryData]);
  // Reset send state before leaving the send flow.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetSendFlow, []);

  const resetSendFlow = () => {
    sendState.reset();
  };

  const onContactChanged = (contact: Contact, selectedTab?: string) => {
    setSendDataInParams({
      token: selectedToken,
      address: contact.address,
      options: { replace: true },
    });
    setSendState({
      token: selectedToken,
      amount: amountInputDisplay,
      address: contact.address,
    });
    capture('SendContactSelected', {
      contactSource: selectedTab,
    });
  };

  const onTokenChanged = (token: TokenWithBalance) => {
    setSendDataInParams({
      token,
      address: contactInput?.address,
      options: { replace: true },
    });
    setSendState({
      token,
      amount: amountInputDisplay,
      address: contactInput?.address,
    });
    sendTokenSelectedAnalytics(token.isERC20 ? token.address : token.symbol);
  };

  const onAmountChanged = useCallback(
    ({ amount, bn }: { amount: string; bn: BN }) => {
      if (!amountInput || !bn.eq(amountInput)) {
        setAmountInput(bn);
      }

      if (!amountInputDisplay || amountInputDisplay !== amount) {
        setAmountInputDisplay(amount);
        setNavigationHistoryData({
          amountInput: amount,
        });

        if (gasPriceState) {
          setSendState({
            token: selectedToken,
            amount: amount,
            address: contactInput?.address,
            gasPrice: gasPriceState,
          });
          return;
        }
        setSendState({
          token: selectedToken,
          amount: amount,
          address: contactInput?.address,
        });
        sendAmountEnteredAnalytics(amount);
      }
    },
    [
      amountInput,
      amountInputDisplay,
      contactInput?.address,
      gasPriceState,
      selectedToken,
      setNavigationHistoryData,
      setSendState,
      sendAmountEnteredAnalytics,
    ]
  );

  // restore page history
  useEffect(() => {
    if (pageHistory) {
      !amountInputDisplay && setAmountInputDisplay(pageHistory?.amountInput);
      setSendState({
        token: selectedToken,
        amount: amountInputDisplay || pageHistory?.amountInput,
        address: contactInput?.address,
      });
    }
  }, [
    amountInputDisplay,
    contactInput?.address,
    pageHistory,
    selectedToken,
    setSendState,
  ]);

  const maxGasPrice =
    selectedToken?.isNetworkToken && amountInput
      ? selectedToken.balance.sub(amountInput).toString()
      : tokensWBalances.find((t) => t.isNetworkToken)?.balance.toString() ||
        '0';

  const onGasChanged = useCallback(
    (gasLimit: number, gasPrice: BigNumber, feeType: GasFeeModifier) => {
      setGasPrice(gasPrice);
      setSendState({
        token: selectedToken,
        amount: amountInputDisplay,
        address: contactInput?.address,
        gasLimit,
        gasPrice,
      });
      setSelectedGasFee(feeType);
    },
    [amountInputDisplay, contactInput?.address, selectedToken, setSendState]
  );
  const onSubmit = () => {
    setShowTxInProgress(true);
    if (!sendState.canSubmit) return;
    capture('SendApproved', {
      selectedGasFee,
    });
    let toastId: string;
    if (walletType !== 'ledger') {
      history.push('/home');
      toastId = toast.custom(
        <TransactionToast
          type={TransactionToastType.PENDING}
          text="Transaction pending..."
          startIcon={
            <LoadingSpinnerIcon height="16px" color={theme.colors.icon1} />
          }
        />
      );
    }

    sendState
      .submit()
      .then((txId) => {
        resetSendFlow();
        toast.custom(
          <TransactionToast
            status="Transaction Successful"
            type={TransactionToastType.SUCCESS}
            text="View in Explorer"
            href={txId ? getTransactionLink(txId, isMainnet) : ''}
          />,
          { id: toastId }
        );
        history.push('/home');
      })
      .catch(() => {
        toast.custom(
          <TransactionToast
            type={TransactionToastType.ERROR}
            text="Transaction Failed"
            startIcon={<WarningIcon height="20px" color={theme.colors.icon1} />}
          />,
          { id: toastId, duration: Infinity }
        );
      })
      .finally(() => {
        setShowTxInProgress(false);
        if (walletType === 'ledger') history.push('/home');
      });
  };

  if (!flags[FeatureGates.SEND]) {
    return <FunctionIsOffline functionName="Send" />;
  }

  return (
    <Switch>
      <Route path="/send/confirm">
        <>
          {showTxInProgress && (
            <TxInProgress
              address={sendState?.address}
              amount={amountInputDisplay}
              symbol={selectedToken.symbol}
              fee={bnToLocaleString(sendState?.sendFee || new BN(0), 18)}
            />
          )}
          <SendConfirm
            sendState={sendState}
            contact={contactInput as Contact}
            token={selectedToken}
            fallbackAmountDisplayValue={amountInputDisplay}
            onSubmit={onSubmit}
            onGasChanged={onGasChanged}
            maxGasPrice={maxGasPrice}
            gasPrice={gasPriceState}
            selectedGasFee={selectedGasFee}
          />
        </>
      </Route>
      <Route path="/send">
        <VerticalFlex height="100%" width="100%">
          <PageTitle>Send</PageTitle>
          <VerticalFlex grow="1" align="center" width="100%" paddingTop="8px">
            <SendForm
              contactInput={contactInput}
              onContactChange={onContactChanged}
              selectedToken={selectedToken}
              onTokenChange={onTokenChanged}
              amountInput={
                amountInput ||
                (pageHistory &&
                  pageHistory.amountInput &&
                  stringToBN(
                    pageHistory.amountInput,
                    selectedToken?.decimals || 9
                  )) ||
                undefined
              }
              onAmountInputChange={onAmountChanged}
              sendState={sendState}
              tokensWBalances={tokensWBalances}
            />
            <VerticalFlex
              align="center"
              justify="flex-end"
              width="100%"
              padding="0 16px 24px"
              grow="1"
            >
              <Tooltip
                content={
                  <Typography size={14}>{sendState.error?.message}</Typography>
                }
                disabled={!sendState.error?.error}
              >
                <PrimaryButton
                  size={ComponentSize.LARGE}
                  width="343px"
                  onClick={() => {
                    setSendDataInParams({
                      token: selectedToken,
                      address: contactInput?.address,
                      options: { path: '/send/confirm' },
                    });
                  }}
                  disabled={!sendState.canSubmit}
                >
                  Next
                </PrimaryButton>
              </Tooltip>
            </VerticalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </Route>
    </Switch>
  );
}
