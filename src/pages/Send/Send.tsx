import { useCallback, useEffect, useState } from 'react';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { SendForm } from './components/SendForm';
import { bnToLocaleString, stringToBN } from '@avalabs/utils-sdk';
import type { Contact } from '@avalabs/types';
import { SendConfirm } from './SendConfirm';
import { useSend } from './hooks/useSend';
import { Route, Switch, useHistory } from 'react-router-dom';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { PageTitle } from '@src/components/common/PageTitle';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useContactFromParams } from './hooks/useContactFromParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useSendAnalyticsData } from '@src/hooks/useSendAnalyticsData';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkVMType } from '@avalabs/chains-sdk';
import BN from 'bn.js';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useTranslation } from 'react-i18next';
import { getSendErrorMessage } from './utils/sendErrorMessages';
import { SendErrorMessage } from '@src/background/services/send/models';
import {
  toast,
  Typography,
  Button,
  Stack,
  Scrollbars,
  Tooltip,
} from '@avalabs/k2-components';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import { GasFeeModifier } from '@src/components/common/CustomFees';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import useIsUsingKeystoneWallet from '@src/hooks/useIsUsingKeystoneWallet';
import { useKeystoneContext } from '@src/contexts/KeystoneProvider';
import useIsUsingWalletConnectAccount from '@src/hooks/useIsUsingWalletConnectAccount';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';

const DEFAULT_DECIMALS = 9;

