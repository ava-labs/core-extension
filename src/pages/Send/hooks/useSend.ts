import {
  ERC20WithBalance,
  SendErrors,
  TokenWithBalance,
  useErc20FormErrors,
  useSendAvaxFormErrors,
} from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { SendStateWithActions } from '../models';
import { useSendAvax } from './useSendAvax';
import { useSendErc20 } from './useSendErc20';

export function useSend(
  selectedToken?: TokenWithBalance
): (SendStateWithActions & { errors: SendErrors }) | null {
  const { avaxToken } = useWalletContext();
  const token = selectedToken || avaxToken;

  const sendAvaxState = useSendAvax();
  const sendAvaxErrors = useSendAvaxFormErrors(sendAvaxState.error);

  const sendERC20State = useSendErc20(
    token.isErc20 ? (token as ERC20WithBalance) : undefined
  );
  const sendERC20Errors = useErc20FormErrors(sendERC20State?.error);

  if (token.isErc20) {
    return sendERC20State && { ...sendERC20State, errors: sendERC20Errors };
  } else {
    return sendAvaxState && { ...sendAvaxState, errors: sendAvaxErrors };
  }
}
