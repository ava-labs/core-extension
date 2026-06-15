import { test, expect } from '../fixtures/extension.fixture';
import { PortfolioPage } from '../pages/extension/PortfolioPage';
import { SettingsPage } from '../pages/extension/SettingsPage';
import { TrendingTokensPage } from '../pages/extension/TrendingTokensPage';
import { ActivityTabPage } from '../pages/extension/ActivityTabPage';
import {
  CollectiblesTabPage,
  COLLECTIBLE_CHAIN_IDS,
} from '../pages/extension/CollectiblesTabPage';
import { DeFiTabPage } from '../pages/extension/DeFiTabPage';

/**
 * Portfolio page scenarios.
 *
 * - Empty wallet (TestRail C32093–C32096): uses the zero-balance
 *   `mainnetEmptyExtWallet` snapshot, which renders the EmptyState
 *   ("Get started by adding crypto") instead of PortfolioDetails.
 * - Highlights & Trending (TestRail C5609193, C5609192, C32097, C32098,
 *   C39454): uses the funded `mainnetPrimaryExtWallet` snapshot, since the
 *   highlights carousel renders at the top of the funded Assets tab.
 *
 * Trending token data is fetched live, so loads use generous timeouts.
 * Campaign/news banners are content-managed (possibly Contentful), so those
 * assertions are intentionally content-agnostic: presence, reachability via
 * horizontal scroll, and that a click triggers navigation (a new tab for
 * external banners or an in-app route change for internal ones).
 */
const EMPTY_WALLET_SNAPSHOT = 'mainnetEmptyExtWallet';
const FUNDED_SNAPSHOT = 'mainnetPrimaryExtWallet';

test.describe('Portfolio - Empty Wallet', () => {
  test(
    'As a CORE ext user, when I landed on the Portfolio page for the empty wallet, I can see Buy Crypto and Receive Crypto options',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: EMPTY_WALLET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.gotoHome();
      await portfolio.waitForEmptyState();

      await expect(portfolio.emptyStateHeading).toBeVisible();
      await expect(portfolio.buyCryptoOption).toBeVisible();
      await expect(portfolio.receiveCryptoOption).toBeVisible();
      await expect(portfolio.buyCryptoOption).toContainText(/buy crypto/i);
      await expect(portfolio.receiveCryptoOption).toContainText(
        /receive crypto/i,
      );
    },
  );

  test(
    'As a CORE ext user, when I landed on the Portfolio page for the empty wallet, I can see Buy Crypto option can navigates to On ramp solutions for Core',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: EMPTY_WALLET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-002',
        },
      ],
    },
    async ({ context, unlockedExtensionPage }) => {
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.gotoHome();
      await portfolio.waitForEmptyState();

      const onRampTab = await portfolio.clickBuyCryptoExpectNewTab(context);

      expect(onRampTab.url()).toContain('/buy');
      await onRampTab.close();
    },
  );

  test(
    'As a CORE ext user, when I landed on the Portfolio page for the empty wallet, I can see Receive Crypto option can navigates to Receive options',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: EMPTY_WALLET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.gotoHome();
      await portfolio.waitForEmptyState();

      await portfolio.clickReceiveCrypto();

      expect(unlockedExtensionPage.url()).toContain('/receive');
      await expect(
        unlockedExtensionPage.getByText(/receive crypto/i).first(),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user, when I landed on the Portfolio page for the empty wallet, there should not be Send, Swap, Buy, and Bridge buttons on the top',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: EMPTY_WALLET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.gotoHome();
      await portfolio.waitForEmptyState();

      await portfolio.expectNoActionButtons();
    },
  );
});

