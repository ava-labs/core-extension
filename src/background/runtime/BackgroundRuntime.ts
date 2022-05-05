import { activateServices } from '@avalabs/wallet-react-components';
import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';
import { browser } from 'webextension-polyfill-ts';
import { ConnectionService } from '@src/background/connections/ConnectionService';
import { singleton } from 'tsyringe';
import { LockService } from '@src/background/services/lock/LockService';
import { OnboardingService } from '@src/background/services/onboarding/OnboardingService';
import { BridgeService } from '@src/background/services/bridge/BridgeService';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { BalancesService } from '@src/background/services/balances/BalancesService';

@singleton()
export class BackgroundRuntime {
  constructor(
    private connectionService: ConnectionService,
    private lockService: LockService,
    private onboardingService: OnboardingService,
    private bridgeService: BridgeService,
    private balancesService: BalancesService,
    private networkFeeService: NetworkFeeService
  ) {}

  activate() {
    /**
     * This activates all of the services in the wallet react components SDK
     */
    activateServices();

    this.onInstalled();
    this.addContextMenus();

    // Activate services which need to run all the or are required for bootstraping the wallet state
    this.connectionService.activate();
    this.lockService.activate();
    this.onboardingService.activate();
    this.bridgeService.activate();
    this.networkFeeService.activate();
    this.balancesService.activate();
  }

  private onInstalled() {
    /**
     * If they just install then they need to onboard and we force them
     * fullscreen
     */
    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        browser.tabs.create({ url: ContextContainer.HOME });
      }
    });
  }

  private addContextMenus() {
    browser.contextMenus.removeAll().then(() => {
      // Creating the "Lock wallet" extension menu item
      browser.contextMenus.create({
        id: 'lock-wallet',
        title: '🔒 Lock wallet',
        contexts: ['action'],
      });

      (browser.contextMenus as any).onClicked.addListener((info) => {
        if (info.menuItemId === 'lock-wallet') {
          this.lockService.lock();
        }
      });
    });
  }
}
