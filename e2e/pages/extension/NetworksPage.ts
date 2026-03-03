import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { CustomNetworkData } from '../../types/networks';

export type { CustomNetworkData } from '../../types/networks';

const DEFAULT_NETWORK_CHAIN_IDS = [
  43114, // Avalanche C-Chain
  4503599627370471, // Avalanche P-Chain
  4503599627370469, // Avalanche X-Chain
  4503599627370475, // Bitcoin
  1, // Ethereum
  4503599627369476, // Solana
];

export class NetworksPage extends BasePage {
  // Navigation
  readonly backButton: Locator;
  readonly networksNavItem: Locator;
  readonly settingsButton: Locator;

  // Networks page elements
  readonly addNetworkButton: Locator;
  readonly emptyState: Locator;
  readonly networksList: Locator;
  readonly networksPage: Locator;
  readonly searchInput: Locator;

  // Tabs
  readonly allNetworksTab: Locator;
  readonly customTab: Locator;

  // Add/Edit network form
  readonly cancelButton: Locator;
  readonly chainIdField: Locator;
  readonly explorerUrlField: Locator;
  readonly networkNameInput: Locator;
  readonly networkNamePrompt: Locator;
  readonly rpcUrlField: Locator;
  readonly saveButton: Locator;
  readonly tokenNameField: Locator;
  readonly tokenSymbolField: Locator;

  // Network detail actions
  readonly deleteButton: Locator;
  readonly editButton: Locator;

  // Custom RPC Headers
  readonly customRpcHeadersLink: Locator;
  readonly rpcHeadersCancelButton: Locator;
  readonly rpcHeadersPage: Locator;
  readonly rpcHeadersSaveButton: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.backButton = page.locator('[data-testid="page-back-button"] svg');
    this.networksNavItem = page.locator('[data-testid="networks-nav-item"]');
    this.settingsButton = page.locator('[data-testid="settings-button"]');

    // Networks page elements
    this.addNetworkButton = page.locator('[data-testid="networks-add-button"]');
    this.emptyState = page.locator('[data-testid="networks-empty-state"]');
    this.networksList = page.locator('[data-testid="networks-list"]');
    this.networksPage = page.locator('[data-testid="networks-page"]');
    this.searchInput = page.locator(
      '[data-testid="networks-search-input"] input',
    );

    // Tabs
    this.allNetworksTab = page.locator('[data-testid="networks-tab-all"]');
    this.customTab = page.locator('[data-testid="networks-tab-custom"]');

    // Add/Edit network form
    this.cancelButton = page.locator(
      '[data-testid="add-network-cancel-button"]',
    );
    this.chainIdField = page.locator('[data-testid="add-network-chain-id"]');
    this.explorerUrlField = page.locator(
      '[data-testid="add-network-explorer-url"]',
    );
    this.networkNameInput = page.locator(
      '[data-testid="add-network-name-input"]',
    );
    this.networkNamePrompt = page.getByRole('button', {
      name: /name this network/i,
    });
    this.rpcUrlField = page.locator('[data-testid="add-network-rpc-url"]');
    this.saveButton = page.locator('[data-testid="add-network-save-button"]');
    this.tokenNameField = page.locator(
      '[data-testid="add-network-token-name"]',
    );
    this.tokenSymbolField = page.locator(
      '[data-testid="add-network-token-symbol"]',
    );

    // Network detail actions
    this.deleteButton = page.locator('[data-testid="network-delete-button"]');
    this.editButton = page.locator('[data-testid="network-edit-button"]');

