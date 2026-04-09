import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { SendTransactionData } from '../../types/send';

export class SendPage extends BasePage {
  readonly amountInput: Locator;
  readonly maxButton: Locator;
  readonly recipientSearchInput: Locator;
  readonly recipientTrigger: Locator;
  readonly sendButton: Locator;
  readonly tokenSelectTrigger: Locator;

  constructor(page: Page) {
    super(page);

    this.amountInput = page.locator('[data-testid="send-amount-input"] input');
    this.maxButton = page.locator('[data-testid="amount-preset-max"]');
    this.recipientSearchInput = page.locator(
      '[data-testid="recipient-select-search-input"] input',
    );
    this.recipientTrigger = page.locator(
      '[data-testid="recipient-select-trigger"]',
    );
    this.sendButton = page.locator('[data-testid="tx-submit-button"]');
    this.tokenSelectTrigger = page.locator(
      '[data-testid="token-select-trigger"]',
    );
  }

  /** Token menu search field (wrapper or inner input, depending on K2 SearchInput). */
  private tokenSelectSearchField(): Locator {
    return this.page
      .locator(
        '[data-testid="send-token-amount-token-select-search-input"] input',
      )
      .or(
        this.page.locator(
          '[data-testid="send-token-amount-token-select-search-input"]',
        ),
      );
  }

  /**
   * SearchableSelect only calls setIsOpen when `options.length > 0`. On slow CI, Send can paint
   * before balances load, so the first clicks are no-ops. Retry until the search field appears.
   */
  private async openTokenSelectPopover(): Promise<void> {
    const triggerWaitMs = process.env.CI ? 45_000 : 15_000;
    const perClickWaitMs = process.env.CI ? 3_500 : 2_000;
    const attempts = process.env.CI ? 24 : 10;
    const pauseMs = process.env.CI ? 900 : 450;

    await this.tokenSelectTrigger.waitFor({
      state: 'visible',
      timeout: triggerWaitMs,
    });
    await this.tokenSelectTrigger.scrollIntoViewIfNeeded();

    const search = this.tokenSelectSearchField();

    for (let i = 0; i < attempts; i++) {
      await this.tokenSelectTrigger.click({ force: true });
      try {
        await search.waitFor({ state: 'visible', timeout: perClickWaitMs });
        return;
      } catch {
        // Token list still empty; wait for balances and retry.
      }
      await this.page.waitForTimeout(pauseMs);
    }

    throw new Error(
      '[e2e] Token select did not open after retries (token list may still be empty).',
    );
  }

  // ── Portfolio / navigation ───────────────────────────────────────────

