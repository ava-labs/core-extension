import React from 'react';
import { SendConfirm } from './SendConfirm';
import { useState } from 'react';
import { isERC20Token } from '@avalabs/wallet-react-components';
import { useSend } from './hooks/useSend';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { SendForm } from './components/SendForm';
import {
  ComponentSize,
  PrimaryButton,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { Modal } from '@src/components/common/Modal';

export function Send() {
  const sendState = useSend();
  const { showDialog, clearDialog } = useDialog();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const tokensWBalances = useTokensWithBalances();
  const selectedToken = useTokenFromParams(tokensWBalances);

  const onError = (error: string) => {
    showDialog({
      title: 'Oops, something went wrong',
      body: error,
      confirmText: 'Retry',
      width: '343px',
      onConfirm: () => {
        clearDialog();
        setShowConfirmation(false);
      },
      cancelText: 'Back to Portfolio',
      onCancel: () => {
        clearDialog();
      },
    });
  };

  const resetSendFlow = () => {
    sendState?.reset();
    setShowConfirmation(false);
  };

  const onConfirm = () => {
    sendState
      ?.submit()
      .then(() => resetSendFlow())
      .catch((e) => {
        onError(e);
      });
  };

  return (
    <>
      <SendForm sendState={sendState} />
      <VerticalFlex align="center" justify="flex-end" width="100%" grow="1">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => setShowConfirmation(true)}
          disabled={!sendState?.canSubmit}
        >
          Next
        </PrimaryButton>
      </VerticalFlex>
      <Modal isOpen={showConfirmation}>
        <VerticalFlex padding="36px" height="100%">
          <SendConfirm
            onClose={() => setShowConfirmation(false)}
            sendState={sendState}
            token={selectedToken}
            fee={
              sendState?.sendFee
                ? Utils.bnToLocaleString(
                    sendState?.sendFee || new BN(0),
                    isERC20Token(selectedToken) ? 18 : 9
                  )
                : ''
            }
            onConfirm={() => onConfirm()}
          />
        </VerticalFlex>
      </Modal>
    </>
  );
}
