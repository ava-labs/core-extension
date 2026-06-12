/**
 * Trending Tokens Page - reached from the Portfolio "… are trending today"
 * banner. Lists trending tokens per network (Avalanche / Solana) with a
 * 24-hour % change and a hover-revealed Buy action that routes to Swap.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TrendingTokensPage extends BasePage {
  readonly title: Locator;
  readonly avalancheTab: Locator;
  readonly solanaTab: Locator;
  readonly tokenRows: Locator;

  constructor(page: Page) {
    super(page);

    this.title = page.getByText('Trending tokens', { exact: false }).first();
    this.avalancheTab = page.locator(
      '[data-testid="trending-network-avalanche"]',
    );
    this.solanaTab = page.locator('[data-testid="trending-network-solana"]');
    this.tokenRows = page.locator('[data-testid="trending-token-row"]');
  }

  /**
   * Waits for the page to render at least one trending token row. Data is
   * fetched live from the backend, so allow a generous timeout.
   */
  async waitForLoaded(timeout = 60_000): Promise<void> {
    await this.tokenRows.first().waitFor({ state: 'visible', timeout });
  }

  async rowCount(): Promise<number> {
    return this.tokenRows.count();
  }

  async hasSolanaTab(): Promise<boolean> {
    return (await this.solanaTab.count()) > 0;
  }

  async selectAvalanche(): Promise<void> {
    await this.avalancheTab.click();
    await this.waitForLoaded();
  }

  async selectSolana(): Promise<void> {
    await this.solanaTab.click();
    await this.waitForLoaded();
  }

  private row(index: number): Locator {
    return this.tokenRows.nth(index);
  }

  /**
   * Each row shows the 24-hour % change (with up/down icon) when not hovered.
   */
  async expectRowHasPercent(index: number): Promise<void> {
    const percent = this.row(index).locator(
      '[data-testid="trending-token-percent"]',
    );
    await expect(percent).toBeVisible();
  }

  /**
   * The Buy button is only revealed on row hover; verify it appears.
   */
  async expectBuyRevealedOnHover(index: number): Promise<void> {
    const row = this.row(index);
    await row.hover();
    const buy = row.locator('[data-testid="trending-token-buy-button"]');
    await expect(buy).toBeVisible();
  }

  /**
   * Hovers a row, clicks its Buy button, and waits for the Swap (Fusion) route.
   */
  async buyFromRow(index: number): Promise<void> {
    const row = this.row(index);
    await row.hover();
    const buy = row.locator('[data-testid="trending-token-buy-button"]');
    await buy.waitFor({ state: 'visible', timeout: 5_000 });
    await buy.click();
    await this.page.waitForURL(/#\/fusion/, { timeout: 10_000 });
  }
}
