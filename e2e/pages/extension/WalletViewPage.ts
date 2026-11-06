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
  readonly networkAvatars: Locator;
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
    this.networkAvatars = page.getByTestId('account-network-avatar');
    this.swapButton = page.getByTestId('swap-nav-button');
    this.sendButton = page.getByTestId('send-nav-button');
    this.receiveButton = page.getByTestId('receive-nav-button');
    this.buyButton = page.getByTestId('buy-nav-button');
  }

  async waitForPortfolio(): Promise<void> {
    await waitForPortfolioShellReady(this.page);
    await this.walletSummaryInfo.waitFor({ state: 'visible', timeout: 15000 });
  }

  async goToPortfolio(): Promise<void> {
    await this.page.evaluate(() => {
      window.location.hash = '#/portfolio';
    });
    await this.waitForPortfolio();
  }

  async openFromPortfolio(): Promise<void> {
    await this.walletSummaryInfo.click();
    await this.walletViewBalance.waitFor({ state: 'visible', timeout: 15000 });
  }
}
