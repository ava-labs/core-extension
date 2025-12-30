import { ContextContainer, SettingsEvents, SettingsState } from '@core/types';
import { singleton } from 'tsyringe';
import browser from 'webextension-polyfill';
import { ConnectionService } from '../connections/ConnectionService';
import { AppCheckService } from '../services/appcheck/AppCheckService';
import { BridgeService } from '../services/bridge/BridgeService';
import { GasStationService } from '../services/gasless/GasStationService';
import { LockService } from '../services/lock/LockService';
import { NotificationsService } from '../services/notifications/NotificationsService';
import { OnboardingService } from '../services/onboarding/OnboardingService';
import { AddressResolver } from '../services/secrets/AddressResolver';
import { SettingsService } from '../services/settings/SettingsService';
import { ModuleManager } from '../vmModules/ModuleManager';

const SAVE_TIMESTAMP_INTERVAL_MS = 2 * 1000;
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
    this.startKeepAliveTimer();
    this.onInstalled();
    this.registerInpageScript();
    this.addContextMenus();
    await this.setupSidePanel();

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

  // initialize timestamp saving to keep the service worker alive
  private startKeepAliveTimer() {
    const saveTimestamp = () => {
      const timestamp = new Date().toISOString();
      browser.storage.session.set({ timestamp });
    };

    saveTimestamp();
    setInterval(saveTimestamp, SAVE_TIMESTAMP_INTERVAL_MS);
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
    // Support starts at Chrome 109+
    if (!browser.offscreen) {
      return;
    }

    try {
      await browser.offscreen.closeDocument();
    } catch {
      // nothing to close
    }

    try {
      await browser.offscreen.createDocument({
        url: 'offscreen/offscreen.html',
        reasons: [browser.offscreen.Reason.WORKERS],
        justification: 'offload computation',
      });
    } catch (err) {
      // We're getting error logs of Chrome 109 not liking "WORKERS" as a reason for creating the offscreen document.
      // Maybe it was not supported back then -- either way, nothing we can do about it.
      const canIgnore =
        err instanceof Error &&
        err.message.includes("Error at property 'reasons'");

      if (!canIgnore) {
        throw err;
      }
    }
  }

  private async setupSidePanel() {
    const hasSidePanelPermission = await browser.permissions.contains({
      permissions: ['sidePanel'],
    });

    if (!hasSidePanelPermission) {
      return;
    }

    const setSidePanelBehavior = (settings: SettingsState) => {
      const { preferredView } = settings;

      if (!preferredView) {
        return;
      }

      browser.sidePanel.setPanelBehavior({
        openPanelOnActionClick: preferredView === 'sidebar',
      });
    };

    setSidePanelBehavior(await this.settingsService.getSettings());

    this.settingsService.addListener(
      SettingsEvents.SETTINGS_UPDATED,
      setSidePanelBehavior,
    );
  }
}
