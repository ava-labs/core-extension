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
import { TxInProgress } from '@src/components/common/TxInProgress';
import { PageTitle } from '@src/components/common/PageTitle';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
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
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { BigNumber } from 'ethers';
import BN from 'bn.js';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';

export function SendPage() {
  const theme = useTheme();
  const { flags } = useAnalyticsContext();
  const { walletType } = useWalletContext();
  const selectedToken = useTokenFromParams(false);
  const contactInput = useContactFromParams();
  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();
  const { network } = useNetworkContext();
  const [amountInput, setAmountInput] = useState<BN>();
  const [amountInputDisplay, setAmountInputDisplay] = useState<string>();

  const { sendState, resetSendState, submitSendState, updateSendState } =
    useSend();

  const tokensWBalances = useTokensWithBalances(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.INSTANT
  );

  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(network?.vmName);
  const [gasPriceState, setGasPrice] = useState<BigNumber>();
  const { capture } = useAnalyticsContext();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();

  const pageHistory: {
    address?: string;
    token?: TokenWithBalance;
    amountInput?: string;
  } = getPageHistoryData();

  // this will prevent the amount reset after come back from Confirmation page or when the user set the amount before choose the destionation address
  useEffect(() => {
    if (amountInputDisplay && !pageHistory.amountInput) {
      setNavigationHistoryData({
        amountInput: amountInputDisplay,
      });
    }
  }, [amountInputDisplay, pageHistory.amountInput, setNavigationHistoryData]);

  // Reset send state before leaving the send flow.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetSendState, []);

  // when the network changes we need to clear contact input
  useEffect(() => {
    if (currentNetwork !== network?.vmName) {
      setCurrentNetwork(network?.vmName);
      setSendDataInParams({});
    }
  }, [network?.vmName, currentNetwork, setSendDataInParams]);

  const onContactChanged = (contact: Contact, selectedTab?: string) => {
    let addressToUse = '';
    if (network?.vmName === NetworkVMType.EVM) {
      // use contact.address
      addressToUse = contact.address || '';
    }
    if (network?.vmName === NetworkVMType.BITCOIN) {
      // when the contact is selected from the dropdown it will have 'contact.addressBTC'
      // when the address is typed in manually it will be 'contact.address' and not have 'contact.addressBTC'
      // this is because the contact is set in the params and only uses 'address'
      addressToUse = contact.addressBTC || contact.address;
    }

    setSendDataInParams({
      token: selectedToken,
      address: addressToUse,
      options: { replace: true },
    });
    updateSendState({ address: addressToUse });
    capture('SendContactSelected', { contactSource: selectedTab });
  };

  const onTokenChanged = useCallback(
    (token: TokenWithBalance) => {
      if (selectedToken?.symbol !== token.symbol)
        setSendDataInParams({
          token,
          address: contactInput?.address,
          options: { replace: true },
        });
      updateSendState({ token });
      sendTokenSelectedAnalytics(token.isERC20 ? token.address : token.symbol);
    },
    [
      contactInput?.address,
      selectedToken?.symbol,
      sendTokenSelectedAnalytics,
      setSendDataInParams,
      updateSendState,
    ]
  );

  // When the URL updates (selectedToken) then update sendState
  useEffect(() => {
    if (selectedToken && selectedToken?.symbol !== sendState.token?.symbol)
      onTokenChanged(selectedToken);
  }, [onTokenChanged, selectedToken, sendState.token?.symbol]);

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
          updateSendState({
            amount: bn,
            gasPrice: gasPriceState,
          });
          return;
        }
        updateSendState({ amount: bn });
        sendAmountEnteredAnalytics(amount);
      }
    },
    [
      amountInput,
      amountInputDisplay,
      setNavigationHistoryData,
      gasPriceState,
      updateSendState,
      sendAmountEnteredAnalytics,
    ]
  );

  // restore page history
  useEffect(() => {
    if (pageHistory.amountInput && !amountInputDisplay) {
      setAmountInputDisplay(pageHistory.amountInput);
      updateSendState({
        amount: stringToBN(
          pageHistory.amountInput || '0',
          selectedToken?.decimals || 9
        ),
        address: contactInput?.address || pageHistory.address,
      });
    }
    if (contactInput?.address && !sendState.address) {
      updateSendState({ address: contactInput?.address });
    }
  }, [
    amountInput,
    amountInputDisplay,
    contactInput?.address,
    pageHistory,
    selectedToken?.decimals,
    sendState.address,
    updateSendState,
  ]);

  const maxGasPrice =
    selectedToken?.isNetworkToken && amountInput
      ? selectedToken.balance.sub(amountInput).toString()
      : tokensWBalances.find((t) => t.isNetworkToken)?.balance.toString() ||
        '0';

  const onGasChanged = useCallback(
    (gasLimit: number, gasPrice: BigNumber, feeType: GasFeeModifier) => {
      setGasPrice(gasPrice);
      updateSendState({
        gasLimit,
        gasPrice,
      });
      setSelectedGasFee(feeType);
    },
    [updateSendState]
  );

  function getURL(hash: string | undefined | void): string {
    if (hash && network) {
      return getExplorerAddressByNetwork(network, hash);
    }
    return '';
  }
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

    submitSendState()
      .then((txId) => {
        resetSendState();
        toast.custom(
          <TransactionToast
            status="Transaction Successful"
            type={TransactionToastType.SUCCESS}
            text="View in Explorer"
            href={getURL(txId)}
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
              symbol={selectedToken?.symbol}
              fee={bnToLocaleString(
                sendState?.sendFee || new BN(0),
                network?.networkToken.decimals ?? 18
              )}
              feeSymbol={network?.networkToken.symbol}
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
              onGasChanged={onGasChanged}
              maxGasPrice={maxGasPrice}
              gasPrice={gasPriceState}
              selectedGasFee={selectedGasFee}
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
