import { useCallback, useEffect, useState } from 'react';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import {
  toast,
  ComponentSize,
  PrimaryButton,
  Tooltip,
  Typography,
  useDialog,
  VerticalFlex,
  TransactionToastType,
  TransactionToast,
} from '@avalabs/react-components';
import { SendFormMiniMode } from './components/SendForm.minimode';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { Contact } from '@src/background/services/contacts/models';
import { SendConfirmMiniMode } from './SendConfirm.minimode';
import { useSend } from './hooks/useSend';
import { useHistory } from 'react-router-dom';
import {
  getTransactionLink,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { TxInProgress } from '@src/components/common/TxInProgress';
import { GasPrice } from '@src/background/services/gas/models';
import { PageTitleMiniMode } from '@src/components/common/PageTitle';

export function SendMiniMode() {
  const tokenFromParams = useTokenFromParams();
  const history = useHistory();
  const [selectedToken, setSelectedToken] =
    useState<TokenWithBalance>(tokenFromParams); // Default to token from url params
  const [isConfirming, setIsConfirming] = useState(false);
  const [contactInput, setContactInput] = useState<Contact>();
  const [amountInput, setAmountInput] = useState<BN>();
  const [amountInputDisplay, setAmountInputDisplay] = useState<string>();
  const sendState = useSend(selectedToken);
  const setSendState = sendState.setValues;

  const [showTxInProgress, setShowTxInProgress] = useState(false);
  const { showDialog, clearDialog } = useDialog();

  // Default to the token from the url params
  useEffect(() => {
    setSelectedToken(tokenFromParams);
  }, [tokenFromParams]);

  // Reset send state before leaving the send flow.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => resetSendFlow, []);

  const resetSendFlow = () => {
    setContactInput(undefined);
    setAmountInput(undefined);
    setAmountInputDisplay(undefined);
    sendState.reset();
  };

  const onContactChanged = (contact: Contact) => {
    setContactInput(contact);
    setSendState({
      token: selectedToken,
      amount: amountInputDisplay,
      address: contact.address,
    });
  };

  const onTokenChanged = (token: TokenWithBalance) => {
    setSelectedToken(token);
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
      setSendState({
        token: selectedToken,
        amount: amount,
        address: contactInput?.address,
      });
    },
    [contactInput?.address, selectedToken, setSendState]
  );

  const onGasChanged = (gasLimit: string, gasPrice: GasPrice) => {
    setSendState({
      token: selectedToken,
      amount: amountInputDisplay,
      address: contactInput?.address,
      gasLimit: Number(gasLimit),
      gasPrice,
    });
  };

  const onError = (error: string) => {
    showDialog({
      title: 'Oops, something went wrong',
      body: error,
      confirmText: 'Retry',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        setIsConfirming(false);
      },
      cancelText: 'Back to Home',
      onCancel: () => {
        clearDialog();
        history.push('/home');
      },
    });
  };

  const onSubmit = () => {
    setShowTxInProgress(true);
    if (!sendState.canSubmit) return;
    sendState
      .submit()
      .then((txId) => {
        resetSendFlow();
        toast.custom(
          <TransactionToast
            status="Transaction sent!"
            type={TransactionToastType.SUCCESS}
            text="View in Explorer"
            href={txId ? getTransactionLink(txId) : ''}
          />
        );
        history.push('/home');
      })
      .catch((e) => {
        onError(e);
      })
      .finally(() => setShowTxInProgress(false));
  };

  useEffect(() => {
    history.replace(isConfirming ? '/send/confirm' : '/send');
  }, [history, isConfirming]);

  return isConfirming ? (
    <>
      {showTxInProgress && (
        <TxInProgress
          address={sendState?.address}
          amount={amountInputDisplay}
          symbol={selectedToken.symbol}
          fee={Utils.bnToLocaleString(sendState?.sendFee || new BN(0), 18)}
        />
      )}
      <SendConfirmMiniMode
        sendState={sendState}
        contact={contactInput as Contact}
        token={selectedToken}
        fallbackAmountDisplayValue={amountInputDisplay}
        cancelConfirm={() => setIsConfirming(false)}
        onSubmit={onSubmit}
        onGasChanged={onGasChanged}
      />
    </>
  ) : (
    <VerticalFlex height="100%" width="100%">
      <PageTitleMiniMode>Send</PageTitleMiniMode>
      <VerticalFlex grow="1" align="center" width="100%" paddingTop="8px">
        <SendFormMiniMode
          contactInput={contactInput}
          onContactChange={onContactChanged}
          selectedToken={selectedToken}
          onTokenChange={onTokenChanged}
          amountInput={amountInput}
          onAmountInputChange={onAmountChanged}
          sendState={sendState}
        />
        <VerticalFlex
          align="center"
          justify="flex-end"
          width="100%"
          paddingBottom="16px"
          grow="1"
        >
          <Tooltip
            content={
              <Typography size={14}>{sendState.error?.message}</Typography>
            }
            disabled={!sendState.error?.error}
          >
            <span>
              <PrimaryButton
                size={ComponentSize.LARGE}
                onClick={() => setIsConfirming(true)}
                disabled={!sendState.canSubmit}
              >
                Next
              </PrimaryButton>
            </span>
          </Tooltip>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
