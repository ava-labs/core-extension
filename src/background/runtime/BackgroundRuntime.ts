import { ContextContainer } from '@src/hooks/useIsSpecificContextContainer';
import browser from 'webextension-polyfill';
import { ConnectionService } from '@src/background/connections/ConnectionService';
import { singleton } from 'tsyringe';
import { LockService } from '@src/background/services/lock/LockService';
import { OnboardingService } from '@src/background/services/onboarding/OnboardingService';
import { ModuleManager } from '../vmModules/ModuleManager';
import { BridgeService } from '@avalabs/bridge-unified';

@singleton()
export class BackgroundRuntime {
  constructor(
    private connectionService: ConnectionService,
    private lockService: LockService,
    private onboardingService: OnboardingService,
    // we try to fetch the bridge configs as soon as possible
    private bridgeService: BridgeService,
    private moduleManager: ModuleManager
  ) {}

  activate() {
    this.onInstalled();
    this.registerInpageScript();
    this.addContextMenus();

    // Activate services which need to run all the or are required for bootstraping the wallet state
    this.connectionService.activate();
    this.lockService.activate();
    this.onboardingService.activate();
    this.moduleManager.activate();
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

      browser.contextMenus.onClicked.addListener((info) => {
        if (info.menuItemId === 'lock-wallet') {
          this.lockService.lock();
        }
      });
    });
  }
  /*
   * This content script is injected programmatically because
   * MAIN world injection does not work properly via manifest
   * https://bugs.chromium.org/p/chromium/issues/detail?id=634381
   */
  private async registerInpageScript() {
    try {
      await browser.scripting.registerContentScripts([
        {
          id: 'coreInpageProvider',
          matches: ['file://*/*', 'http://*/*', 'https://*/*'],
          js: ['js/inpage.js'],
          runAt: 'document_start',
          // World is not supported by the polyfilled types yet
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          world: 'MAIN',
          allFrames: true,
        },
      ]);
    } catch (err) {
      /**
       * An error occurs when the background script is reloaded.
       * Attempts to avoid the duplicate script error
       */
      console.warn(`Dropped attempt to register inpage content script. ${err}`);
    }
  }
}
