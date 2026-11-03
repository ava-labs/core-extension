import { test, expect } from '../fixtures/extension.fixture';
import { PortfolioPage } from '../pages/extension/PortfolioPage';
import { ManageTokensPage } from '../pages/extension/ManageTokensPage';

/**
 * Manage Tokens scenarios (TestRail C32169–C32175), funded mainnet wallet
 * (`mainnetPrimaryExtWallet`).
 *
 * Token metadata lookups, the catalog duplicate check and balances are all
 * fetched live, so these tests need network access and use generous timeouts.
 *
 * Copy note: two TestRail titles quote text that differs from the real UI.
 * Titles are kept verbatim; assertions check the actual UI copy:
 *   - C32174 title says "Token added!" → the success toast reads "Token Added".
 *   - C32175 title says "This token is already added." → the inline warning
 *     reads "Token already exists in the wallet." (see useAddCustomToken.ts).
 */
const FUNDED_SNAPSHOT = 'mainnetPrimaryExtWallet';

// BENQI qiAVAX: the long-lived AVAX supply-market receipt token from BENQI's
// core lending market. It is a real ERC-20 (metadata resolves on-chain) but,
// being a lending receipt rather than a market-traded asset, it is not part of
// Core's bundled token catalog, so it is addable as a custom token rather than
// rejected as a duplicate.
const CUSTOM_TOKEN_ADDRESS = '0xaf2c034C764d53005cC6cbc092518112cBD652bb';

// C-Chain USDC: present in Core's token catalog, so re-adding it is rejected
// as an existing token.
const DUPLICATE_TOKEN_ADDRESS = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
const DUPLICATE_WARNING = 'Token already exists in the wallet.';

test.describe('Manage Tokens', () => {
  test(
    'As a CORE ext user, I can reach the Manage Tokens page, click on the Manage button in the Portfolio page',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();

      expect(unlockedExtensionPage.url()).toContain('/manage-tokens');
      await expect(manageTokens.pageRoot).toBeVisible();
      await expect(
        unlockedExtensionPage.getByText('Manage Tokens').first(),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the Manage Tokens page, I can search for tokens',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();
      await manageTokens.waitForListLoaded();

      const [firstSymbol] = await manageTokens.visibleRowSymbols();
      expect(firstSymbol.length).toBeGreaterThan(0);

      await manageTokens.search(firstSymbol);
      await expect
        .poll(async () => {
          const symbols = await manageTokens.visibleRowSymbols();
          const names = await manageTokens.visibleRowNames();
          return (
            symbols.length > 0 &&
            symbols.every(
              (sym, i) =>
                sym.toLowerCase().includes(firstSymbol.toLowerCase()) ||
                names[i].toLowerCase().includes(firstSymbol.toLowerCase()),
            )
          );
        })
        .toBe(true);

      await manageTokens.search('zzzznonexistenttoken');
      await expect(manageTokens.noResults).toBeVisible();
      await expect(manageTokens.tokenRows).toHaveCount(0);
    },
  );

  test(
    'As a CORE ext user on the Manage Tokens page, I can see indicators for Scam tokens',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();
      await manageTokens.waitForListLoaded();

      // Flagged tokens are hidden by default; reveal them to show the scam "!"
      // indicator overlay on malicious rows.
      await manageTokens.setHideSpam(false);

      await expect
        .poll(() => manageTokens.scamIndicatorCount(), { timeout: 60_000 })
        .toBeGreaterThan(0);
      await expect(manageTokens.scamIndicators.first()).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the Manage Tokens page, I can select my favorite tokens',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();
      await manageTokens.waitForListLoaded();

      const { symbol, name } = await manageTokens.firstToggleableToken();
      expect(symbol.length).toBeGreaterThan(0);

      // Disable → the token disappears from the Portfolio token list.
      await manageTokens.setTokenEnabled(symbol, false);
      await portfolio.gotoHome();
      await portfolio.waitForAssetsLoaded();
      await expect.poll(() => portfolio.getAssetNames()).not.toContain(name);

      // Enable → the token returns to the Portfolio token list.
      await manageTokens.openFromPortfolio();
      await manageTokens.setTokenEnabled(symbol, true);
      await portfolio.gotoHome();
      await portfolio.waitForAssetsLoaded();
      await expect.poll(() => portfolio.getAssetNames()).toContain(name);
    },
  );

  test(
    'As a CORE ext user on the Manage Tokens page, I can add custom tokens',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(180_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();
      await manageTokens.openAddCustom();

      await manageTokens.enterCustomTokenAddress(CUSTOM_TOKEN_ADDRESS);
      await manageTokens.submitCustomToken();

      await expect(manageTokens.successToast()).toBeVisible({
        timeout: 30_000,
      });

      // Submitting returns to the Manage Tokens list.
      await manageTokens.waitForLoaded();
      await expect(manageTokens.pageRoot).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the Manage Tokens page, I can see the message, "Token added!"',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(180_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();
      await manageTokens.openAddCustom();

      await manageTokens.enterCustomTokenAddress(CUSTOM_TOKEN_ADDRESS);
      await manageTokens.submitCustomToken();

      // TestRail wording is "Token added!"; the real success toast reads
      // "Token Added".
      const toast = manageTokens.successToast();
      await expect(toast).toBeVisible({ timeout: 30_000 });
      await expect(toast).toContainText('Token Added');
    },
  );

  test(
    'As a CORE ext user on the Manage Tokens page, I can see the message, "This token is already added."',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: FUNDED_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:MTK-007',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(180_000);
      const portfolio = new PortfolioPage(unlockedExtensionPage);
      const manageTokens = new ManageTokensPage(unlockedExtensionPage);

      await portfolio.waitForAssetsLoaded();
      await manageTokens.openFromPortfolio();
      await manageTokens.openAddCustom();

      await manageTokens.enterCustomTokenAddress(DUPLICATE_TOKEN_ADDRESS);
      await manageTokens.submitCustomToken();

      // TestRail wording is "This token is already added."; the real inline
      // warning reads "Token already exists in the wallet.".
      await expect(manageTokens.addError).toHaveText(DUPLICATE_WARNING, {
        timeout: 30_000,
      });
      await expect(manageTokens.successToast()).toHaveCount(0);
    },
  );
});
