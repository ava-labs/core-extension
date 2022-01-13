import { SendConfirm } from './SendConfirm';
import { useState } from 'react';
import { useSend } from './hooks/useSend';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';
import { SendForm } from './components/SendForm';
import {
  ComponentSize,
  PrimaryButton,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { useHistory } from 'react-router';

const ConfirmContainer = styled(VerticalFlex)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.bg4};
`;

export function SendMiniMode() {
  const history = useHistory();
  const sendState = useSend();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const selectedToken = useTokenFromParams();
  const { showDialog, clearDialog } = useDialog();

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
        history.push('/home');
      },
    });
  };

  const onConfirm = () => {
    sendState
      ?.submit()
      .then(() => resetSendFlow())
      .catch((e) => {
        onError(e);
      });
  };

  const resetSendFlow = () => {
    sendState?.reset();
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
      {showConfirmation && (
        <ConfirmContainer>
          <SendConfirm
            onClose={() => setShowConfirmation(false)}
            token={selectedToken}
            sendState={sendState}
            fee={
              sendState?.sendFee
                ? Utils.bnToLocaleString(sendState?.sendFee || new BN(0), 18)
                : ''
            }
            onConfirm={() => onConfirm()}
          />
        </ConfirmContainer>
      )}
    </>
  );
}