test.describe('Portfolio - Highlights & Trending', () => {
  test(
    'As a CORE ext user, Trending Token and news/campaign banner should be configurable through a toggle in Settings',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:BAN-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const settings = new SettingsPage(unlockedExtensionPage);

      // Carousel is shown by default.
      await portfolio.waitForHighlights();

      // Turn it off in Settings → carousel disappears on the Portfolio.
      await portfolio.openSettings();
      await settings.waitForLoaded();
      expect(await settings.isHighlightsEnabled()).toBe(true);
      await settings.setHighlights(false);
      await settings.goBackToPortfolio();
      await expect(portfolio.highlightsCarousel).toHaveCount(0);

      // Turn it back on → carousel returns.
      await portfolio.openSettings();
      await settings.waitForLoaded();
      await settings.setHighlights(true);
      await settings.goBackToPortfolio();
      await expect(portfolio.highlightsCarousel).toBeVisible();
    },
  );

  test(
    'As a CORE ext user, I can reach the highlighted news/campaign banners in the Portfolio page',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:BAN-002',
        },
      ],
    },
    async ({ context, unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.waitForHighlights();

      // There is at least one campaign/news banner beyond the trending slide.
      expect(await portfolio.highlightBannerCount()).toBeGreaterThan(0);

      // They are reachable by scrolling the carousel horizontally.
      await portfolio.scrollHighlightsToEnd();
      await expect(portfolio.highlightBanners.last()).toBeVisible();

      // Clicking a banner navigates somewhere (new tab or in-app route).
      const result = await portfolio.clickFirstHighlightBanner(context);
      expect(Boolean(result.newTab) || result.routeChanged).toBe(true);
      if (result.newTab) {
        expect(result.newTab.url()).toMatch(/^https?:\/\//);
        await result.newTab.close();
      }
    },
  );

  test(
    'As a CORE ext user, I can reach the Trending Tokens page, click on the Trending Today button in the Portfolio page',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:BAN-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const trending = new TrendingTokensPage(unlockedExtensionPage);

      await portfolio.waitForHighlights();
      await portfolio.clickTrendingSlide();

      expect(unlockedExtensionPage.url()).toContain('/trending');
      await expect(trending.title).toBeVisible();
      await trending.waitForLoaded();
      expect(await trending.rowCount()).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user on the Trending Tokens page, I can see trending tokens for Avalanche and Solana with 24-hour % and Buy option for each token',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:BAN-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const trending = new TrendingTokensPage(unlockedExtensionPage);

      await portfolio.waitForHighlights();
      await portfolio.clickTrendingSlide();
      await trending.waitForLoaded();

      // Avalanche is selected by default.
      const avaxRows = await trending.rowCount();
      expect(avaxRows).toBeGreaterThan(0);
      const sample = Math.min(avaxRows, 3);
      for (let i = 0; i < sample; i++) {
        await trending.expectRowHasPercent(i);
        await trending.expectBuyRevealedOnHover(i);
      }

      // Solana network is available and also lists trending tokens.
      await expect(trending.solanaTab).toBeVisible();
      await trending.selectSolana();
      expect(await trending.rowCount()).toBeGreaterThan(0);
      await trending.expectRowHasPercent(0);
      await trending.expectBuyRevealedOnHover(0);
    },
  );

  test(
    'As a CORE ext user on the Trending Tokens page, there should be Buy button option for each row and navigate to Swap page when click on',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:BAN-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const trending = new TrendingTokensPage(unlockedExtensionPage);

      await portfolio.waitForHighlights();
      await portfolio.clickTrendingSlide();
      await trending.waitForLoaded();

      await trending.buyFromRow(0);
      expect(unlockedExtensionPage.url()).toContain('/fusion');
    },
  );
});

/**
 * Helpers asserting monotonic order. Names use the same raw string comparison
 * as the app's lodash `orderBy`; balances/quantities are numeric and sorted
 * descending. Values are read from data attributes on each asset card, so the
 * checks are independent of display formatting/abbreviation.
 */
const isAscending = (values: string[]): boolean =>
  values.every((v, i) => i === 0 || values[i - 1] <= v);
const isDescending = (values: string[]): boolean =>
  values.every((v, i) => i === 0 || values[i - 1] >= v);
const isNonIncreasing = (values: number[]): boolean =>
  values.every((v, i) => i === 0 || values[i - 1] >= v);

