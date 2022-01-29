import { useEffect, useState } from 'react';
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
import {
  PageContentMiniMode,
  PageTitleMiniMode,
} from './components/Page.minimode';
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
    sendState?.reset();
  };

  const onContactChanged = (contact: Contact) => {
    setContactInput(contact);
    sendState?.setValues(amountInputDisplay, contact.address);
  };

  const onAmountChanged = ({ amount, bn }: { amount: string; bn: BN }) => {
    setAmountInput(bn);
    setAmountInputDisplay(amount);
    sendState?.setValues(amount, contactInput?.address);
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
      cancelText: 'Back to Portfolio',
      onCancel: () => clearDialog(),
    });
  };

  const onSubmit = () => {
    setShowTxInProgress(true);
    if (!sendState?.canSubmit) return;
    sendState
      ?.submit()
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

  return isConfirming && sendState?.canSubmit ? (
    <>
      {showTxInProgress && (
        <TxInProgress
          address={sendState?.address}
          amount={amountInputDisplay}
          symbol={selectedToken.symbol}
          fee={Utils.bnToLocaleString(sendState.sendFee || new BN(0), 18)}
        />
      )}
      <SendConfirmMiniMode
        sendState={sendState}
        contact={contactInput as Contact}
        token={selectedToken}
        fallbackAmountDisplayValue={amountInputDisplay}
        cancelConfirm={() => setIsConfirming(false)}
        onSubmit={onSubmit}
      />
    </>
  ) : (
    <VerticalFlex height="100%" width="100%">
      <PageTitleMiniMode>Send</PageTitleMiniMode>
      <PageContentMiniMode>
        <Typography margin="6px 0 0 0">
          Select an address to continue
        </Typography>
        <SendFormMiniMode
          contactInput={contactInput}
          onContactChange={onContactChanged}
          selectedToken={selectedToken}
          onTokenChange={setSelectedToken}
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
              <Typography size={14}>{sendState?.error?.message}</Typography>
            }
            disabled={!sendState?.error?.error}
          >
            <span>
              <PrimaryButton
                size={ComponentSize.LARGE}
                onClick={() => setIsConfirming(true)}
                disabled={!sendState?.canSubmit}
              >
                Next
              </PrimaryButton>
            </span>
          </Tooltip>
        </VerticalFlex>
      </PageContentMiniMode>
    </VerticalFlex>
  );
}
