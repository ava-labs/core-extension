/**
 * Manage Tokens page - the token management list reached from the Portfolio
 * Assets tab ("Manage"), plus the Add Custom Token sub-page.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ManageTokensPage extends BasePage {
  // Portfolio entry point
  readonly portfolioManageButton: Locator;

  // Manage Tokens list
  readonly pageRoot: Locator;
  readonly searchInput: Locator;
  readonly hideSpamSwitch: Locator;
  readonly hideNoBalanceSwitch: Locator;
  readonly addCustomButton: Locator;
  readonly tokenRows: Locator;
  readonly toggleableRows: Locator;
  readonly scamIndicators: Locator;
  readonly noResults: Locator;

  // Add Custom Token sub-page
  readonly addressInput: Locator;
  readonly addSubmitButton: Locator;
  readonly addError: Locator;

  constructor(page: Page) {
    super(page);

    this.portfolioManageButton = page.locator(
      '[data-testid="portfolio-manage-tokens-button"]',
    );

    this.pageRoot = page.locator('[data-testid="manage-tokens-page"]');
    this.searchInput = page.locator(
      '[data-testid="manage-tokens-search-input"] input',
    );
    this.hideSpamSwitch = page.locator(
      '[data-testid="manage-tokens-hide-spam-switch"] input',
    );
    this.hideNoBalanceSwitch = page.locator(
      '[data-testid="manage-tokens-hide-no-balance-switch"] input',
    );
    this.addCustomButton = page.locator(
      '[data-testid="manage-tokens-add-custom-button"]',
    );
    this.tokenRows = page.locator('[data-testid="manage-tokens-item"]');
    this.toggleableRows = this.tokenRows.filter({
      has: page.locator('[data-testid="manage-tokens-item-switch"]'),
    });
    this.scamIndicators = page.locator(
      '[data-testid="manage-tokens-scam-indicator"]',
    );
    this.noResults = page.getByText('No results found');

    this.addressInput = page.locator(
      '[data-testid="add-custom-token-address-input"] textarea:not([aria-hidden="true"])',
    );
    this.addSubmitButton = page.locator(
      '[data-testid="add-custom-token-submit-button"]',
    );
    this.addError = page.locator('[data-testid="add-custom-token-error"]');
  }

  async openFromPortfolio(): Promise<void> {
    await this.portfolioManageButton.waitFor({
      state: 'visible',
      timeout: 60_000,
    });
    await this.portfolioManageButton.click();
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.pageRoot.waitFor({ state: 'visible', timeout: 30_000 });
    await this.page.waitForURL(/#\/manage-tokens(\?|$)/, { timeout: 10_000 });
  }

  async waitForListLoaded(timeout = 60_000): Promise<void> {
    await this.tokenRows.first().waitFor({ state: 'visible', timeout });
  }

  async rowCount(): Promise<number> {
    return this.tokenRows.count();
  }

  rowBySymbol(symbol: string): Locator {
    return this.page.locator(
      `[data-testid="manage-tokens-item"][data-token-symbol="${symbol}"]`,
    );
  }

  rowByName(name: string): Locator {
    return this.page.locator(
      `[data-testid="manage-tokens-item"][data-token-name="${name}"]`,
    );
  }

  private async readRowAttributes(
    attr: string,
    rows: Locator = this.tokenRows,
  ): Promise<string[]> {
    return rows.evaluateAll(
      (els, attribute) => els.map((el) => el.getAttribute(attribute) ?? ''),
      attr,
    );
  }

  async visibleRowSymbols(): Promise<string[]> {
    return this.readRowAttributes('data-token-symbol');
  }

  async visibleRowNames(): Promise<string[]> {
    return this.readRowAttributes('data-token-name');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.searchInput.fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
  }

  /**
   * Returns the symbol and name of the first list row that owns an enable/
   * disable switch (ERC-20/SPL). Native tokens have no switch, so this skips
   * them and yields a token that is both held and present in the Portfolio.
   */
  async firstToggleableToken(): Promise<{ symbol: string; name: string }> {
    const row = this.toggleableRows.first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    const symbol = (await row.getAttribute('data-token-symbol')) ?? '';
    const name = (await row.getAttribute('data-token-name')) ?? '';
    return { symbol, name };
  }

  private rowSwitch(symbol: string): Locator {
    return this.rowBySymbol(symbol)
      .first()
      .locator('[data-testid="manage-tokens-item-switch"]');
  }

  async isTokenEnabled(symbol: string): Promise<boolean> {
    return this.rowSwitch(symbol).locator('input').isChecked();
  }

  async setTokenEnabled(symbol: string, enabled: boolean): Promise<void> {
    await this.waitForListLoaded();
    await this.search(symbol);
    const row = this.rowBySymbol(symbol).first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });

    const input = this.rowSwitch(symbol).locator('input');
    if ((await input.isChecked()) === enabled) {
      return;
    }
    await this.rowSwitch(symbol).click();
    await expect(input).toBeChecked({ checked: enabled, timeout: 10_000 });
  }

  // ── Hide-spam / hide-no-balance switches ──────────────────────────────

  async setHideSpam(hidden: boolean): Promise<void> {
    await this.setSwitch(this.hideSpamSwitch, hidden);
  }

  async setHideNoBalance(hidden: boolean): Promise<void> {
    await this.setSwitch(this.hideNoBalanceSwitch, hidden);
  }

  private async setSwitch(input: Locator, checked: boolean): Promise<void> {
    await input.waitFor({ state: 'attached', timeout: 15_000 });
    if ((await input.isChecked()) === checked) {
      return;
    }
    await input.click();
    await expect(input).toBeChecked({ checked, timeout: 10_000 });
  }

  async scamIndicatorCount(): Promise<number> {
    return this.scamIndicators.count();
  }

  // ── Add Custom Token sub-page ─────────────────────────────────────────

  async openAddCustom(): Promise<void> {
    await this.addCustomButton.click();
    await this.page.waitForURL(/#\/manage-tokens\/add-custom/, {
      timeout: 10_000,
    });
    await this.addressInput.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async enterCustomTokenAddress(address: string): Promise<void> {
    await this.addressInput.fill(address);
  }

  /**
   * Submits the custom-token form. The Add button stays disabled while the
   * contract metadata is validated on-chain, so we wait for it to enable
   * (a resolvable token) before clicking.
   */
  async submitCustomToken(): Promise<void> {
    await expect(this.addSubmitButton).toBeEnabled({ timeout: 30_000 });
    await this.addSubmitButton.click();
  }

  successToast(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Token Added' });
  }
}