    // Custom RPC Headers
    this.customRpcHeadersLink = page.locator(
      '[data-testid="custom-rpc-headers-link"]',
    );
    this.rpcHeadersCancelButton = page.locator(
      '[data-testid="rpc-headers-cancel-button"]',
    );
    this.rpcHeadersPage = page.locator('[data-testid="rpc-headers-page"]');
    this.rpcHeadersSaveButton = page.locator(
      '[data-testid="rpc-headers-save-button"]',
    );
  }

  async navigateToNetworks(): Promise<void> {
    await this.settingsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.settingsButton.click();
    await this.networksNavItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.networksNavItem.click();
    await this.networksList.waitFor({ state: 'visible', timeout: 10000 });
  }

  async isOnNetworksPage(): Promise<boolean> {
    return await this.networksPage
      .isVisible({ timeout: 5000 })
      .catch(() => false);
  }

  async navigateToNetworksFromAnyPage(): Promise<void> {
    const isListVisible = await this.networksList
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (isListVisible) return;

    const isNavItemVisible = await this.networksNavItem
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (isNavItemVisible) {
      await this.networksNavItem.click();
      await this.networksList.waitFor({ state: 'visible', timeout: 10000 });
      return;
    }

    const networksText = this.page.locator('h6:text-is("Networks")');
    const isTextVisible = await networksText
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (isTextVisible) {
      await networksText.click();
      await this.networksList.waitFor({ state: 'visible', timeout: 10000 });
      return;
    }

    await this.navigateToNetworks();
  }

  getNetworkItem(chainId: number): Locator {
    return this.page.locator(`[data-testid="network-item-${chainId}"]`);
  }

  getNetworkToggle(chainId: number): Locator {
    return this.page.locator(`[data-testid="network-toggle-${chainId}"]`);
  }

  async isNetworkToggleVisible(chainId: number): Promise<boolean> {
    return await this.getNetworkToggle(chainId)
      .isVisible({ timeout: 2000 })
      .catch(() => false);
  }

  async isNetworkItemVisible(chainId: number): Promise<boolean> {
    return await this.getNetworkItem(chainId)
      .isVisible({ timeout: 2000 })
      .catch(() => false);
  }

  async getDefaultNetworkChainIds(): Promise<number[]> {
    return DEFAULT_NETWORK_CHAIN_IDS;
  }

  async searchForNetwork(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  async getNetworkItemsCount(): Promise<number> {
    await this.networksList.waitFor({ state: 'visible', timeout: 5000 });
    return await this.networksList
      .locator('[data-testid^="network-item-"]')
      .count();
  }

  async isNetworkEnabled(chainId: number): Promise<boolean> {
    const toggle = this.getNetworkToggle(chainId);
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    return await toggle.locator('input').isChecked();
  }

  async toggleNetwork(chainId: number): Promise<void> {
    const toggle = this.getNetworkToggle(chainId);
    await toggle.scrollIntoViewIfNeeded();
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    const input = toggle.locator('input');
    await input.dispatchEvent('click');
    await this.page.waitForTimeout(1000);
  }

  async switchToCustomTab(): Promise<void> {
    await this.customTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToAllNetworksTab(): Promise<void> {
    await this.allNetworksTab.click();
    await this.page.waitForTimeout(500);
  }

  async openAddNetworkForm(): Promise<void> {
    await this.addNetworkButton.click();
    await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  private async fillFormField(
    fieldLocator: Locator,
    value: string,
  ): Promise<void> {
    const prompt = fieldLocator.getByRole('button').first();
    const isPromptVisible = await prompt
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (isPromptVisible) {
      await prompt.click();
    }
    const input = fieldLocator.locator('input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(value);
  }

  async addCustomNetwork(network: CustomNetworkData): Promise<void> {
    await this.openAddNetworkForm();

    await this.networkNamePrompt.click();
    await this.page.waitForTimeout(300);
    await this.networkNameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.networkNameInput.fill(network.name);
    await this.networkNameInput.press('Tab');
    await this.page.waitForTimeout(300);

    await this.fillFormField(this.rpcUrlField, network.rpcUrl);
    await this.fillFormField(this.chainIdField, network.chainId);
    await this.fillFormField(this.tokenSymbolField, network.tokenSymbol);
    await this.fillFormField(this.tokenNameField, network.tokenName);

    if (network.explorerUrl) {
      await this.fillFormField(this.explorerUrlField, network.explorerUrl);
    }

    await this.saveButton.click();
  }

  async isNetworkInList(networkName: string): Promise<boolean> {
    const item = this.networksList.locator(`text=${networkName}`);
    return await item.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async openNetworkDetails(chainId: number): Promise<void> {
    const networkItem = this.getNetworkItem(chainId);
    await networkItem.scrollIntoViewIfNeeded();
    await networkItem.click();
    await this.editButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickEditButton(): Promise<void> {
    await this.editButton.click();
    await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getFieldValue(fieldLocator: Locator): Promise<string> {
    const input = fieldLocator.locator('input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    return await input.inputValue();
  }

  async isFieldReadOnly(fieldLocator: Locator): Promise<boolean> {
    const input = fieldLocator.locator('input');
    const isVisible = await input
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (!isVisible) return true;
    const readOnly = await input.getAttribute('readonly');
    return readOnly !== null;
  }

  async editFormField(fieldLocator: Locator, newValue: string): Promise<void> {
    const input = fieldLocator.locator('input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.click();
    await input.fill(newValue);
  }

  async openCustomRpcHeaders(): Promise<void> {
    await this.customRpcHeadersLink.scrollIntoViewIfNeeded();
    await this.customRpcHeadersLink.click();
    await this.rpcHeadersPage.waitFor({ state: 'visible', timeout: 10000 });
  }

  getRpcHeaderCard(index: number): Locator {
    return this.page.locator(`[data-testid="rpc-header-${index}"]`);
  }

  getRpcHeaderField(index: number): Locator {
    return this.page.locator(`[data-testid="rpc-header-field-${index}"]`);
  }

  async addRpcHeader(
    headerName: string,
    headerValue: string,
    index = 0,
  ): Promise<void> {
    const field = this.getRpcHeaderField(index);
    await field.waitFor({ state: 'visible', timeout: 5000 });

    const prompt = field.getByRole('button', { name: /add next/i });
    const isPromptVisible = await prompt
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (isPromptVisible) {
      await prompt.click();
      await this.page.waitForTimeout(300);
    }

    const inputs = field.locator('input');
    const keyInput = inputs.first();
    await keyInput.waitFor({ state: 'visible', timeout: 5000 });
    await keyInput.click();
    await keyInput.fill(headerName);

    const valueInput = inputs.nth(1);
    await valueInput.click();
    await valueInput.fill(headerValue);
    await this.page.waitForTimeout(300);
  }

  async getRpcHeaderValues(
    index: number,
  ): Promise<{ key: string; value: string }> {
    const field = this.getRpcHeaderField(index);
    const inputs = field.locator('input');
    const key = await inputs.first().inputValue();
    const value = await inputs.nth(1).inputValue();
    return { key, value };
  }

  async saveRpcHeaders(): Promise<void> {
    await this.rpcHeadersSaveButton.waitFor({
      state: 'visible',
      timeout: 5000,
    });
    await this.rpcHeadersSaveButton.click();
  }
}
