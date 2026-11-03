/**
 * Settings Page - app settings home and the observable effects its controls
 * have on the Portfolio (testnet indicator, masked balances, currency code,
 * header avatar). Settings itself has no app header, so avatar/balance reads
 * happen after navigating back to the Portfolio.
 */
import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './BasePage';

type ColorTheme = 'LIGHT' | 'DARK' | 'SYSTEM';

const THEME_LABELS: Record<ColorTheme, string> = {
  LIGHT: 'Light',
  DARK: 'Dark',
  SYSTEM: 'System',
};

export class SettingsPage extends BasePage {
  readonly settingsButton: Locator;
  readonly settingsPage: Locator;
  readonly pageTitle: Locator;
  readonly backButton: Locator;

  readonly testnetSwitch: Locator;
  readonly privacySwitch: Locator;
  readonly analyticsToggle: Locator;
  readonly showHighlightsToggle: Locator;

  readonly currencySelector: Locator;
  readonly themeSelector: Locator;
  readonly languageSelector: Locator;

  readonly avatarButton: Locator;
  readonly avatarOptions: Locator;
  readonly headerAvatarImage: Locator;

  readonly footerTermsLink: Locator;
  readonly footerPrivacyLink: Locator;

  readonly portfolioTotalBalance: Locator;
  readonly portfolioBalanceCurrency: Locator;
  readonly portfolioTestnetIndicator: Locator;

  constructor(page: Page) {
    super(page);

    this.settingsButton = page.getByTestId('settings-button');
    this.settingsPage = page.getByTestId('settings-page');
    this.pageTitle = page.getByRole('heading', { level: 1 });
    this.backButton = page.getByTestId('page-back-button');

    this.testnetSwitch = page.getByTestId('settings-testnet-switch');
    this.privacySwitch = page.getByTestId('settings-privacy-switch');
    this.analyticsToggle = page.getByTestId('settings-analytics-toggle');
    this.showHighlightsToggle = page.getByTestId(
      'settings-show-highlights-toggle',
    );

    this.currencySelector = page.getByTestId('settings-currency-selector');
    this.themeSelector = page.getByTestId('settings-theme-selector');
    this.languageSelector = page.getByTestId('settings-language-selector');

    this.avatarButton = page.getByTestId('settings-avatar-button');
    this.avatarOptions = page.getByTestId('avatar-option');
    this.headerAvatarImage = page.getByTestId('header-avatar').locator('img');

    this.footerTermsLink = page.getByTestId('footer-terms-link');
    this.footerPrivacyLink = page.getByTestId('footer-privacy-link');

    this.portfolioTotalBalance = page.getByTestId('portfolio-total-balance');
    this.portfolioBalanceCurrency = page.getByTestId(
      'portfolio-balance-currency',
    );
    this.portfolioTestnetIndicator = page.getByTestId(
      'portfolio-testnet-indicator',
    );
  }

