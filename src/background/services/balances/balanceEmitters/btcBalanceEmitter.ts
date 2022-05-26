import { BITCOIN_NETWORK, BITCOIN_TEST_NETWORK } from '@avalabs/chains-sdk';
import { singleton } from 'tsyringe';
import { Account } from '../../accounts/models';
import { NetworkService } from '../../network/NetworkService';
import { BalancesService } from '../BalancesService';
import { onBalanceUpdate, BalanceEmitter } from './models';

@singleton()
export class BtcBalanceEmitter implements onBalanceUpdate {
  constructor(
    protected balanceService: BalancesService,
    protected networkService: NetworkService
  ) {}

  async onUpdate(accounts: Account[], emitter: BalanceEmitter) {
    const activeNetwork = await this.networkService.activeNetwork.promisify();

    const network = activeNetwork?.isTestnet
      ? BITCOIN_TEST_NETWORK
      : BITCOIN_NETWORK;

    const balances = await Promise.allSettled(
      accounts.map(async (account) => {
        const accountBalance = await this.balanceService.getBalanceForNetwork(
          network,
          account.addressBTC
        );
        return { address: account.addressBTC, balances: accountBalance };
      })
    );

    emitter(
      network.chainId,
      balances.reduce((acc, result) => {
        if (result.status === 'rejected') {
          return acc;
        }

        return {
          ...acc,
          [result.value.address]: result.value.balances,
        };
      }, {})
    );
  }
}