export function SendPage() {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlagContext();
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
    GasFeeModifier.NORMAL
  );

  const isUsingLedgerWallet = useIsUsingLedgerWallet();
  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();
  const isUsingWalletConnectAccount = useIsUsingWalletConnectAccount();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();

  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(network?.vmName);
  const [gasPriceState, setGasPrice] = useState<bigint>();
  const { capture } = useAnalyticsContext();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { resetKeystoneRequest } = useKeystoneContext();

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
      if (selectedToken?.symbol !== token.symbol) {
        setSendDataInParams({
          token,
          address: contactInput?.address,
          options: { replace: true },
        });
      }
      updateSendState({ token });
      sendTokenSelectedAnalytics('Send');
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
            maxFeePerGas: gasPriceState,
          });
          return;
        }
        updateSendState({ amount: bn });
        sendAmountEnteredAnalytics('Send');
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
    const inputAddress = contactInput?.address || contactInput?.addressBTC;
    const stateUpdate = {
      address: inputAddress || pageHistory.address,
    };

    if (pageHistory.amountInput && !amountInputDisplay) {
      setAmountInputDisplay(pageHistory.amountInput);
      Object.assign(stateUpdate, {
        amount: stringToBN(
          pageHistory.amountInput || '0',
          selectedToken?.decimals || 9
        ),
      });
    }

    if (Object.keys(stateUpdate).length > 0) {
      updateSendState(stateUpdate);
    }
  }, [
    amountInput,
    amountInputDisplay,
    contactInput?.address,
    contactInput?.addressBTC,
    pageHistory,
    selectedToken?.decimals,
    sendState.address,
    updateSendState,
  ]);

  const maxGasPrice =
    selectedToken?.type === TokenType.NATIVE && amountInput
      ? selectedToken.balance.sub(amountInput).toString()
      : tokensWBalances
          .find(({ type }) => type === TokenType.NATIVE)
          ?.balance.toString() || '0';

  const onGasChanged = useCallback(
    (values: {
      customGasLimit?: number;
      maxFeePerGas: bigint;
      maxPriorityFeePerGas?: bigint;
      feeType: GasFeeModifier;
    }) => {
      setGasPrice(values.maxFeePerGas);
      updateSendState({
        customGasLimit: values.customGasLimit,
        maxFeePerGas: values.maxFeePerGas,
        maxPriorityFeePerGas: values.maxPriorityFeePerGas,
      });
      setSelectedGasFee(values.feeType);
    },
    [updateSendState]
  );

  function getURL(hash: string | undefined): string {
    if (hash && network) {
      return getExplorerAddressByNetwork(network, hash);
    }
    return '';
  }

  function sendFunds(pendingToastId?: string) {
    submitSendState()
      .then((txId) => {
        resetSendState();
        toastCardWithLink({
          title: t('Send Successful'),
          url: getURL(txId),
          label: t('View in Explorer'),
        });
        history.push('/home');
      })
      .catch(() => {
        toast.error(t('Transaction Failed'));
      })
      .finally(() => {
        pendingToastId && toast.dismiss(pendingToastId);
        setShowTxInProgress(false);
        if (isUsingLedgerWallet) {
          history.push('/home');
        }
      });
  }

  const handleSubmitClick = () => {
    let pendingToastId = '';
    setShowTxInProgress(true);
    if (!sendState.canSubmit) return;
    capture('SendApproved', {
      selectedGasFee,
    });
    if (
      !isUsingLedgerWallet &&
      !isUsingKeystoneWallet &&
      !isUsingWalletConnectAccount
    ) {
      history.push('/home');
      pendingToastId = toast.loading(t('Transaction pending...'));
    }

    if (!isUsingWalletConnectAccount) {
      sendFunds(pendingToastId);
    }
  };

  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const onAddressBookToggled = useCallback((visible) => {
    setIsAddressBookOpen(visible);
  }, []);

  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const onTokenSelectToggled = useCallback((visible) => {
    setIsTokenSelectOpen(visible);
  }, []);

  if (!featureFlags[FeatureGates.SEND] || !checkIsFunctionAvailable('Send')) {
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
              onReject={() => {
                capture('SendCancel', {
                  selectedGasFee,
                });
                resetKeystoneRequest();
                setShowTxInProgress(false);
                history.goBack();
              }}
              onSubmit={sendFunds}
            />
          )}
          <SendConfirm
            sendState={sendState}
            contact={contactInput as Contact}
            token={selectedToken}
            fallbackAmountDisplayValue={amountInputDisplay}
            onSubmit={handleSubmitClick}
            maxGasPrice={maxGasPrice}
            gasPrice={gasPriceState}
            selectedGasFee={selectedGasFee}
          />
        </>
      </Route>
      <Route path="/send">
        <Stack sx={{ width: '100%', height: '100%' }}>
          <PageTitle>{t('Send')}</PageTitle>
          <Stack
            sx={{ flexGrow: 1, alignItems: 'center', width: '100%', pt: 1 }}
          >
            <Scrollbars
              style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
            >
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
                      selectedToken?.decimals || DEFAULT_DECIMALS
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
                onAddressBookToggled={onAddressBookToggled}
                onTokenSelectToggled={onTokenSelectToggled}
              />
            </Scrollbars>
            {!isAddressBookOpen && !isTokenSelectOpen && (
              <Stack
                sx={{
                  flexGrow: 1,
                  justifyContent: 'flex-end',
                  pt: 3,
                  px: 2,
                  pb: 3,
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <Tooltip
                  placement="top"
                  sx={{ width: '100%' }}
                  title={
                    sendState.error ? (
                      <Typography variant="body2">
                        {getSendErrorMessage(
                          sendState.error?.message as SendErrorMessage
                        )}
                      </Typography>
                    ) : (
                      ''
                    )
                  }
                >
                  <Button
                    data-testid="send-next-button"
                    variant="contained"
                    size="large"
                    onClick={() => {
                      setSendDataInParams({
                        token: selectedToken,
                        address:
                          network?.vmName === NetworkVMType.BITCOIN
                            ? contactInput?.addressBTC
                            : contactInput?.address,
                        options: { path: '/send/confirm' },
                      });
                    }}
                    disabled={!sendState.canSubmit || sendState.isValidating}
                    isLoading={sendState.isValidating}
                    fullWidth
                  >
                    {t('Next')}
                  </Button>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Route>
    </Switch>
  );
}
