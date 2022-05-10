import {
  SendErrors,
  TokenWithBalance,
  useErc20FormErrors,
  useSendAvaxFormErrors,
} from '@avalabs/wallet-react-components';
import { BTC_TOKEN } from '@src/background/services/network/models';
import { useCallback } from 'react';
import { SendStateWithActions, SetSendValuesParams } from '../models';
import { useSendAvax } from './useSendAvax';
import { useSendBtc } from './useSendBtc';
import { useSendBtcFormErrors } from './useSendBtcFormErrors';
import { useSendErc20 } from './useSendErc20';

export function useSend(
  // selectedToken is only used to determine which sendState (AVAX vs ERC20) to return.
  // When updating sendState, the token is passed in as a param to `setValues`
  selectedToken?: TokenWithBalance
):
  | SendStateWithActions & {
      errors: SendErrors;
    } {
  const { setValues: setAvaxValues, ...sendAvaxState } = useSendAvax();
  const sendAvaxErrors = useSendAvaxFormErrors(sendAvaxState.error);

  const { setValues: setBtcValues, ...sendBtcState } =
    useSendBtc(selectedToken);
  const sendBtcErrors = useSendBtcFormErrors(sendBtcState.error);

  const { setValues: setErc20Values, ...sendERC20State } = useSendErc20();
  const sendERC20Errors = useErc20FormErrors(sendERC20State.error);

  const setAvaxOrErc20Values = useCallback(
    ({ token, ...rest }: SetSendValuesParams) => {
      return token?.isErc20
        ? setErc20Values({ token, ...rest })
        : setAvaxValues({ token, ...rest });
    },
    [setAvaxValues, setErc20Values]
  );

  const reset = useCallback(() => {
    sendAvaxState.reset();
    sendBtcState.reset();
    sendERC20State.reset();
  }, [sendAvaxState, sendBtcState, sendERC20State]);

  if (selectedToken?.symbol === BTC_TOKEN.symbol) {
    return {
      ...sendBtcState,
      reset,
      setValues: setBtcValues,
      errors: sendBtcErrors,
    };
  }

  return selectedToken?.isErc20
    ? {
        ...sendERC20State,
        reset,
        setValues: setAvaxOrErc20Values,
        errors: sendERC20Errors,
      }
    : {
        ...sendAvaxState,
        reset,
        setValues: setAvaxOrErc20Values,
        errors: sendAvaxErrors,
      };
}
