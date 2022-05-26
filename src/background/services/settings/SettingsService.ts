import { getContractDataErc20 } from '@avalabs/avalanche-wallet-sdk';
import {
  currencies,
  currentSelectedCurrency$,
} from '@avalabs/wallet-react-components';
import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { WalletService } from '../wallet/WalletService';
import { SettingsEvents, TokensVisibility } from './models';
import { SettingsState, SETTINGS_STORAGE_KEY, ThemeVariant } from './models';

const DEFAULT_SETTINGS_STATE: SettingsState = {
  currency: 'USD',
  customTokens: {},
  showTokensWithoutBalances: false,
  theme: ThemeVariant.DARK,
  tokensVisibility: {},
  isDefaultExtension: false,
  analyticsConsent: true,
};

@singleton()
export class SettingsService implements OnStorageReady {
  private eventEmitter = new EventEmitter();
  constructor(
    private storageService: StorageService,
    private networkService: NetworkService,
    private walletService: WalletService
  ) {
    this.applySettings();
    this.networkService.activeNetwork.add(() => {
      this.applySettings();
    });
  }

  onStorageReady(): void {
    this.applySettings();
  }

  private async applySettings() {
    let settings: SettingsState;
    try {
      settings = await this.getSettings();
    } catch (e) {
      return;
    }

    const currencyObject = currencies.find(
      ({ symbol }) => settings.currency === symbol
    );
    if (currencyObject) {
      currentSelectedCurrency$.next(currencyObject.symbol);
    }
    this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, settings);
  }

  async getSettings(): Promise<SettingsState> {
    const state = await this.storageService.load<SettingsState>(
      SETTINGS_STORAGE_KEY
    );

    return {
      ...DEFAULT_SETTINGS_STATE,
      ...state,
    };
  }

  async addCustomToken(tokenAddress: string) {
    if (!this.walletService.walletState?.erc20Tokens) {
      throw new Error('No ERC20 tokens found in wallet.');
    }
    const activeNetwork = await this.networkService.activeNetwork.promisify();
    const tokenAlreadyExists =
      this.walletService.walletState.erc20Tokens.reduce(
        (exists, existingToken) =>
          exists || existingToken.address === tokenAddress,
        false
      );

    if (tokenAlreadyExists) {
      throw new Error('Token already exists in the wallet.');
    }

    const tokenData = await getContractDataErc20(tokenAddress);
    if (!tokenData) {
      throw new Error(`ERC20 contract ${tokenAddress} does not exist.`);
    }
    if (!activeNetwork?.chainId) {
      throw new Error('Unable to detect current network selection.');
    }

    const settings = await this.getSettings();

    const newSettings: SettingsState = {
      ...settings,
      customTokens: {
        ...settings.customTokens,
        [activeNetwork?.chainId]: {
          ...settings.customTokens[activeNetwork?.chainId],
          [tokenAddress.toLowerCase()]: tokenData,
        },
      },
    };
    await this.saveSettings(newSettings);
  }

  async setAnalyticsConsent(consent: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      analyticsConsent: !!consent,
    });
  }

  async toggleIsDefaultExtension() {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      isDefaultExtension: !settings.isDefaultExtension,
    });
  }

  async setCurrencty(currency: string) {
    const settings = await this.getSettings();
    const currencyObject = currencies.find(({ symbol }) => currency === symbol);
    if (currencyObject) {
      currentSelectedCurrency$.next(currencyObject.symbol);
    }

    await this.saveSettings({
      ...settings,
      currency,
    });
  }

  async setShowTokensWithNoBalance(show: boolean) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      showTokensWithoutBalances: show,
    });
  }

  async setTheme(theme: ThemeVariant) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      theme,
    });
  }

  async setTokensVisibility(visibility: TokensVisibility) {
    const settings = await this.getSettings();
    await this.saveSettings({
      ...settings,
      tokensVisibility: visibility,
    });
  }

  private async saveSettings(state: SettingsState) {
    await this.storageService.save(SETTINGS_STORAGE_KEY, state);
    this.eventEmitter.emit(SettingsEvents.SETTINGS_UPDATED, state);
  }

  addListener(event: SettingsEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }
}