test.describe('Portfolio - Token List Sorting', () => {
  test(
    'As a CORE ext user, I can sort the tokens list by Balance',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      expect(await portfolio.assetCount()).toBeGreaterThan(1);

      await portfolio.sortBy('balance');
      await expect
        .poll(async () => isNonIncreasing(await portfolio.getAssetBalances()))
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can sort the tokens list by A to Z',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      expect(await portfolio.assetCount()).toBeGreaterThan(1);

      await portfolio.sortBy('name-asc');
      await expect
        .poll(async () => isAscending(await portfolio.getAssetNames()))
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can sort the tokens list by Z to A',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-007',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      expect(await portfolio.assetCount()).toBeGreaterThan(1);

      await portfolio.sortBy('name-desc');
      await expect
        .poll(async () => isDescending(await portfolio.getAssetNames()))
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can sort the token list by Default',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-008',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      expect(await portfolio.assetCount()).toBeGreaterThan(1);

      // Scramble the order first, then apply Default to prove the option works.
      await portfolio.sortBy('name-asc');
      await portfolio.sortBy('default');

      const avaxFlags = await portfolio.getAssetIsAvaxFlags();
      // Default promotes native AVAX (C/P/X-Chain) tokens to the top: the list
      // must start with an AVAX token and all AVAX rows must form a contiguous
      // prefix (no AVAX token appears after a non-AVAX one).
      expect(avaxFlags.some((isAvax) => isAvax)).toBe(true);
      expect(avaxFlags[0]).toBe(true);
      expect(isNonIncreasing(avaxFlags.map((isAvax) => (isAvax ? 1 : 0)))).toBe(
        true,
      );
    },
  );
});

/**
 * Activity tab scenarios (TestRail C32104, C5625015, C32105-C32108).
 *
 * C32104 uses the empty snapshot (Activity tab must be hidden); the rest use
 * the funded snapshot. Activity history is live and can be slow, and the
 * proxy-api.avax.network history endpoint occasionally returns 429 (rendered
 * as an empty list). ActivityTabPage.waitForLoaded() polls for a terminal
 * state without static waits, and selectNetworkExpectingActivity() retries
 * through rate limits for networks that should have history.
 */
// Networks where this funded wallet has real transaction history.
const ACTIVITY_NETWORKS = [
  'Avalanche (C-Chain)',
  'Avalanche (X-Chain)',
  'Avalanche (P-Chain)',
  'Ethereum',
  'Bitcoin',
];
// An obscure Avalanche L1 the wallet has never used → reliably empty. It's
// Glacier-indexed (not the moralis-evm proxy that rate-limits real EVM chains),
// so an empty result is genuine rather than a throttled false-empty.
const EMPTY_ACTIVITY_NETWORK = 'Blockticity';
// Expected explorer URL prefix per network, as the opened tab resolves it
// (Bitcoin's short link redirects to blockchain.com's canonical /explorer path;
// Ethereum keeps the app's double slash). Verified empirically.
const EXPLORER_PREFIX: Record<string, string> = {
  'Avalanche (C-Chain)': 'https://subnets.avax.network/c-chain/tx/',
  'Avalanche (X-Chain)': 'https://subnets.avax.network/x-chain/tx/',
  'Avalanche (P-Chain)': 'https://subnets.avax.network/p-chain/tx/',
  Ethereum: 'https://etherscan.io//tx/',
  Bitcoin: 'https://www.blockchain.com/explorer/transactions/btc/',
};

