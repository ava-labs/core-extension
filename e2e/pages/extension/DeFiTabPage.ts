/**
 * DeFi tab - lists the wallet's DeFi protocol positions with a Filter dropdown
 * (by position category) and a Sort dropdown. Clicking a protocol opens its
 * details page (position breakdown grouped by type + a "See details" link to
 * the dApp). DeFi data is live, so loads resolve by polling for a terminal
 * state and assertions avoid exact USD values.
 */
import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeFiTabPage extends BasePage {
  readonly navTab: Locator;
  readonly tab: Locator;
  readonly protocolRows: Locator;
  readonly zeroState: Locator;
  readonly filterTrigger: Locator;
  readonly sortTrigger: Locator;
  readonly detailsHeader: Locator;
  readonly seeDetailsButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.navTab = page
      .getByRole('tab', { name: 'DeFi' })
      .or(page.getByText('DeFi', { exact: true }));
    this.tab = page.locator('[data-testid="defi-tab"]');
    this.protocolRows = page.locator('[data-testid="defi-protocol-row"]');
    this.zeroState = page.getByText('No DeFi positions found');
    this.filterTrigger = this.tab.locator('#filter-menu').getByRole('button');
    this.sortTrigger = this.tab.locator('#sort-menu').getByRole('button');
    this.detailsHeader = page.locator('[data-testid="defi-details-header"]');
    this.seeDetailsButton = page.locator('[data-testid="defi-see-details"]');
    this.backButton = page.locator('[data-testid="page-back-button"]');
  }

  /** Switches to the DeFi tab (balances may still be loading → allow time). */
  async openTab(timeout = 60_000): Promise<void> {
    await this.navTab.first().waitFor({ state: 'visible', timeout });
    await this.navTab.first().click();
    await this.tab.waitFor({ state: 'visible', timeout });
  }

  /** Waits for protocols to render or the zero state to appear. */
  async waitForLoaded(timeout = 60_000): Promise<void> {
    await expect
      .poll(
        async () =>
          (await this.protocolRows.count()) > 0 ||
          (await this.zeroState.count()) > 0,
        { timeout, intervals: [500, 1000, 2000] },
      )
      .toBe(true);
  }

  async open(timeout = 60_000): Promise<void> {
    await this.openTab(timeout);
    await this.waitForLoaded(timeout);
  }

  async rowCount(): Promise<number> {
    return this.protocolRows.count();
  }

  async isZeroState(): Promise<boolean> {
    return (await this.zeroState.count()) > 0;
  }

  private readRowAttr(attr: string): Promise<string[]> {
    return this.protocolRows.evaluateAll(
      (els, a) => els.map((el) => el.getAttribute(a) ?? ''),
      attr,
    );
  }

  getNames(): Promise<string[]> {
    return this.readRowAttr('data-defi-name');
  }
  getNetworks(): Promise<string[]> {
    return this.readRowAttr('data-defi-network');
  }
  async getAmounts(): Promise<number[]> {
    return (await this.readRowAttr('data-defi-amount')).map(Number);
  }
  /** Per-row category lists (from each protocol's item names). */
  async getCategoriesPerRow(): Promise<string[][]> {
    return (await this.readRowAttr('data-defi-categories')).map((c) =>
      c ? c.split('|') : [],
    );
  }

  // ── Sort ─────────────────────────────────────────────────────────────

  async selectSort(
    value:
      | 'name-asc'
      | 'name-desc'
      | 'protocol-asc'
      | 'network-asc'
      | 'amount-desc',
  ): Promise<void> {
    await this.sortTrigger.click();
    const option = this.page.locator(
      `[data-testid="defi-sort-option-${value}"]`,
    );
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
    await this.waitForLoaded();
  }

  // ── Filter ───────────────────────────────────────────────────────────

  filterOption(category: string): Locator {
    return this.page.locator(`[data-testid="defi-filter-option-${category}"]`);
  }

  async selectFilter(category: string): Promise<void> {
    await this.filterTrigger.click();
    const option = this.filterOption(category);
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
    await this.waitForLoaded();
  }

  // ── Details ──────────────────────────────────────────────────────────

  rowByNameAndCategory(name: string, category: string): Locator {
    return this.page.locator(
      `[data-testid="defi-protocol-row"][data-defi-name="${name}"][data-defi-categories*="${category}"]`,
    );
  }

  async openFirstProtocolDetails(): Promise<void> {
    await this.protocolRows.first().click();
    await this.detailsHeader.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async openProtocolDetails(row: Locator): Promise<void> {
    await row.first().click();
    await this.detailsHeader.waitFor({ state: 'visible', timeout: 15_000 });
  }

  /** Clicks "See details" and returns the dApp's intended URL + opened tab. */
  async clickSeeDetails(
    context: BrowserContext,
  ): Promise<{ siteUrl: string | null; tab: Page }> {
    const siteUrl = await this.seeDetailsButton.getAttribute('data-site-url');
    const pagePromise = context.waitForEvent('page', { timeout: 15_000 });
    await this.seeDetailsButton.click();
    const tab = await pagePromise;
    await tab.waitForLoadState('domcontentloaded').catch(() => {});
    return { siteUrl, tab };
  }
}
