/**
 * Collectibles tab - virtualized NFT grid with a Filter dropdown (network +
 * media type), a Sort dropdown, and a full-screen Manage popup (search, hide
 * unreachable, hide NFTs without media, per-NFT show/hide toggles).
 *
 * The grid and the manage list are both virtualized, media loads async, and
 * large/unreachable datasets can be slow. To stay robust:
 *  - assertions read render-time data attributes (name/chainId/media/updatedAt)
 *    rather than waiting on media,
 *  - they check predicates over the *currently visible* cells (no exact totals),
 *  - loads resolve by polling for a terminal state, never static waits.
 */
import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export const COLLECTIBLE_CHAIN_IDS = {
  avalanche: '43114',
  ethereum: '1',
};

export class CollectiblesTabPage extends BasePage {
  readonly navTab: Locator;
  readonly tab: Locator;
  readonly gridItems: Locator;
  readonly emptyState: Locator;
  readonly filterTrigger: Locator;
  readonly sortTrigger: Locator;
  readonly manageButton: Locator;

  // Manage popup
  readonly manageSearch: Locator;
  readonly hideUnreachableToggle: Locator;
  readonly hideNoMediaToggle: Locator;
  readonly manageItems: Locator;
  readonly manageBack: Locator;

  constructor(page: Page) {
    super(page);

    this.navTab = page
      .getByRole('tab', { name: 'Collectibles' })
      .or(page.getByText('Collectibles', { exact: true }));
    this.tab = page.locator('[data-testid="collectibles-tab"]');
    this.gridItems = page.locator('[data-testid="collectible-grid-item"]');
    this.emptyState = page.getByText(
      /No collectibles|You hid all your collectibles/,
    );
    this.filterTrigger = this.tab.getByRole('button', { name: 'Filter' });
    this.sortTrigger = this.tab.getByRole('button', { name: 'Sort' });
    this.manageButton = this.tab.getByRole('button', { name: 'Manage' });

    this.manageSearch = page.locator(
      '[data-testid="collectibles-manage-search"] input',
    );
    this.hideUnreachableToggle = page.locator(
      '[data-testid="collectibles-hide-unreachable"]',
    );
    this.hideNoMediaToggle = page.locator(
      '[data-testid="collectibles-hide-no-media"]',
    );
    this.manageItems = page.locator('[data-testid="collectible-manage-item"]');
    this.manageBack = page.locator('[data-testid="page-back-button"]');
  }

  /** Switches to the Collectibles tab and waits for the grid (or empty state). */
  async open(timeout = 60_000): Promise<void> {
    await this.navTab.first().waitFor({ state: 'visible', timeout });
    await this.navTab.first().click();
    // Balances may still be loading (PortfolioTabs shows a skeleton LoadingState
    // until then, so the collectibles tab isn't mounted yet) — allow full time.
    await this.tab.waitFor({ state: 'visible', timeout });
    await this.waitForGridLoaded(timeout);
  }

  /** Resolves once the grid has rendered items or shows an empty state. */
  async waitForGridLoaded(timeout = 60_000): Promise<void> {
    await expect
      .poll(
        async () =>
          (await this.gridItems.count()) > 0 ||
          (await this.emptyState.count()) > 0,
        { timeout, intervals: [500, 1000, 2000] },
      )
      .toBe(true);
  }

  async gridCount(): Promise<number> {
    return this.gridItems.count();
  }

  /** The tokenId of the first (top-of-sort) visible grid cell. */
  async firstGridTokenId(): Promise<string> {
    return (
      (await this.gridItems.first().getAttribute('data-collectible-tokenid')) ??
      ''
    );
  }

  gridItemByTokenId(tokenId: string): Locator {
    return this.page.locator(
      `[data-testid="collectible-grid-item"][data-collectible-tokenid="${tokenId}"]`,
    );
  }

  /** The core.app deep-link the first grid cell opens when clicked. */
  async firstGridCoreUrl(): Promise<string> {
    return (
      (await this.gridItems.first().getAttribute('data-collectible-coreurl')) ??
      ''
    );
  }

  /** Clicks the first grid cell and returns the core.app tab it opens. */
  async clickFirstGridItem(context: BrowserContext): Promise<Page> {
    const pagePromise = context.waitForEvent('page', { timeout: 15_000 });
    await this.gridItems.first().click();
    const tab = await pagePromise;
    await tab.waitForLoadState('domcontentloaded').catch(() => {});
    return tab;
  }