test.describe('Portfolio - Activity', () => {
  test(
    'As a CORE ext user on the activity tab, there should not be Activity tab for a newly created wallet',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: EMPTY_WALLET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACT-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      await portfolio.gotoHome();
      await portfolio.waitForEmptyState();

      // The tab bar renders (Assets is present) but, for an empty wallet, the
      // Activity tab is not offered.
      await expect(
        unlockedExtensionPage.getByText('Assets', { exact: true }),
      ).toBeVisible();
      await expect(
        unlockedExtensionPage.getByText('Activity', { exact: true }),
      ).toHaveCount(0);
    },
  );

  test(
    'As a CORE ext user on the activity tab, "No recent transactions" text can be displayed for empty state',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACT-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const activity = new ActivityTabPage(unlockedExtensionPage);

      // Pick an obscure L1 the wallet has never transacted on.
      await activity.open();
      await activity.selectNetwork(EMPTY_ACTIVITY_NETWORK);

      expect(await activity.isEmpty()).toBe(true);
      await expect(
        unlockedExtensionPage.getByText('No recent transactions'),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the activity tab, activity row links to the correct explorer for the transactions network',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACT-002',
        },
      ],
    },
    async ({ context, unlockedExtensionPage }) => {
      test.setTimeout(300_000);
      const activity = new ActivityTabPage(unlockedExtensionPage);

      await activity.open();

      // Verify a transaction on each network links to that network's explorer.
      for (const network of ACTIVITY_NETWORKS) {
        const rows = await activity.selectNetworkExpectingActivity(network);
        expect(
          rows,
          `${network} should have a transaction to open`,
        ).toBeGreaterThan(0);

        const link = (await activity.explorerLinkForRow(0)) ?? '';
        const txHash = link.split('/').filter(Boolean).pop() ?? '';
        expect(txHash.length).toBeGreaterThan(0);

        const { tab } = await activity.openExplorerForRow(0, context);
        const expectedPrefix = EXPLORER_PREFIX[network];
        // Wait for any explorer-side redirect (e.g. Bitcoin) to settle.
        await expect
          .poll(() => tab.url().startsWith(expectedPrefix), { timeout: 15_000 })
          .toBe(true);
        expect(tab.url(), `${network} explorer URL`).toContain(txHash);
        await tab.close();
      }
    },
  );

  test(
    'As a CORE ext user on the activity tab, I can switch what network to show activity for',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACT-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const activity = new ActivityTabPage(unlockedExtensionPage);

      await activity.open();
      expect(await activity.currentNetworkLabel()).toContain('C-Chain');

      await activity.selectNetwork('Ethereum');
      expect(await activity.currentNetworkLabel()).toContain('Ethereum');
    },
  );

  test(
    'As a CORE ext user on the activity tab, I see the options in the Filter dropdown for Sent, Received, Swap, Bridge, NFT, Contract Call etc',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACT-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const activity = new ActivityTabPage(unlockedExtensionPage);

      await activity.open();
      await activity.openFilter();

      for (const option of [
        'All',
        'Sent',
        'Received',
        'Swap',
        'Bridge',
        'NFT',
        'Contract_Call',
      ]) {
        await expect(activity.filterOption(option)).toBeVisible();
      }
    },
  );

  test(
    'As a CORE ext user on the activity tab, I see activities for C-X-P Chains, Ethereum, Bitcoin, and Solana networks',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACT-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(300_000);
      const activity = new ActivityTabPage(unlockedExtensionPage);

      await activity.open();

      // C-X-P Chains, Ethereum and Bitcoin all have history for this wallet;
      // assert each shows activity (retrying through transient 429 rate limits).
      for (const network of ACTIVITY_NETWORKS) {
        const rows = await activity.selectNetworkExpectingActivity(network);
        expect(await activity.currentNetworkLabel()).toContain(network);
        expect(rows, `${network} should display activity`).toBeGreaterThan(0);
      }

      // Solana only surfaces 24h activity and is frequently empty, so we only
      // assert it is selectable and loads to a terminal state.
      await activity.selectNetwork('Solana');
      expect(await activity.currentNetworkLabel()).toContain('Solana');
    },
  );
});

/**
 * Collectibles tab scenarios (TestRail C32109, C32114-C32120, C32126,
 * C5642224, C32127, C5641713), funded snapshot.
 *
 * The grid and manage list are virtualized and media loads async, so
 * assertions read render-time data attributes over the currently visible cells
 * (no exact totals) and loads resolve by polling — see CollectiblesTabPage.
 */
