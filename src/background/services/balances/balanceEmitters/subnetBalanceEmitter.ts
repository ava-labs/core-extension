import { ChainId, NetworkVMType } from '@avalabs/chains-sdk';
import { singleton } from 'tsyringe';
import { Account } from '../../accounts/models';
import { NetworkService } from '../../network/NetworkService';
import { BalancesService } from '../BalancesService';
import { onBalanceUpdate, BalanceEmitter } from './models';

const unsupportedNetworks = [
  ChainId.ETHEREUM_HOMESTEAD,
  ChainId.ETHEREUM_TEST_RINKEBY,
];
@singleton()
export class SubnetBalanceEmitter implements onBalanceUpdate {
  constructor(
    protected balanceService: BalancesService,
    protected networkService: NetworkService
  ) {}

  async onUpdate(accounts: Account[], emitter: BalanceEmitter) {
    const activeNetworks = await this.networkService.activeNetworks.promisify();
    Object.values(activeNetworks)
      .filter(
        (network) =>
          network.vmName === NetworkVMType.EVM &&
          !unsupportedNetworks.includes(network.chainId)
      )
      .forEach(async (network) => {
        const balances = await Promise.allSettled(
          accounts.map(async (account) => {
            const info = { address: account.addressC, account };
            const balances = await this.balanceService.getBalanceForNetwork(
              network,
              info.address
            );
            return { address: account.addressC, balances };
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
      });
  }
}
