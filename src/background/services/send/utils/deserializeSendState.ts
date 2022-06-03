import { hexToBN } from '@avalabs/utils-sdk';
import BN from 'bn.js';
import { BigNumber } from 'ethers';
import { TokenWithBalance } from '../../balances/models';
import { SendState } from '../models';

// SendState where all BN fields are string
type SerializedSendState = Omit<
  SendState,
  'amount' | 'gasPrice' | 'maxAmount' | 'sendFee' | 'token'
> & {
  amount?: string;
  gasPrice?: string;
  maxAmount?: string;
  sendFee?: string;
  token?: Omit<TokenWithBalance, 'balance'> & {
    balance: string;
  };
};

/**
 * Deserialize SendState after being passed to/from the background.
 */
export function deserializeSendState(
  serializedState: SerializedSendState
): SendState {
  return {
    ...serializedState,
    amount: maybeHexToBN(serializedState.amount),
    gasPrice: serializedState.gasPrice
      ? BigNumber.from(serializedState.gasPrice)
      : undefined,
    maxAmount: maybeHexToBN(serializedState.maxAmount),
    sendFee: maybeHexToBN(serializedState.sendFee),
    token: serializedState.token
      ? {
          ...(serializedState.token as any as TokenWithBalance),
          balance: hexToBN(serializedState.token.balance),
        }
      : undefined,
  };
}

function maybeHexToBN(hex?: string): BN | undefined {
  return typeof hex === 'string' ? hexToBN(hex) : undefined;
}
