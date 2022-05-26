import { Account } from '../../accounts/models';
import { TokenWithBalance } from '../models';

export type BalanceEmitter = (
  networkId: number,
  value: Record<string, TokenWithBalance[]>
) => void;
export interface onBalanceUpdate {
  onUpdate(accounts: Account[], emitter: BalanceEmitter): void;
}
