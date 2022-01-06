import {
  AntWithBalance,
  ERC20WithBalance,
  SendErrors,
  useErc20FormErrors,
  useSendAntFormErrors,
  useSendAvaxFormErrors,
} from '@avalabs/wallet-react-components';
import { useGetSendTypeFromParams } from '@src/hooks/useGetSendTypeFromParams';
import { useTokenFromParams } from '@src/hooks/useTokenFromParams';
import { SendStateWithActions, TransactionSendType } from '../models';
import { useSendAnt } from './useSendAnt';
import { useSendAvax } from './useSendAvax';
import { useSendErc20 } from './useSendErc20';

export function useSend():
  | (SendStateWithActions & { errors: SendErrors })
  | null {
  const sendType = useGetSendTypeFromParams();
  const selectedToken = useTokenFromParams();

  const sendAvaxState = useSendAvax();
  const sendAvaxErrors = useSendAvaxFormErrors(sendAvaxState.error);
  const sendAntState = useSendAnt(
    sendType === TransactionSendType.ANT
      ? (selectedToken as AntWithBalance)
      : undefined
  );
  const sendAntErrors = useSendAntFormErrors(sendAntState?.error);
  const sendERC20State = useSendErc20(
    sendType === TransactionSendType.ERC20
      ? (selectedToken as ERC20WithBalance)
      : undefined
  );
  const sendERC20Errors = useErc20FormErrors(sendERC20State?.error);

  if (sendType === TransactionSendType.ANT) {
    return sendAntState && { ...sendAntState, errors: sendAntErrors };
  } else if (sendType === TransactionSendType.ERC20) {
    return sendERC20State && { ...sendERC20State, errors: sendERC20Errors };
  } else {
    return sendAvaxState && { ...sendAvaxState, errors: sendAvaxErrors };
  }
}