  async open(): Promise<void> {
    await this.settingsButton.click();
    await this.page.waitForURL(/#\/settings/, { timeout: 10_000 });
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.settingsPage.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async goBackToPortfolio(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForURL(/#\/(\?|$)/, { timeout: 10_000 });
  }

  async isHighlightsEnabled(): Promise<boolean> {
    return this.isSwitchOn(this.showHighlightsToggle);
  }

  async setHighlights(enabled: boolean): Promise<void> {
    await this.setSwitch(this.showHighlightsToggle, enabled);
  }

  // ── Switches ─────────────────────────────────────────────────────────

  private switchInput(switchLocator: Locator): Locator {
    return switchLocator.locator('input[type="checkbox"]');
  }

  async isSwitchOn(switchLocator: Locator): Promise<boolean> {
    return this.switchInput(switchLocator).isChecked();
  }

  async setSwitch(switchLocator: Locator, desired: boolean): Promise<void> {
    if ((await this.isSwitchOn(switchLocator)) !== desired) {
      await switchLocator.click();
      await expect
        .poll(() => this.isSwitchOn(switchLocator), { timeout: 15_000 })
        .toBe(desired);
    }
  }

  // ── Currency ─────────────────────────────────────────────────────────

  async getSelectedCurrency(): Promise<string> {
    return (await this.currencySelector.innerText()).trim();
  }

  async selectCurrency(label: string): Promise<void> {
    await this.currencySelector.click();
    const option = this.page
      .locator('.MuiPopover-root li')
      .filter({ hasText: label });
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.getByRole('button').click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  // ── Theme ────────────────────────────────────────────────────────────

  async selectTheme(theme: ColorTheme): Promise<void> {
    await this.themeSelector.click();
    const option = this.page
      .locator('.MuiPopover-root li')
      .filter({ hasText: THEME_LABELS[theme] });
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.getByRole('button').click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  /** Relative luminance (0..1) of the Settings page background. */
  async settingsBackgroundLuminance(): Promise<number> {
    return this.settingsPage.evaluate((el) => {
      const channels = getComputedStyle(el)
        .backgroundColor.match(/[\d.]+/g)
        ?.map(Number);
      if (!channels || channels.length < 3) {
        return -1;
      }
      const [r, g, b] = channels;
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    });
  }

  // ── Language (gated behind the LANGUAGES feature flag) ────────────────

  /**
   * Forces the LANGUAGES flag via the unencrypted storage override the service
   * worker merges on top of fetched flags. Requires POSTHOG_KEY so the flag
   * fetch cycle runs; returns whether the selector showed up.
   */
  async enableLanguagesFlag(timeoutMs = 45_000): Promise<boolean> {
    try {
      await this.page.evaluate(() => {
        return new Promise<void>((resolve) => {
          chrome.storage.local.set(
            { '__feature-flag-overrides__': { data: { languages: true } } },
            () => resolve(),
          );
        });
      });
    } catch {
      return false;
    }

    return this.languageSelector
      .waitFor({ state: 'visible', timeout: timeoutMs })
      .then(() => true)
      .catch(() => false);
  }

  /** Selects a language by its locale-independent originalName (e.g. "Deutsch"). */
  async selectLanguage(originalName: string): Promise<void> {
    await this.languageSelector.click();
    const option = this.page
      .locator('.MuiPopover-root li')
      .filter({ hasText: `(${originalName})` });
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.getByRole('button').click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  async pageTitleText(): Promise<string> {
    return (await this.pageTitle.innerText()).trim();
  }

  // ── Avatar ───────────────────────────────────────────────────────────

  /**
   * The header renders the avatar in two sibling blocks toggled via CSS
   * (avatar-only vs account-info), so the tagged one may be display:none. Both
   * carry the same selected-avatar src, so read the attribute without requiring
   * visibility.
   */
  async getHeaderAvatarSrc(): Promise<string> {
    await this.headerAvatarImage.waitFor({
      state: 'attached',
      timeout: 15_000,
    });
    return (await this.headerAvatarImage.getAttribute('src')) ?? '';
  }

  async openAvatarSelector(): Promise<void> {
    await this.avatarButton.click();
    await this.page.waitForURL(/#\/settings\/avatar/, { timeout: 10_000 });
    await this.avatarOptions.first().waitFor({
      state: 'visible',
      timeout: 10_000,
    });
  }

  async selectDifferentAvatar(): Promise<void> {
    const option = this.page
      .locator('[data-testid="avatar-option"][aria-selected="false"]')
      .first();
    await option.click();
    await this.page.waitForURL(/#\/settings(\?|$)/, { timeout: 10_000 });
  }

  // ── Footer legal links ───────────────────────────────────────────────

  async clickLinkExpectNewTab(
    link: Locator,
    context: BrowserContext,
  ): Promise<Page> {
    await link.scrollIntoViewIfNeeded();
    const pagePromise = context.waitForEvent('page', { timeout: 15_000 });
    await link.click();
    return pagePromise;
  }

  // ── Portfolio-side observable readers ────────────────────────────────

  async isBalanceMasked(): Promise<boolean> {
    const text = await this.portfolioTotalBalance.innerText();
    return text.includes('•');
  }

  async getBalanceCurrency(): Promise<string> {
    return (await this.portfolioBalanceCurrency.innerText()).trim();
  }
}