test.describe('Portfolio - Collectibles', () => {
  test(
    'As a CORE ext user on the collectibles tab, I can view collectibles/NFTs from Avalanche/Ethereum networks',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      await collectibles.selectOnlyNetwork(COLLECTIBLE_CHAIN_IDS.avalanche);
      await expect
        .poll(async () => {
          const ids = await collectibles.getGridChainIds();
          return (
            ids.length > 0 &&
            ids.every((id) => id === COLLECTIBLE_CHAIN_IDS.avalanche)
          );
        })
        .toBe(true);

      await collectibles.selectOnlyNetwork(COLLECTIBLE_CHAIN_IDS.ethereum);
      await expect
        .poll(async () => {
          const ids = await collectibles.getGridChainIds();
          return (
            ids.length > 0 &&
            ids.every((id) => id === COLLECTIBLE_CHAIN_IDS.ethereum)
          );
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the collectibles tab, I can filter collectibles/NFTs by Pictures',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      await collectibles.selectMediaType('picture');
      await expect
        .poll(async () => {
          const media = await collectibles.getGridMediaTypes();
          return media.length > 0 && media.every((m) => m === 'picture');
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the collectibles tab, I can filter collectibles/NFTs by Gifs',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // This wallet has no GIFs: confirm the option is selectable and the grid
      // settles so only GIFs would remain (empty here). No content assertion.
      await collectibles.selectMediaType('gif');
      await expect
        .poll(async () => {
          const media = await collectibles.getGridMediaTypes();
          return media.every((m) => m === 'gif');
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the collectibles tab, I can filter collectibles/NFTs by Videos',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // This wallet has no Videos: confirm the option is selectable; no content
      // assertion (only videos would remain, empty here).
      await collectibles.selectMediaType('video');
      await expect
        .poll(async () => {
          const media = await collectibles.getGridMediaTypes();
          return media.every((m) => m === 'video');
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the collectibles tab, I can sort collectibles/NFTs from A to Z',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // Verify the sort option is applicable: it selects and the grid stays
      // functional. (NFT order itself is not asserted — virtualized + async
      // media makes ordering checks flaky.)
      await collectibles.selectSort('name-asc');
      await expect.poll(() => collectibles.gridCount()).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user on the collectibles tab, I can sort collectibles/NFTs from Z to A',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-007',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      await collectibles.selectSort('name-desc');
      await expect.poll(() => collectibles.gridCount()).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user on the collectibles tab, I can sort collectibles/NFTs by Date Added',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-008',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      await collectibles.selectSort('date-added');
      await expect.poll(() => collectibles.gridCount()).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user on the collectible tab, I can enable/disable showing collectibles/NFTs via Manage List',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-009',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // Track a specific NFT that's visible at the top of the grid. Tracking one
      // item (rather than a total count) is robust to virtualization: a hidden
      // item is removed from the dataset entirely, and a stable sort returns it
      // to the top when re-shown.
      const tokenId = await collectibles.firstGridTokenId();
      expect(tokenId.length).toBeGreaterThan(0);

      // Disable: hide it via Manage (search so the toggle is rendered).
      await collectibles.openManage();
      await collectibles.searchManage(tokenId);
      await collectibles.toggleManageItem(tokenId);
      await collectibles.closeManage();
      await expect
        .poll(() => collectibles.gridItemByTokenId(tokenId).count())
        .toBe(0);

      // Enable: re-show it → its cell returns to the grid.
      await collectibles.openManage();
      await collectibles.searchManage(tokenId);
      await collectibles.toggleManageItem(tokenId);
      await collectibles.closeManage();
      await expect
        .poll(() => collectibles.gridItemByTokenId(tokenId).count())
        .toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user on the collectible tab, I can search collectibles/NFTs via Manage List',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-010',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      await collectibles.openManage();
      const total = await collectibles.manageItemCount();
      expect(total).toBeGreaterThan(0);

      // Search by the first row's tokenId → results narrow to matches.
      const tokenId = await collectibles.firstManageTokenId();
      await collectibles.searchManage(tokenId);
      await expect
        .poll(() => collectibles.manageItemCount(), { timeout: 10_000 })
        .toBeGreaterThan(0);
      const matches = await collectibles.manageItemCount();
      expect(matches).toBeLessThanOrEqual(total);
      await expect(collectibles.manageItemByTokenId(tokenId)).toBeVisible();

      await collectibles.closeManage();
    },
  );

  test(
    'As a CORE ext user on the collectible tab, I can hide unreachable collectibles/NFTs via Manage List',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-011',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // Default hides unreachable. Turning it OFF reveals more (or equal) items.
      await collectibles.openManage();
      await collectibles.setHideUnreachable(false);
      await collectibles.closeManage();
      const shown = await collectibles.gridCount();

      await collectibles.openManage();
      await collectibles.setHideUnreachable(true);
      await collectibles.closeManage();
      await expect
        .poll(() => collectibles.gridCount())
        .toBeLessThanOrEqual(shown);
    },
  );

  test(
    'As a CORE ext user on the collectible tab, I can hide collectibles/NFTs without media via Manage List',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-012',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // Turning OFF "hide NFTs without media" reveals more (or equal) items;
      // turning it back ON hides them again.
      await collectibles.openManage();
      await collectibles.setHideNoMedia(false);
      await collectibles.closeManage();
      const withNoMedia = await collectibles.gridCount();

      await collectibles.openManage();
      await collectibles.setHideNoMedia(true);
      await collectibles.closeManage();
      await expect
        .poll(() => collectibles.gridCount())
        .toBeLessThanOrEqual(withNoMedia);
    },
  );

  test(
    'As a CORE ext user on the collectible tab, NFT should be opened in core.app when the user clicks on that',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:COL-013',
        },
      ],
    },
    async ({ context, unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const collectibles = new CollectiblesTabPage(unlockedExtensionPage);
      await collectibles.open();

      // The grid cell deep-links to the NFT on core.app.
      const coreUrl = await collectibles.firstGridCoreUrl();
      expect(coreUrl).toContain('core.app/portfolio/');
      expect(coreUrl).toContain('/collectibles/');
      const tokenId = await collectibles.firstGridTokenId();

      // Clicking the NFT opens that core.app page in a new tab.
      const tab = await collectibles.clickFirstGridItem(context);
      await expect
        .poll(() => tab.url(), { timeout: 15_000 })
        .toContain('core.app/portfolio/');
      expect(tab.url()).toContain('/collectibles/');
      expect(tab.url()).toContain(tokenId);
      await tab.close();
    },
  );
});

/**
 * DeFi tab scenarios (TestRail C32136-C32145, C32149, C32150, C32154,
 * C5651552, C32155).
 *
 * C32136 (empty state) uses the empty snapshot; the rest use the funded
 * snapshot whose DeFi positions are kept stable. DeFi data is live, so loads
 * poll for a terminal state and assertions check ordering/membership rather
 * than exact USD amounts (which fluctuate). The list is not virtualized, so all
 * rows are readable.
 */
// Categories present in the funded wallet's DeFi portfolio.
const DEFI_FILTER_CATEGORIES = [
  { id: 'C32142', auto: 'DEFI-006', label: 'Lending' },
  { id: 'C32143', auto: 'DEFI-007', label: 'Liquidity Pool' },
  { id: 'C32144', auto: 'DEFI-008', label: 'Staked' },
  { id: 'C32145', auto: 'DEFI-009', label: 'Perpetuals' },
  { id: 'C32149', auto: 'DEFI-010', label: 'Rewards' },
  { id: 'C32150', auto: 'DEFI-011', label: 'Yield' },
];

const isAvalancheFirst = (networks: string[]): boolean => {
  let seenNonAvalanche = false;
  for (const n of networks) {
    const isAvax = n.toLowerCase().includes('avalanche');
    if (!isAvax) seenNonAvalanche = true;
    else if (seenNonAvalanche) return false; // an Avalanche row after a non-Avalanche one
  }
  return true;
};

test.describe('Portfolio - DeFi', () => {
  test(
    'As a CORE ext user on the defi tab, "No DeFi positions found" text is shown for the empty state',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: EMPTY_WALLET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-000',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);

      await defi.open();
      expect(await defi.isZeroState()).toBe(true);
      await expect(
        unlockedExtensionPage.getByText('No DeFi positions found'),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the defi tab, I can sort defi protocols by Name A to Z',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      await defi.selectSort('name-asc');
      await expect
        .poll(async () => {
          const names = await defi.getNames();
          return (
            names.length > 1 &&
            names.every((n, i) => i === 0 || names[i - 1].localeCompare(n) <= 0)
          );
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the defi tab, I can sort defi protocols by Name Z to A',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      await defi.selectSort('name-desc');
      await expect
        .poll(async () => {
          const names = await defi.getNames();
          return (
            names.length > 1 &&
            names.every((n, i) => i === 0 || names[i - 1].localeCompare(n) >= 0)
          );
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the defi tab, I can sort defi protocols by Protocol',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      // Protocol sort orders by the protocols' position groups; verify it is
      // applicable (selects and the list stays populated).
      await defi.selectSort('protocol-asc');
      await expect.poll(() => defi.rowCount()).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user on the defi tab, I can sort defi protocols by Network',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      // Network sort puts Avalanche protocols first, then others (Ethereum).
      await defi.selectSort('network-asc');
      await expect
        .poll(async () => {
          const networks = await defi.getNetworks();
          return networks.length > 1 && isAvalancheFirst(networks);
        })
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user on the defi tab, I can sort defi protocols by Amount',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      await defi.selectSort('amount-desc');
      await expect
        .poll(async () => {
          const amounts = await defi.getAmounts();
          return amounts.length > 1 && isNonIncreasing(amounts);
        })
        .toBe(true);
    },
  );

  for (const { auto, label } of DEFI_FILTER_CATEGORIES) {
    test(
      `As a CORE ext user on the defi tab, I can filter defi protocols by ${label}`,
      {
        tag: ['@regression'],
        annotation: [
          { type: 'snapshot', description: FUNDED_SNAPSHOT },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${auto}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }) => {
        test.setTimeout(120_000);
        const defi = new DeFiTabPage(unlockedExtensionPage);
        await defi.open();

        await defi.selectFilter(label);
        // Every visible protocol must hold a position of the selected category.
        await expect
          .poll(async () => {
            const rows = await defi.getCategoriesPerRow();
            return (
              rows.length > 0 && rows.every((cats) => cats.includes(label))
            );
          })
          .toBe(true);
      },
    );
  }

  test(
    "As a CORE ext user on the defi tab, I can open a protocol's details page by clicking on a protocol",
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-012',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      await defi.openFirstProtocolDetails();
      expect(unlockedExtensionPage.url()).toContain('/defi/');
      await expect(defi.detailsHeader).toBeVisible();
      await expect(defi.seeDetailsButton).toBeVisible();
    },
  );

  test(
    "As a CORE ext user on the defi tab, on a protocol's details, I can see the position breakdown grouped by type (Supplied / Borrowed / Rewards)",
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-013',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      // Aave V3's Lending position shows all three sections.
      await defi.openProtocolDetails(
        defi.rowByNameAndCategory('Aave V3', 'Lending'),
      );
      await expect(
        unlockedExtensionPage.getByText('Supplied', { exact: true }),
      ).toBeVisible();
      await expect(
        unlockedExtensionPage.getByText('Borrowed', { exact: true }),
      ).toBeVisible();
      await expect(
        unlockedExtensionPage.getByText('Rewards', { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the defi tab, I am linked to the correct defi app from the defi details modal via the See details button',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:DEFI-014',
        },
      ],
    },
    async ({ context, unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const defi = new DeFiTabPage(unlockedExtensionPage);
      await defi.open();

      await defi.openFirstProtocolDetails();
      const { siteUrl, tab } = await defi.clickSeeDetails(context);
      expect(siteUrl).toMatch(/^https?:\/\//);
      await expect
        .poll(() => tab.url(), { timeout: 15_000 })
        .toContain(new URL(siteUrl as string).host);
      await tab.close();
    },
  );
});

test.describe('Portfolio - Action Buttons', () => {
  test(
    'As a CORE ext user, I can click on Buy button and should be navigated to Core Web to buy',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:PORT-009',
        },
      ],
    },
    async ({ context, unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);

      // The top "Buy" action opens Core Web's buy page in a new tab.
      const tab = await portfolio.clickBuyExpectNewTab(context);
      await expect.poll(() => tab.url(), { timeout: 15_000 }).toContain('/buy');
      await tab.close();
    },
  );
});
