import { activateServices } from '@avalabs/wallet-react-components';
import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';
import { browser } from 'webextension-polyfill-ts';
import { ConnectionService } from '../connections/ConnectionService';
import { singleton } from 'tsyringe';
import { LockService } from '../services/lock/LockService';
import { OnboardingService } from '../services/onboarding/OnboardingService';
import { BridgeService } from '../services/bridge/BridgeService';
import { NetworkFeeService } from '../services/networkFee/NetworkFeeService';

@singleton()
export class BackgroundRuntime {
  constructor(
    private connectionService: ConnectionService,
    private lockService: LockService,
    private onboardingService: OnboardingService,
    private bridgeService: BridgeService,
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
