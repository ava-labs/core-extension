import {
  DEFAULT_SEND_HOOK_ERROR,
  SendErrors,
  SendHookError,
} from '@avalabs/wallet-react-components';
import { SendBtcError } from '@src/background/services/send/sendBtc/validateSendBtcValues';
import { useEffect, useState } from 'react';

export function useSendBtcFormErrors(error?: SendHookError): SendErrors {
  const [amountError, setAmountError] = useState<SendHookError>(
    DEFAULT_SEND_HOOK_ERROR
  );
  const [addressError, setAddressError] = useState<SendHookError>(
    DEFAULT_SEND_HOOK_ERROR
  );
  const [formError, setFormError] = useState<SendHookError>(
    DEFAULT_SEND_HOOK_ERROR
  );

  function resetErrors() {
    setAddressError(DEFAULT_SEND_HOOK_ERROR);
    setAmountError(DEFAULT_SEND_HOOK_ERROR);
    setFormError(DEFAULT_SEND_HOOK_ERROR);
  }
  useEffect(() => {
    resetErrors();
    if (
      error &&
      [SendBtcError.INVALID_ADDRESS, SendBtcError.ADDRESS_REQUIRED].includes(
        error.message as any
      )
    ) {
      setAddressError(error);
    } else if (
      error &&
      [
        SendBtcError.INSUFFICIENT_BALANCE,
        SendBtcError.AMOUNT_REQUIRED,
      ].includes(error.message as any)
    ) {
      setAmountError(error);
    } else if (error) {
      setFormError(error);
    }
  }, [error]);

  return { amountError, addressError, formError };
}
