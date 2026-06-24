/**
 * Activity tab - transaction history with a Filter dropdown, a network
 * selector, per-row "View in Explorer" links, and an empty state.
 *
 * Activity history is fetched live and can be slow, so normal loads resolve via
 * a poll for a terminal state (spinner gone AND rows or empty state shown) with
 * a generous ceiling.
 *
 * Note: when retrying through upstream (429) rate limits,
 * selectNetworkExpectingActivity() uses a bounded cooldown delay between
 * attempts to avoid hammering the history endpoint.
 */
import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './BasePage';

const ACTIVITY_LOAD_TIMEOUT = 90_000;

export class ActivityTabPage extends BasePage {
  readonly activityNavTab: Locator;
  readonly tab: Locator;
  readonly loading: Locator;
  readonly emptyState: Locator;
  readonly rows: Locator;
  readonly explorerLinks: Locator;
  readonly filterTrigger: Locator;
  readonly networkTrigger: Locator;
  readonly networkSearch: Locator;

  constructor(page: Page) {
    super(page);

    this.activityNavTab = page
      .getByRole('tab', { name: 'Activity' })
      .or(page.getByText('Activity', { exact: true }));
    this.tab = page.locator('[data-testid="activity-tab"]');
    this.loading = page.locator('[data-testid="activity-loading"]');
    this.emptyState = page.locator('[data-testid="activity-empty-state"]');
    this.rows = page.locator('[data-testid="activity-row"]');
    this.explorerLinks = page.locator('[data-testid="explorer-link"]');
    this.filterTrigger = page
      .locator('[data-testid="activity-filter-trigger"]')
      .getByRole('button');
    this.networkTrigger = page.locator(
      '[data-testid="network-filter-selector-trigger"]',
    );
    this.networkSearch = page.locator(
      '[data-testid="network-filter-selector-search-input"] input',
    );
  }

  /**
   * Switches to the Activity tab and waits for the first load to settle.
   *
   * The Activity tab is only rendered once the funded portfolio has loaded
   * (balances resolved → the account is no longer treated as empty). During the
   * initial balance fetch the wallet can momentarily show the empty state with
   * no Activity tab, so we wait for the tab to actually be present before
   * clicking rather than racing the portfolio load.
   */
  async open(timeout = 60_000): Promise<void> {
    await this.activityNavTab.first().waitFor({ state: 'visible', timeout });
    await this.activityNavTab.first().click();
    await this.tab.waitFor({ state: 'visible', timeout: 15_000 });
    await this.waitForLoaded();
  }

  /**
   * Resolves once the activity view reaches a terminal state: the loading
   * spinner is gone AND either transaction rows or the empty state are shown.
   */
  async waitForLoaded(timeout = ACTIVITY_LOAD_TIMEOUT): Promise<void> {
    await expect
      .poll(
        async () => {
          const loading = await this.loading.isVisible().catch(() => false);
          if (loading) return false;
          const rows = await this.rows.count();
          const empty = await this.emptyState.count();
          return rows > 0 || empty > 0;
        },
        { timeout, intervals: [500, 1000, 2000, 3000] },
      )
      .toBe(true);
  }

  async rowCount(): Promise<number> {
    return this.rows.count();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.emptyState.count()) > 0;
  }

  async currentNetworkLabel(): Promise<string> {
    return (await this.networkTrigger.innerText()).trim();
  }

  // ── Network selector ─────────────────────────────────────────────────

  async openNetworkSelector(): Promise<void> {
    await this.networkTrigger.click();
    await this.networkSearch.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Opens the network selector, searches by chain name, picks the match, and
   * waits for the (remounted) activity list to settle.
   */
  async selectNetwork(chainName: string): Promise<void> {
    await this.openNetworkSelector();
    await this.networkSearch.fill(chainName);
    const option = this.page.locator(
      `[data-testid="network-option"][data-network-name="${chainName}"]`,
    );
    await option.first().waitFor({ state: 'visible', timeout: 10_000 });
    await option.first().click();
    await this.networkSearch
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => {});
    await this.waitForLoaded();
  }

  /**
   * Selects a network that is expected to have transaction history and returns
   * its row count. The live history API (proxy-api.avax.network) can return
   * 429 Too Many Requests, which the app surfaces as an (incorrectly) empty
   * list. When that happens we nudge a refetch by toggling through a data-rich
   * network and retry, riding over transient rate limits without static waits
   * on the happy path.
   */
  async selectNetworkExpectingActivity(
    chainName: string,
    {
      retries = 1,
      settleMs = 8000,
    }: { retries?: number; settleMs?: number } = {},
  ): Promise<number> {
    await this.selectNetwork(chainName);
    let rows = await this.rowCount();
    for (let attempt = 0; attempt < retries && rows === 0; attempt++) {
      const nudge = chainName === 'Bitcoin' ? 'Avalanche (C-Chain)' : 'Bitcoin';
      await this.selectNetwork(nudge);
      await this.page.waitForTimeout(settleMs);
      await this.selectNetwork(chainName);
      rows = await this.rowCount();
    }
    return rows;
  }

  // ── Filter dropdown ──────────────────────────────────────────────────

  filterOption(name: string): Locator {
    return this.page.locator(`[data-testid="activity-filter-option-${name}"]`);
  }

  async openFilter(): Promise<void> {
    await this.filterTrigger.click();
    await this.filterOption('All').waitFor({
      state: 'visible',
      timeout: 10_000,
    });
  }

  async selectFilter(name: string): Promise<void> {
    await this.openFilter();
    await this.filterOption(name).click();
    await this.filterOption(name)
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => {});
  }

  // ── Explorer link ────────────────────────────────────────────────────

  /** Reads a row's intended explorer URL without opening it. */
  async explorerLinkForRow(index: number): Promise<string | null> {
    return this.explorerLinks.nth(index).getAttribute('data-explorer-link');
  }

  /**
   * Reads the row's intended explorer URL, clicks the link, and returns the
   * intended URL plus the newly opened browser tab.
   */
  async openExplorerForRow(
    index: number,
    context: BrowserContext,
  ): Promise<{ link: string | null; tab: Page }> {
    const button = this.explorerLinks.nth(index);
    const link = await button.getAttribute('data-explorer-link');
    const pagePromise = context.waitForEvent('page', { timeout: 15_000 });
    await button.click();
    const tab = await pagePromise;
    await tab.waitForLoadState('domcontentloaded').catch(() => {});
    return { link, tab };
  }
}
