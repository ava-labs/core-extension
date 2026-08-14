/**
 * Portfolio Page - main wallet home, including the empty-wallet state
 * (the "Get started by adding crypto" screen shown when total balance is 0
 * and the account holds no assets).
 */
import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PortfolioPage extends BasePage {
  // Empty-state (zero-balance) elements
  readonly emptyState: Locator;
  readonly emptyStateHeading: Locator;
  readonly buyCryptoOption: Locator;
  readonly receiveCryptoOption: Locator;

  // Top portfolio action buttons (only rendered for a funded wallet)
  readonly sendActionButton: Locator;
  readonly swapActionButton: Locator;
  readonly buyActionButton: Locator;
  readonly bridgeActionButton: Locator;

  // Highlights banner carousel (funded wallet, Assets tab)
  readonly settingsButton: Locator;
  readonly highlightsCarousel: Locator;
  readonly highlightsScrollContainer: Locator;
  readonly trendingSlide: Locator;
  readonly highlightBanners: Locator;

  // Assets tab token list + sort menu
  readonly sortMenuTrigger: Locator;
  readonly assetCards: Locator;

  constructor(page: Page) {
    super(page);

    this.sortMenuTrigger = page.locator('#sort-menu').getByRole('button');
    this.assetCards = page.locator('[data-testid="asset-card"]');

    this.settingsButton = page.locator('[data-testid="settings-button"]');
    this.highlightsCarousel = page.locator(
      '[data-testid="highlights-carousel"]',
    );
    this.highlightsScrollContainer = page.locator(
      '[data-testid="highlights-scroll-container"]',
    );
    this.trendingSlide = page.locator('[data-testid="trending-token-slide"]');
    // Each highlight banner carries a `highlight-banner-<id>` testid; the prefix
    // selector stays valid even if the banner set changes (e.g. via Contentful).
    this.highlightBanners = page.locator('[data-testid^="highlight-banner-"]');

    this.emptyState = page.locator('[data-testid="portfolio-empty-state"]');
    this.emptyStateHeading = page.getByRole('heading', {
      name: /get started by adding crypto to your wallet/i,
    });
    this.buyCryptoOption = page.locator(
      '[data-testid="empty-state-buy-crypto"]',
    );
    this.receiveCryptoOption = page.locator(
      '[data-testid="empty-state-receive-crypto"]',
    );

    // The funded-wallet action bar uses SquareButton labels; match exact names
    // so they don't collide with the empty-state "Buy crypto" / "Receive crypto"
    // list items.
    this.sendActionButton = page
      .locator('[data-testid="send-nav-button"]')
      .or(page.getByRole('button', { name: 'Send', exact: true }));
    this.swapActionButton = page.getByRole('button', {
      name: 'Swap',
      exact: true,
    });
    this.buyActionButton = page
      .locator('[data-testid="buy-nav-button"]')
      .or(page.getByRole('button', { name: 'Buy', exact: true }));
    this.bridgeActionButton = page.getByRole('button', {
      name: 'Bridge',
      exact: true,
    });
  }

  /**
   * Ensures we are on the portfolio home route (`#/`).
   */
  async gotoHome(): Promise<void> {
    const hash = (this.page.url().split('#')[1] ?? '').split('?')[0];
    if (hash !== '' && hash !== '/') {
      await this.page.evaluate(() => {
        window.location.hash = '#/';
      });
      await this.page.waitForURL(/#\/(\?|$)/, { timeout: 5000 });
    }
  }

  /**
   * Waits for the empty-wallet state to render. Balances are fetched live after
   * unlock, so the empty state only appears once the (zero) balance resolves.
   */
  async waitForEmptyState(timeout = 60_000): Promise<void> {
    await this.emptyState.waitFor({ state: 'visible', timeout });
  }

  /**
   * Clicks "Buy crypto" in the empty state, which opens the Core on-ramp in a
   * new browser tab. Returns the newly opened page.
   */
  async clickBuyCryptoExpectNewTab(context: BrowserContext): Promise<Page> {
    const pagePromise = context.waitForEvent('page', { timeout: 15_000 });
    await this.buyCryptoOption.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState('domcontentloaded').catch(() => {});
    return newPage;
  }

  /**
   * Clicks "Receive crypto" in the empty state, navigating in-app to the
   * Receive page.
   */
  async clickReceiveCrypto(): Promise<void> {
    await this.receiveCryptoOption.click();
    await this.page.waitForURL(/#\/receive/, { timeout: 10_000 });
  }

  /**
   * Clicks the funded-wallet top "Buy" action button and returns the Core Web
   * tab it opens.
   */
  async clickBuyExpectNewTab(context: BrowserContext): Promise<Page> {
    await this.buyActionButton.first().waitFor({
      state: 'visible',
      timeout: 60_000,
    });
    const pagePromise = context.waitForEvent('page', { timeout: 15_000 });
    await this.buyActionButton.first().click();
    const tab = await pagePromise;
    await tab.waitForLoadState('domcontentloaded').catch(() => {});
    return tab;
  }

  /**
   * Asserts none of the funded-wallet top action buttons are present.
   */
  async expectNoActionButtons(): Promise<void> {
    await expect(this.sendActionButton).toHaveCount(0);
    await expect(this.swapActionButton).toHaveCount(0);
    await expect(this.buyActionButton).toHaveCount(0);
    await expect(this.bridgeActionButton).toHaveCount(0);
  }

  // ── Highlights / trending banners ────────────────────────────────────

  /**
   * Waits for the highlights carousel and its first (Trending tokens) slide.
   * Trending data is fetched live, so the slide can take a moment to resolve.
   */
  async waitForHighlights(timeout = 60_000): Promise<void> {
    await this.highlightsCarousel.waitFor({ state: 'visible', timeout });
    await this.trendingSlide.waitFor({ state: 'visible', timeout });
  }

  /**
   * Opens Settings via the header gear button.
   */
  async openSettings(): Promise<void> {
    await this.settingsButton.click();
    await this.page.waitForURL(/#\/settings/, { timeout: 10_000 });
  }

  /**
   * Clicks the Trending tokens slide ("… are trending today") and waits for the
   * Trending tokens page route.
   */
  async clickTrendingSlide(): Promise<void> {
    await this.trendingSlide.click();
    await this.page.waitForURL(/#\/trending/, { timeout: 10_000 });
  }

  async highlightBannerCount(): Promise<number> {
    return this.highlightBanners.count();
  }

  /**
   * Scrolls the carousel horizontally to the end so the campaign/news banners
   * are brought into view.
   */
  async scrollHighlightsToEnd(): Promise<void> {
    await this.highlightsScrollContainer.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
    });
    // Deterministic settle: wait until the last banner is actually in view
    // (rather than sleeping a fixed amount for the scroll-snap to finish).
    await expect(this.highlightBanners.last()).toBeInViewport();
  }

  /**
   * Clicks the first campaign/news highlight banner and resolves how it
   * navigated: an external banner opens a new browser tab (returned as
   * `newTab`); an internal banner changes the in-app route (`routeChanged`).
   * Content-agnostic so it survives Contentful-managed banner changes.
   */
  async clickFirstHighlightBanner(
    context: BrowserContext,
  ): Promise<{ newTab?: Page; routeChanged: boolean }> {
    const banner = this.highlightBanners.first();
    await banner.scrollIntoViewIfNeeded();

    const urlBefore = this.page.url();
    const pagePromise = context
      .waitForEvent('page', { timeout: 8_000 })
      .catch(() => undefined);

    await banner.click();

    const newTab = await pagePromise;
    if (newTab) {
      await newTab.waitForLoadState('domcontentloaded').catch(() => {});
      return { newTab, routeChanged: false };
    }

    const routeChanged = await this.page
      .waitForFunction((prev) => window.location.href !== prev, urlBefore, {
        timeout: 5_000,
      })
      .then(() => true)
      .catch(() => false);

    return { routeChanged };
  }

  // ── Assets tab: token list sorting ───────────────────────────────────

  /**
   * Waits for the funded Assets tab token list to render at least one card.
   */
  async waitForAssetsLoaded(timeout = 60_000): Promise<void> {
    await this.assetCards.first().waitFor({ state: 'visible', timeout });
  }

  async assetCount(): Promise<number> {
    return this.assetCards.count();
  }

  /**
   * Opens the Sort dropdown and selects an option by its sort value
   * (e.g. 'balance', 'balance-quantity', 'name-asc', 'name-desc').
   */
  async sortBy(value: string): Promise<void> {
    await this.sortMenuTrigger.click();
    const option = this.page.locator(`[data-testid="sort-option-${value}"]`);
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();
    // Popover closes on select; wait for it to detach before reading order.
    await option.waitFor({ state: 'hidden', timeout: 10_000 });
  }

  /**
   * Reads the given data attribute from every asset card in rendered order.
   */
  private async readAssetAttribute(attr: string): Promise<string[]> {
    return this.assetCards.evaluateAll(
      (els, attribute) => els.map((el) => el.getAttribute(attribute) ?? ''),
      attr,
    );
  }

  async getAssetNames(): Promise<string[]> {
    return this.readAssetAttribute('data-asset-name');
  }

  async getAssetBalances(): Promise<number[]> {
    return (await this.readAssetAttribute('data-asset-balance')).map(Number);
  }

  /**
   * Per-card flag for whether the token is a native AVAX token (C/P/X-Chain),
   * which the Default sort promotes to the top of the list.
   */
  async getAssetIsAvaxFlags(): Promise<boolean[]> {
    return (await this.readAssetAttribute('data-asset-is-avax')).map(
      (v) => v === 'true',
    );
  }
}