  async navigateToPortfolioHome(): Promise<void> {
    const url = this.page.url();
    const base = url.split('#')[0];
    await this.page.goto(`${base}#/`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Portfolio home → tap Send (toolbar). User must pick token on Send (SND-001 flow).
   */
  async openSendFromPortfolioHome(): Promise<void> {
    await this.navigateToPortfolioHome();
    await this.waitForPortfolioAssetsLoaded();

    const sendNavButton = this.portfolioSendNavButton();
    await sendNavButton.waitFor({ state: 'visible', timeout: 15000 });
    await sendNavButton.click();

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForSendPageReady();
  }

  /**
   * Portfolio → open asset by symbol → Token details → Send — token is prefilled (SND-002 flow).
   */
  async openSendWithTokenFromPortfolio(assetSymbol: string): Promise<void> {
    await this.navigateToPortfolioHome();

    const assetRow = this.page
      .getByRole('button', { name: new RegExp(assetSymbol, 'i') })
      .first();
    await assetRow.waitFor({ state: 'visible', timeout: 20000 });
    await assetRow.click();

    await this.page.waitForURL(/\/asset\/\d+\//, { timeout: 20000 });

    const sendNavButton = this.portfolioSendNavButton();
    await sendNavButton.waitFor({ state: 'visible', timeout: 15000 });
    await sendNavButton.click();

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForSendPageReady();
  }

  /**
   * Portfolio / token-details toolbar Send → navigates to Send flow.
   * CI alpha builds may omit data-testid; role matches production bundles.
   */
  private portfolioSendNavButton(): Locator {
    return this.page
      .locator('[data-testid="send-nav-button"]')
      .or(this.page.getByRole('button', { name: 'Send', exact: true }))
      .first();
  }

  /**
   * Waits for at least one asset card (e.g. AVAX) to appear on the portfolio list.
   * BalancesProvider populates tokensForAccount asynchronously after testnet toggle;
   * navigating to Send before this completes leaves SearchableSelect with zero options.
   */
  private async waitForPortfolioAssetsLoaded(): Promise<void> {
    const timeout = process.env.CI ? 90_000 : 30_000;
    await this.page.waitForFunction(
      () => {
        if (document.querySelector('[class*="CircularProgress"]')) {
          return false;
        }
        const buttons = Array.from(
          document.querySelectorAll('[role="button"]'),
        );
        return buttons.some(
          (btn) =>
            btn.querySelector('svg') &&
            btn.textContent &&
            /avax/i.test(btn.textContent),
        );
      },
      { timeout },
    );
  }

  /**
   * Send route loaded; token row and/or amount field visible (some CI builds omit testids).
   */
  private async waitForSendPageReady(): Promise<void> {
    await this.page.waitForURL(/\/send/, { timeout: 25000 });
    await this.page
      .locator('[data-testid="token-select-trigger"]')
      .or(this.page.getByRole('heading', { name: 'Send', level: 1 }))
      .first()
      .waitFor({ state: 'visible', timeout: 25000 });
  }

  // ── Send form ─────────────────────────────────────────────────────────

  async clickSend(): Promise<void> {
    await this.sendButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.sendButton.click();
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.amountInput.click();
    await this.amountInput.fill(amount);
  }

  async enterRecipientAddress(address: string): Promise<void> {
    await this.recipientTrigger.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.recipientTrigger.click();

    await this.recipientSearchInput.waitFor({
      state: 'visible',
      timeout: 5000,
    });
    await this.recipientSearchInput.fill(address);
    await this.page.waitForTimeout(1000);

    const addressOption = this.page.locator('[data-option-id]').first();
    const hasOption = await addressOption
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (hasOption) {
      await addressOption.click();
    }
  }

  async fillSendForm(data: SendTransactionData): Promise<void> {
    await this.selectToken(data.tokenSymbol);
    await this.enterAmount(data.amount);

    if (data.recipientAccount) {
      await this.selectRecipientAccount(data.recipientAccount);
    } else if (data.recipientAddress) {
      await this.enterRecipientAddress(data.recipientAddress);
    }
  }

  /** Unknown-address row in the open recipient dropdown (scoped — avoids duplicate "Unknown" elsewhere). */
  getUnknownRecipientLabel(): Locator {
    return this.page
      .locator('[data-option-id]')
      .filter({ hasText: 'Unknown' })
      .first();
  }

  async isSendButtonEnabled(): Promise<boolean> {
    await this.sendButton.waitFor({ state: 'visible', timeout: 10000 });
    return !(await this.sendButton.isDisabled());
  }

  async selectRecipientAccount(accountName: string): Promise<void> {
    await this.recipientTrigger.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.recipientTrigger.click();

    await this.recipientSearchInput.waitFor({
      state: 'visible',
      timeout: 5000,
    });
    await this.recipientSearchInput.fill(accountName);
    await this.page.waitForTimeout(1000);

    const accountOption = this.page
      .locator('[data-option-id]')
      .filter({ hasText: accountName })
      .first();
    await accountOption.waitFor({ state: 'visible', timeout: 10000 });
    await accountOption.click();
  }

  /**
   * With recipient dropdown still open, replace search and pick a listed option by contact name.
   */
  async selectRecipientFromOpenDropdownByContactName(
    contactName: string,
  ): Promise<void> {
    await this.recipientSearchInput.fill(contactName);
    await this.page.waitForTimeout(1000);

    const option = this.page
      .locator('[data-option-id]')
      .filter({ hasText: contactName })
      .first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async selectToken(tokenSymbol: string): Promise<void> {
    await this.openTokenSelectPopover();

    const search = this.tokenSelectSearchField();
    await search.fill(tokenSymbol);
    await this.page.waitForTimeout(1000);

    const tokenOption = this.page.locator('[data-option-id]').first();
    await tokenOption.waitFor({ state: 'visible', timeout: 10000 });
    await tokenOption.click();
  }

  /**
   * When several networks share the same symbol (e.g. AVAX on C / P / X), pick the row
   * whose chain badge uses this `alt` text (`network.chainName` on ChainBadge).
   */
  /**
   * When the token list includes non-Avalanche chains, chain filter chips appear.
   * Narrowing to "Avalanche" keeps C / P / X AVAX rows in view for disambiguation.
   */
  private async maybeSelectAvalancheChainFilterChip(): Promise<void> {
    const avalancheOnly = this.page.getByRole('button', {
      name: /^Avalanche$/i,
    });
    if (await avalancheOnly.isVisible({ timeout: 1500 }).catch(() => false)) {
      await avalancheOnly.click();
      await this.page.waitForTimeout(400);
    }
  }

  async selectTokenBySymbolAndChainBadge(
    tokenSymbol: string,
    chainBadgeAltText: string | RegExp,
  ): Promise<void> {
    await this.openTokenSelectPopover();

    await this.maybeSelectAvalancheChainFilterChip();

    const search = this.tokenSelectSearchField();
    await search.fill(tokenSymbol);
    await this.page.waitForTimeout(1200);

    // Wait for the dropdown to populate (first run can be slow while balances load).
    await expect(this.page.locator('[data-option-id]').first()).toBeVisible({
      timeout: 25000,
    });

    const tokenOption = this.page
      .locator('[data-option-id]')
      .filter({ has: this.page.getByAltText(chainBadgeAltText) })
      .first();

    await expect(tokenOption).toBeVisible({ timeout: 30000 });
    await tokenOption.click();
  }

  /**
   * Opens recipient dropdown and types a query (address or name) without selecting.
   */
  async typeRecipientSearchQuery(query: string): Promise<void> {
    await this.recipientTrigger.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.recipientTrigger.click();

    await this.recipientSearchInput.waitFor({
      state: 'visible',
      timeout: 5000,
    });
    await this.recipientSearchInput.fill(query);
    await this.page.waitForTimeout(1000);
  }

  // ── Approval dialog ───────────────────────────────────────────────────

  private get approvalDialog() {
    return this.page.locator('[data-testid="approval-dialog"]');
  }

  /** Use for assertions that must apply to the whole approval surface (e.g. P-Chain rows may omit `tx-detail-*` testids when layout is vertical). */
  getApprovalDialog(): Locator {
    return this.approvalDialog;
  }

  async approveTransaction(): Promise<void> {
    const approveButton = this.approvalDialog.locator(
      '[data-testid="approve-action-button"]',
    );
    await approveButton.waitFor({ state: 'visible', timeout: 10000 });
    await approveButton.click();
  }

  getApprovalBalanceChange() {
    return this.approvalDialog.locator('[data-testid="tx-balance-change"]');
  }

  getApprovalDetailRow(label: string) {
    const testId = `tx-detail-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return this.approvalDialog.locator(`[data-testid="${testId}"]`);
  }

  getApprovalTokenSymbol() {
    return this.approvalDialog.locator('[data-testid="tx-token-symbol"]');
  }

  getApprovalTotalFee() {
    return this.approvalDialog.locator(
      '[data-testid="tx-detail-total-network-fee"]',
    );
  }

  getApproveButton() {
    return this.approvalDialog.locator('[data-testid="approve-action-button"]');
  }

  getGaslessCheckbox() {
    return this.approvalDialog
      .locator('[data-testid="gasless-toggle"]')
      .locator('input');
  }

  getRejectButton() {
    return this.approvalDialog.locator('[data-testid="reject-action-button"]');
  }

  async isGaslessToggleVisible(): Promise<boolean> {
    const gaslessToggle = this.approvalDialog.locator(
      '[data-testid="gasless-toggle"]',
    );
    return gaslessToggle.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async rejectTransaction(): Promise<void> {
    const rejectButton = this.approvalDialog.locator(
      '[data-testid="reject-action-button"]',
    );
    await rejectButton.waitFor({ state: 'visible', timeout: 10000 });
    await rejectButton.click();
  }

  async toggleGaslessOff(): Promise<void> {
    const gaslessToggle = this.approvalDialog.locator(
      '[data-testid="gasless-toggle"]',
    );

    const isVisible = await gaslessToggle
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!isVisible) {
      return;
    }

    const toggleInput = gaslessToggle.locator('input');
    const isChecked = await toggleInput.isChecked();
    if (isChecked) {
      await gaslessToggle.click();
      await this.page.waitForTimeout(500);
    }
  }

  async toggleGaslessOn(): Promise<void> {
    const gaslessToggle = this.approvalDialog.locator(
      '[data-testid="gasless-toggle"]',
    );

    const isVisible = await gaslessToggle
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!isVisible) {
      return;
    }

    const toggleInput = gaslessToggle.locator('input');
    const isChecked = await toggleInput.isChecked();
    if (!isChecked) {
      await gaslessToggle.click();
      await this.page.waitForTimeout(500);
    }
  }

  async waitForApprovalDialogClose(timeout = 60000): Promise<void> {
    await this.approvalDialog.waitFor({ state: 'hidden', timeout });
  }

  async waitForApprovalScreen(): Promise<void> {
    await this.approvalDialog.waitFor({ state: 'visible', timeout: 30000 });
    const approveButton = this.approvalDialog.locator(
      '[data-testid="approve-action-button"]',
    );
    await approveButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ── Fee presets ──────────────────────────────────────────────────────

  async clickFeePreset(
    preset: 'slow' | 'normal' | 'fast' | 'custom',
  ): Promise<void> {
    const button = this.getFeePresetButton(preset);
    await button.waitFor({ state: 'visible', timeout: 5000 });
    await button.click();
  }

  getFeePresetButton(preset: 'slow' | 'normal' | 'fast' | 'custom') {
    return this.approvalDialog.locator(`[data-testid="fee-preset-${preset}"]`);
  }

  getFeePresetSelector() {
    return this.approvalDialog.locator('[data-testid="fee-preset-selector"]');
  }

  /**
   * Checks if a fee preset button is the currently active/selected one.
   * Active buttons have MUI color="primary" → class contains "colorPrimary".
   */
  async isFeePresetActive(
    preset: 'slow' | 'normal' | 'fast' | 'custom',
  ): Promise<boolean> {
    const button = this.getFeePresetButton(preset);
    const classes = (await button.getAttribute('class')) ?? '';
    return classes.includes('colorPrimary');
  }

  // ── Custom gas (Edit network fee) ─────────────────────────────────────

  private get customGasSettings() {
    return this.page.locator('[data-testid="custom-gas-settings"]');
  }

  async cancelCustomFee(): Promise<void> {
    const cancelBtn = this.getCustomFeeCancelButton();
    await cancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    await cancelBtn.click();
    await this.customGasSettings.waitFor({
      state: 'hidden',
      timeout: 10000,
    });
  }

  /**
   * Clears and fills a custom fee input field.
   * Uses triple-click to select all, then types the new value.
   */
  async fillCustomFeeInput(locator: Locator, value: string): Promise<void> {
    await locator.click({ clickCount: 3 });
    await locator.fill(value);
    await this.page.waitForTimeout(300);
  }

  getCustomFeeCancelButton() {
    return this.page.locator('[data-testid="custom-fee-cancel"]');
  }

  getCustomFeeError() {
    return this.page.locator('[data-testid="custom-fee-error"]');
  }

  getCustomFeeGasLimitInput() {
    return this.page.locator('[data-testid="custom-fee-gas-limit"]');
  }

  getCustomFeeMaxBaseInput() {
    return this.page.locator('[data-testid="custom-fee-max-base"]');
  }

  getCustomFeeMaxPriorityInput() {
    return this.page.locator('[data-testid="custom-fee-max-priority"]');
  }

  getCustomFeeSaveButton() {
    return this.page.locator('[data-testid="custom-fee-save"]');
  }

  getCustomFeeTotalRow() {
    return this.customGasSettings.locator(
      '[data-testid="tx-detail-total-network-fee"]',
    );
  }

  async saveCustomFee(): Promise<void> {
    const saveBtn = this.getCustomFeeSaveButton();
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await this.customGasSettings.waitFor({
      state: 'hidden',
      timeout: 10000,
    });
  }

  async waitForCustomFeeScreen(): Promise<void> {
    await this.customGasSettings.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  // ── Toast (Sonner) ────────────────────────────────────────────────────

  getPendingToast() {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Transaction pending' });
  }

  getSuccessToast() {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Transaction successful' });
  }

  getToastExplorerLink() {
    return this.getSuccessToast().locator(
      '[data-testid="tx-toast-explorer-link"]',
    );
  }

  /**
   * Reads the transaction hash directly from the data-tx-hash attribute
   * on the explorer link button inside the success toast.
   */
  async getTxHashFromToast(): Promise<string> {
    const explorerLink = this.getToastExplorerLink();
    await explorerLink.waitFor({ state: 'visible', timeout: 10000 });
    const hash = await explorerLink.getAttribute('data-tx-hash');

    if (!hash) {
      throw new Error('Could not read data-tx-hash from explorer link');
    }

    return hash;
  }

  async waitForPendingToast(timeout = 30000): Promise<Locator> {
    const toast = this.getPendingToast();
    await toast.waitFor({ state: 'visible', timeout });
    return toast;
  }

  async waitForSuccessToast(timeout = 30000): Promise<Locator> {
    const toast = this.getSuccessToast();
    await toast.waitFor({ state: 'visible', timeout });
    return toast;
  }
}
