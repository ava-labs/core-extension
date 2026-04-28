import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SWAP_TIMEOUTS } from '../../types/swap';

export class SwapPage extends BasePage {
  readonly fromSection: Locator;
  readonly toSection: Locator;
  readonly fromAmountInput: Locator;
  readonly toAmountInput: Locator;
  readonly swapButton: Locator;

  constructor(page: Page) {
    super(page);

    this.fromSection = page.locator('#swap-from-amount');
    this.toSection = page.locator('#swap-to-amount');
    this.fromAmountInput = this.fromSection.locator(
      '[data-testid="send-amount-input"] input',
    );
    this.toAmountInput = this.toSection.locator(
      '[data-testid="send-amount-input"] input',
    );
    this.swapButton = page.getByRole('button', { name: 'Swap', exact: true });
  }

  // ── Navigation ──────────────────────────────────────────────────────

  async navigateToSwapPage(): Promise<void> {
    const base = this.page.url().split('#')[0];
    await this.page.goto(`${base}#/fusion`, {
      waitUntil: 'domcontentloaded',
    });
    await this.page.waitForTimeout(2000);
  }

  async navigateToSwap(opts: {
    from: { symbol: string; id: string };
    to: { symbol: string; id: string };
  }): Promise<void> {
    await this.navigateToSwapPage();
    await this.fromSection.waitFor({ state: 'visible', timeout: 30_000 });
    await this.selectFromToken(opts.from.symbol, opts.from.id);
    await this.selectToToken(opts.to.symbol, opts.to.id);
  }

  // ── Token selection via dropdown ────────────────────────────────────

  async selectFromToken(symbol: string, tokenId: string): Promise<void> {
    await this.selectToken(this.fromSection, symbol, tokenId);
  }

  async selectToToken(symbol: string, tokenId: string): Promise<void> {
    await this.selectToken(this.toSection, symbol, tokenId);
  }

  private async selectToken(
    section: Locator,
    symbol: string,
    tokenId: string,
  ): Promise<void> {
    const trigger = section.getByTestId('token-select-trigger');
    await trigger.waitFor({ state: 'visible', timeout: 10_000 });

    const searchInput = this.page.locator('[role="presentation"] input');

    await expect
      .poll(
        async () => {
          if (await searchInput.isVisible().catch(() => false)) return true;
          await trigger.click().catch(() => {});
          await this.page.waitForTimeout(500);
          return searchInput.isVisible().catch(() => false);
        },
        { timeout: 15_000, intervals: [1000] },
      )
      .toBe(true);

    await searchInput.fill(symbol);
    await this.page.waitForTimeout(1000);

    const option = this.page.locator(`[data-option-id="${tokenId}"]`);
    await option.waitFor({ state: 'visible', timeout: 5_000 });
    await option.click();
    await this.page.waitForTimeout(1000);
  }

  async waitForTokensLoaded(timeout = 30_000): Promise<void> {
    await this.fromSection.waitFor({ state: 'visible', timeout });
  }

  // ── Swap interaction ────────────────────────────────────────────────

  async enterFromAmount(amount: string): Promise<void> {
    await this.fromAmountInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.fromAmountInput.click();
    await this.fromAmountInput.fill(amount);
  }

  async waitForQuote(timeout = SWAP_TIMEOUTS.QUOTE): Promise<void> {
    await expect
      .poll(
        async () => {
          const val = await this.toAmountInput.inputValue().catch(() => '');
          return val !== '' && val !== '0' && val !== '0.00';
        },
        { timeout },
      )
      .toBe(true);
  }

  async isSwapButtonEnabled(): Promise<boolean> {
    return this.swapButton.isEnabled().catch(() => false);
  }

  async clickSwap(): Promise<void> {
    await this.swapButton.click();
  }

  // ── Approval flow ───────────────────────────────────────────────────

  private get homeIndicator(): Locator {
    return this.page.getByRole('tab', { name: 'Assets' });
  }

  private get errorAlert(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: /failed|error|rejected/i });
  }

  private get approveButton(): Locator {
    return this.page.getByTestId('approve-action-button');
  }

  private async raceOutcome(
    timeout: number,
  ): Promise<'overlay' | 'home' | 'error'> {
    return Promise.race([
      this.approveButton
        .waitFor({ state: 'visible', timeout })
        .then(() => 'overlay' as const),
      this.homeIndicator
        .waitFor({ state: 'visible', timeout })
        .then(() => 'home' as const),
      this.errorAlert
        .waitFor({ state: 'visible', timeout })
        .then(() => 'error' as const),
    ]);
  }

  async handleApprovalFlow(
    timeout = SWAP_TIMEOUTS.APPROVAL,
  ): Promise<'home' | 'error' | 'approved'> {
    const first = await this.raceOutcome(timeout);
    if (first !== 'overlay') return first;

    await this.approveButton.click();
    await this.page.waitForTimeout(2000);

    const second = await this.raceOutcome(30_000);

    if (second === 'overlay') {
      await this.approveButton.click();
      return Promise.race([
        this.homeIndicator
          .waitFor({ state: 'visible', timeout: 30_000 })
          .then(() => 'home' as const),
        this.errorAlert
          .waitFor({ state: 'visible', timeout: 30_000 })
          .then(() => 'error' as const),
      ]);
    }

    return second;
  }

  async waitForHomeNavigation(
    timeout = SWAP_TIMEOUTS.TRANSACTION,
  ): Promise<void> {
    await this.homeIndicator.waitFor({ state: 'visible', timeout });
  }

  // ── Toast (Sonner) — transaction status notifications ──────────────

  getPendingToast(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Transaction pending' });
  }

  getSuccessToast(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Transaction successful' });
  }

  getErrorToast(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: /failed|error/i });
  }

  async waitForPendingToast(timeout = 30_000): Promise<Locator> {
    const toast = this.getPendingToast();
    await toast.waitFor({ state: 'visible', timeout });
    return toast;
  }

  async waitForSuccessToast(timeout = 60_000): Promise<Locator> {
    const toast = this.getSuccessToast();
    await toast.waitFor({ state: 'visible', timeout });
    return toast;
  }

  // ── Approval overlay helpers (used by mock approval tests) ──────────

  async waitForApprovalOverlay(
    timeout = SWAP_TIMEOUTS.APPROVAL,
  ): Promise<boolean> {
    return this.approveButton
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async clickRejectButton(): Promise<void> {
    await this.page.getByTestId('reject-action-button').click();
  }

  async isApproveButtonVisible(): Promise<boolean> {
    return this.approveButton.isVisible().catch(() => false);
  }

  async getTxHashFromToast(): Promise<string> {
    const explorerLink = this.getSuccessToast().locator(
      '[data-testid="show-in-explorer-button"]',
    );
    await explorerLink.waitFor({ state: 'visible', timeout: 10_000 });
    const hash = await explorerLink.getAttribute('data-tx-hash');

    if (!hash) {
      throw new Error('Could not read data-tx-hash from explorer link');
    }

    return hash;
  }

  // ── Token name helpers ──────────────────────────────────────────────

  async getSourceTokenName(): Promise<string> {
    return (await this.fromSection.locator('h6').first().textContent()) ?? '';
  }

  async getDestTokenName(): Promise<string> {
    return (await this.toSection.locator('h6').first().textContent()) ?? '';
  }
}
