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
import { SendFormMiniMode } from './components/SendForm.minimode';
import {
  BN,
  bnToLocaleString,
  stringToBN,
} from '@avalabs/avalanche-wallet-sdk';
import { Contact } from '@src/background/services/contacts/models';
import { SendConfirmMiniMode } from './SendConfirm.minimode';
import { useSend } from './hooks/useSend';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
  getTransactionLink,
  isAvaxToken,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { GasPrice } from '@src/background/services/gas/models';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';
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

export function SendMiniMode() {
  const theme = useTheme();
  const { flags } = useAnalyticsContext();
  const { walletType, avaxToken } = useWalletContext();
  const selectedToken = useTokenFromParams();
  const contactInput = useContactFromParams();
  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();
  const [amountInput, setAmountInput] = useState<BN>();
  const [amountInputDisplay, setAmountInputDisplay] = useState<string>();

  const sendState = useSend(selectedToken);

  const [defaultGasPrice, setDefaultGasPrice] = useState<GasPrice>();

  const setSendState = sendState.setValues;
  const tokensWBalances = useTokensWithBalances(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );

  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [gasPriceState, setGasPrice] = useState<GasPrice>();
  const { capture } = useAnalyticsContext();

  const isMainnet = useIsMainnet();

  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const pageHistory: {
    address?: string;
    token?: TokenWithBalance;
    amountInput?: string;
  } = getPageHistoryData();

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

  useEffect(() => {
    if (!defaultGasPrice && sendState.gasPrice) {
      setDefaultGasPrice({
        bn: sendState.gasPrice,
        value: sendState.gasPrice.toString(),
      });
    }
  }, [defaultGasPrice, sendState.gasPrice]);

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
  };

  const onAmountChanged = useCallback(
    ({ amount, bn }: { amount: string; bn: BN }) => {
      setAmountInput(bn);
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
    },
    [
      contactInput?.address,
      gasPriceState,
      selectedToken,
      setNavigationHistoryData,
      setSendState,
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
    selectedToken && amountInput && isAvaxToken(selectedToken)
      ? avaxToken.balance.sub(amountInput).toString()
      : avaxToken.balance.toString();

  const onGasChanged = useCallback(
    (gasLimit: string, gasPrice: GasPrice, feeType: GasFeeModifier) => {
      setGasPrice(gasPrice);
      setSendState({
        token: selectedToken,
        amount: amountInputDisplay,
        address: contactInput?.address,
        gasLimit: Number(gasLimit),
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
          <SendConfirmMiniMode
            sendState={sendState}
            contact={contactInput as Contact}
            token={selectedToken}
            fallbackAmountDisplayValue={amountInputDisplay}
            onSubmit={onSubmit}
            onGasChanged={onGasChanged}
            maxGasPrice={maxGasPrice}
            gasPrice={gasPriceState}
            defaultGasPrice={defaultGasPrice}
            selectedGasFee={selectedGasFee}
          />
        </>
      </Route>
      <Route path="/send">
        <VerticalFlex height="100%" width="100%">
          <PageTitleMiniMode>Send</PageTitleMiniMode>
          <VerticalFlex grow="1" align="center" width="100%" paddingTop="8px">
            <SendFormMiniMode
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
                    selectedToken.denomination || 9
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

                    capture('SendTokenAndAmountSelected', {
                      selectedToken:
                        selectedToken.address || selectedToken.symbol,
                      amount: amountInputDisplay,
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
