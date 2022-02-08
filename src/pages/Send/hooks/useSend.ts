import {
  SendErrors,
  TokenWithBalance,
  useErc20FormErrors,
  useSendAvaxFormErrors,
} from '@avalabs/wallet-react-components';
import { useCallback } from 'react';
import { SendStateWithActions, SetSendValuesParams } from '../models';
import { useSendAvax } from './useSendAvax';
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

  const { setValues: setErc20Values, ...sendERC20State } = useSendErc20();
  const sendERC20Errors = useErc20FormErrors(sendERC20State?.error);

  const setAvaxOrErc20Values = useCallback(
    ({ token, ...rest }: SetSendValuesParams) => {
      return token?.isErc20
        ? setErc20Values({ token, ...rest })
        : setAvaxValues({ ...rest });
    },
    [setAvaxValues, setErc20Values]
  );

  const reset = () => {
    sendERC20State?.reset();
    sendAvaxState.reset();
  };

  return selectedToken?.isErc20
    ? sendERC20State && {
        ...sendERC20State,
        reset,
        setValues: setAvaxOrErc20Values,
        errors: sendERC20Errors,
      }
    : sendAvaxState && {
        ...sendAvaxState,
        reset,
        setValues: setAvaxOrErc20Values,
        errors: sendAvaxErrors,
      };
}
