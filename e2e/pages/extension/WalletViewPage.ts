/**
 * Wallet View Page - the `/wallet/:walletId` screen reached by clicking a
 * wallet name on the Portfolio page. Shows the wallet balance, the Swap/Send/
 * Receive/Buy actions, and the wallet's accounts with their networks.
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForPortfolioShellReady } from '../../helpers/extensionHelpers';

export class WalletViewPage extends BasePage {
  readonly walletSummaryInfo: Locator;
  readonly walletViewHeader: Locator;
  readonly walletViewBalance: Locator;
  readonly walletAccountsSummary: Locator;
  readonly accountItems: Locator;
  readonly activeAccountIndicator: Locator;
  readonly accountNetworks: Locator;
  readonly swapButton: Locator;
  readonly sendButton: Locator;
  readonly receiveButton: Locator;
  readonly buyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.walletSummaryInfo = page.getByTestId('wallet-summary-info');
    this.walletViewHeader = page.getByTestId('wallet-view-header');
    this.walletViewBalance = page.getByTestId('wallet-view-balance');
    this.walletAccountsSummary = page.getByTestId('wallet-accounts-summary');
    this.accountItems = page.getByTestId('wallet-account-item');
    this.activeAccountIndicator = page.getByTestId(
      'wallet-account-active-indicator',
    );
    this.accountNetworks = page.getByTestId('account-networks');
    this.swapButton = page.getByTestId('swap-nav-button');
    this.sendButton = page.getByTestId('send-nav-button');
    this.receiveButton = page.getByTestId('receive-nav-button');
    this.buyButton = page.getByTestId('buy-nav-button');
  }

  /** Client-side navigation to the Portfolio home (HashRouter), then waits for the shell. */
  async goToPortfolio(): Promise<void> {
    await this.page.evaluate(() => {
      window.location.hash = '#/portfolio';
    });
    await waitForPortfolioShellReady(this.page);
    await this.walletSummaryInfo.waitFor({ state: 'visible', timeout: 15000 });
  }

  /** Opens the wallet view by clicking the wallet name on the Portfolio page. */
  async openFromPortfolio(): Promise<void> {
    await this.walletSummaryInfo.click();
    await this.walletViewBalance.waitFor({ state: 'visible', timeout: 15000 });
  }

  /** The account item at the given position that is NOT the active account. */
  inactiveAccountItem(): Locator {
    return this.accountItems.filter({
      hasNot: this.activeAccountIndicator,
    });
  }
}
