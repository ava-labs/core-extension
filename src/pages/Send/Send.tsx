import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { GasFeeModifier } from '@src/components/common/CustomFees';
import { useKeystoneContext } from '@src/contexts/KeystoneProvider';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { useApprovalHelpers } from '@src/hooks/useApprovalHelpers';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';

const DEFAULT_DECIMALS = 9;

export function SendPage() {
  const { t } = useTranslation();
  const selectedToken = useTokenFromParams(false);
  const contactInput = useContactFromParams();
  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();
  const { network } = useNetworkContext();
  const [amountInput, setAmountInput] = useState<BN>();
  const [amountInputDisplay, setAmountInputDisplay] = useState<string>();
  const { sendState, resetSendState, submitSendState, updateSendState } =
    useSend();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const tokensWBalances = useTokensWithBalances(false);
  const [selectedGasFee, setSelectedGasFee] = useState<GasFeeModifier>(
    GasFeeModifier.NORMAL
  );

  const { isFunctionAvailable, isFunctionSupported } = useIsFunctionAvailable(
    FunctionNames.SEND
  );

  const [currentNetwork, setCurrentNetwork] = useState(network?.vmName);
  const [gasPriceState, setGasPrice] = useState<bigint>();

  const { capture, captureEncrypted } = useAnalyticsContext();
  const { sendTokenSelectedAnalytics, sendAmountEnteredAnalytics } =
    useSendAnalyticsData();

  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const { resetKeystoneRequest } = useKeystoneContext();

  const pageHistory: {
    address?: string;
    token?: TokenWithBalance;
    amountInput?: string;
  } = getPageHistoryData();

  const activeAddress = useMemo(
    () =>
      network
        ? isBitcoinNetwork(network)
          ? activeAccount?.addressBTC
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressBTC, activeAccount?.addressC, network]
  );

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

  async function sendFunds() {
    if (!sendState.canSubmit) return;

    captureEncrypted('SendApproved', {
      address: activeAddress,
      selectedGasFee,
      chainId: network?.chainId,
    });

    await submitSendState()
      .then(async (txId) => {
        resetSendState();
        toastCardWithLink({
          title: t('Send Successful'),
          url: getURL(txId),
          label: t('View in Explorer'),
        });
        captureEncrypted('SendSuccessful', {
          address: activeAddress,
          txHash: txId,
          selectedGasFee,
          chainId: network?.chainId,
        });
      })
      .catch(async () => {
        captureEncrypted('SendFailed', {
          address: activeAddress,
          selectedGasFee,
          chainId: network?.chainId,
        });

        toast.error(t('Transaction Failed'));
      })
      .finally(() => {
        history.push('/home');
      });
  }

  const { handleApproval, handleRejection, isApprovalOverlayVisible } =
    useApprovalHelpers({
      onApprove: sendFunds,
      onReject: () => {
        capture('SendCancel', {
          selectedGasFee,
        });
        resetKeystoneRequest();
        history.goBack();
      },
      pendingMessage: t('Transaction pending...'),
    });

  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const onAddressBookToggled = useCallback((visible) => {
    setIsAddressBookOpen(visible);
  }, []);

  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const onTokenSelectToggled = useCallback((visible) => {
    setIsTokenSelectOpen(visible);
  }, []);

  if (!isFunctionSupported) {
    return (
      <FunctionIsUnavailable
        functionName={FunctionNames.SEND}
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!isFunctionAvailable) {
    return <FunctionIsOffline functionName={FunctionNames.SEND} />;
  }

  return (
    <Switch>
      <Route path="/send/confirm">
        <>
          {isApprovalOverlayVisible && (
            <TxInProgress
              address={sendState?.address}
              amount={amountInputDisplay}
              symbol={selectedToken?.symbol}
              fee={bnToLocaleString(
                sendState?.sendFee || new BN(0),
                network?.networkToken.decimals ?? 18
              )}
              feeSymbol={network?.networkToken.symbol}
              onReject={handleRejection}
              onSubmit={handleApproval}
            />
          )}
          <SendConfirm
            sendState={sendState}
            contact={contactInput as Contact}
            token={selectedToken}
            fallbackAmountDisplayValue={amountInputDisplay}
            onSubmit={handleApproval}
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
