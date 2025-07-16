import { ContextContainer } from '@core/types';
import { singleton } from 'tsyringe';
import browser from 'webextension-polyfill';
import type { ConnectionService } from '../connections/ConnectionService';
import type { AppCheckService } from '../services/appcheck/AppCheckService';
import type { BridgeService } from '../services/bridge/BridgeService';
import type { GasStationService } from '../services/gasless/GasStationService';
import type { LockService } from '../services/lock/LockService';
import type { NotificationsService } from '../services/notifications/NotificationsService';
import type { OnboardingService } from '../services/onboarding/OnboardingService';
import type { AddressResolver } from '../services/secrets/AddressResolver';
import type { SettingsService } from '../services/settings/SettingsService';
import type { ModuleManager } from '../vmModules/ModuleManager';

@singleton()
export class BackgroundRuntime {
  constructor(
    private connectionService: ConnectionService,
    private lockService: LockService,
    private onboardingService: OnboardingService,
    // we try to fetch the bridge configs as soon as possible
    private bridgeService: BridgeService,
    private moduleManager: ModuleManager,
    private addressResolver: AddressResolver,
    private appCheckService: AppCheckService,
    private gasStationService: GasStationService,
    private notificationsService: NotificationsService,
    private settingsService: SettingsService,
  ) {}

  async activate() {
    this.onInstalled();
    this.registerInpageScript();
    this.addContextMenus();

    this.settingsService
      .getSettings()
      .then((settings) => {
        chrome.sidePanel.setPanelBehavior({
          openPanelOnActionClick: settings.preferredView === 'sidebar',
        });
      })
      .catch((error) => console.error(error));

    // Activate services which need to run all the or are required for bootstraping the wallet state
    this.connectionService.activate();
    this.lockService.activate();
    this.onboardingService.activate();
    this.moduleManager.activate();

    this.addressResolver.init(this.moduleManager);
    this.appCheckService.activate();
    this.#createOffScreen();
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
      browser.contextMenus.create({
        id: 'lock-restart-separator',
        type: 'separator',
        contexts: ['action'],
      });
      browser.contextMenus.create({
        id: 'restart-wallet',
        title: '🔄 Restart',
        contexts: ['action'],
      });

      browser.contextMenus.onClicked.addListener((info) => {
        if (info.menuItemId === 'lock-wallet') {
          this.lockService.lock();
        } else if (info.menuItemId === 'restart-wallet') {
          browser.runtime.reload();
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
          js: ['inpage/js/inpage.js'],
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

  async #createOffScreen() {
    try {
      await chrome.offscreen.closeDocument();
    } catch {
      // nothing to close
    }

    await chrome.offscreen.createDocument({
      url: 'offscreen/offscreen.html',
      reasons: ['WORKERS'],
      justification: 'offload computation',
    });
  }
}