  /** Atomically snapshots a data attribute across all visible grid cells. */
  private async readGridAttr(attr: string): Promise<string[]> {
    return this.gridItems.evaluateAll(
      (els, a) => els.map((el) => el.getAttribute(a) ?? ''),
      attr,
    );
  }

  getGridChainIds(): Promise<string[]> {
    return this.readGridAttr('data-collectible-chainid');
  }
  getGridMediaTypes(): Promise<string[]> {
    return this.readGridAttr('data-collectible-media');
  }

  /**
   * Snapshots the sort-relevant fields of visible cells. The app sorts by
   * "has logo" first, then the chosen mode, so callers filter to hasLogo items
   * to assert name/date order within that primary group.
   */
  async getGridSortRows(): Promise<
    { name: string; updatedAt: number; hasLogo: boolean }[]
  > {
    return this.gridItems.evaluateAll((els) =>
      els.map((el) => ({
        name: el.getAttribute('data-collectible-name') ?? '',
        updatedAt: Number(el.getAttribute('data-collectible-updatedat') ?? '0'),
        hasLogo: el.getAttribute('data-collectible-haslogo') === 'true',
      })),
    );
  }

  // ── Filter dropdown ──────────────────────────────────────────────────

  private filterOption(testid: string): Locator {
    return this.page.locator(
      `[data-testid="collectibles-filter-option-${testid}"]`,
    );
  }

  async openFilter(): Promise<void> {
    await this.filterTrigger.click();
    await this.filterOption('all-networks').waitFor({
      state: 'visible',
      timeout: 10_000,
    });
  }

  private async clickFilterOption(testid: string): Promise<void> {
    await this.openFilter();
    const option = this.filterOption(testid);
    await option.click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }

  /** Resets network filter then selects only the given chain. */
  async selectOnlyNetwork(chainId: string): Promise<void> {
    await this.clickFilterOption('all-networks');
    await this.clickFilterOption(`network-${chainId}`);
    await this.waitForGridLoaded();
  }

  async selectMediaType(
    type: 'all-types' | 'picture' | 'gif' | 'video',
  ): Promise<void> {
    await this.clickFilterOption(type);
    await this.waitForGridLoaded();
  }

  // ── Sort dropdown ────────────────────────────────────────────────────

  async selectSort(
    mode: 'name-asc' | 'name-desc' | 'date-added',
  ): Promise<void> {
    await this.sortTrigger.click();
    const option = this.page.locator(
      `[data-testid="collectibles-sort-option-${mode}"]`,
    );
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();
    await option.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
    await this.waitForGridLoaded();
  }

  // ── Manage popup ─────────────────────────────────────────────────────

  async openManage(): Promise<void> {
    await this.manageButton.click();
    await this.manageSearch.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async closeManage(): Promise<void> {
    if (await this.manageBack.count()) {
      await this.manageBack.first().click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.manageSearch
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => {});
  }

  async searchManage(query: string): Promise<void> {
    await this.manageSearch.fill(query);
  }

  async manageItemCount(): Promise<number> {
    return this.manageItems.count();
  }

  manageItemByTokenId(tokenId: string): Locator {
    return this.page.locator(
      `[data-testid="collectible-manage-item"][data-collectible-tokenid="${tokenId}"]`,
    );
  }

  /** Reads the tokenId of the first visible manage-list row. */
  async firstManageTokenId(): Promise<string> {
    return (
      (await this.manageItems
        .first()
        .getAttribute('data-collectible-tokenid')) ?? ''
    );
  }

  /** Toggles a manage-list row's show/hide switch by tokenId. */
  async toggleManageItem(tokenId: string): Promise<void> {
    await this.manageItemByTokenId(tokenId)
      .first()
      .locator('[data-testid="collectible-manage-toggle"]')
      .click();
  }

  async setHideUnreachable(enabled: boolean): Promise<void> {
    await this.setSwitch(this.hideUnreachableToggle, enabled);
  }

  async setHideNoMedia(enabled: boolean): Promise<void> {
    await this.setSwitch(this.hideNoMediaToggle, enabled);
  }

  private async setSwitch(toggle: Locator, enabled: boolean): Promise<void> {
    const input = toggle.locator('input[type="checkbox"]');
    if ((await input.isChecked()) !== enabled) {
      await toggle.click();
      await expect
        .poll(() => input.isChecked(), { timeout: 5_000 })
        .toBe(enabled);
    }
  }
}
