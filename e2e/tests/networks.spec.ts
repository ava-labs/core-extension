import { test, expect } from '../fixtures/extension.fixture';
import { NetworksPage } from '../pages/extension/NetworksPage';
import { MONAD_CHAIN_ID, MONAD_NETWORK } from '../constants';

test.describe('Networks Tests', () => {
  test(
    'As a CORE ext user, I can reach the Networks page, click on the Network button in the upper right corner of Portfolio page',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);

      await networksPage.navigateToNetworks();

      const isOnPage = await networksPage.isOnNetworksPage();
      expect(isOnPage).toBe(true);

      await expect(networksPage.networksList).toBeVisible();
      await expect(networksPage.searchInput).toBeVisible();
      await expect(networksPage.addNetworkButton).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the Network page, the Avalanche CXP, Bitcoin, Ethereum, and Solana networks should not be toggleable (enabled/disabled). Also, I can see "All networks" and "Custom" buttons at the bottom',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);

      await networksPage.navigateToNetworks();

      const defaultChainIds = await networksPage.getDefaultNetworkChainIds();

      for (const chainId of defaultChainIds) {
        const itemVisible = await networksPage.isNetworkItemVisible(chainId);
        expect(itemVisible).toBe(true);

        const toggleVisible =
          await networksPage.isNetworkToggleVisible(chainId);
        expect(toggleVisible).toBe(false);
      }

      await expect(networksPage.allNetworksTab).toBeVisible();
      await expect(networksPage.customTab).toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the Network page, I can search for networks',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);

      await networksPage.navigateToNetworks();

      const totalCount = await networksPage.getNetworkItemsCount();
      expect(totalCount).toBeGreaterThan(0);

      await networksPage.searchForNetwork('Ethereum');

      const filteredCount = await networksPage.getNetworkItemsCount();
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThan(totalCount);

      const ethVisible = await networksPage.isNetworkItemVisible(1);
      expect(ethVisible).toBe(true);

      await networksPage.searchForNetwork('NonExistentNetworkXYZ999');

      await expect(networksPage.emptyState).toBeVisible();

      await networksPage.clearSearch();

      await expect
        .poll(() => networksPage.getNetworkItemsCount(), { timeout: 10000 })
        .toBe(totalCount);
    },
  );

  test(
    'As a CORE ext user on the Network page, I can enable/disable a network',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);
      const arbitrumChainId = 42161;

      await networksPage.navigateToNetworks();

      const toggleVisible =
        await networksPage.isNetworkToggleVisible(arbitrumChainId);
      expect(toggleVisible).toBe(true);

      const initialState = await networksPage.isNetworkEnabled(arbitrumChainId);

      await networksPage.toggleNetwork(arbitrumChainId);

      await expect
        .poll(() => networksPage.isNetworkEnabled(arbitrumChainId), {
          timeout: 10000,
        })
        .toBe(!initialState);

      await networksPage.toggleNetwork(arbitrumChainId);

      await expect
        .poll(() => networksPage.isNetworkEnabled(arbitrumChainId), {
          timeout: 10000,
        })
        .toBe(initialState);
    },
  );

  test(
    'As a CORE ext user on the Network page, I can add custom networks',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);

      await networksPage.navigateToNetworks();

      const initialCount = await networksPage.getNetworkItemsCount();

      await networksPage.addCustomNetwork(MONAD_NETWORK);

      await unlockedExtensionPage.waitForTimeout(2000);
      await networksPage.navigateToNetworksFromAnyPage();

      await expect
        .poll(() => networksPage.getNetworkItemsCount(), { timeout: 10000 })
        .toBe(initialCount + 1);

      const monadVisible = await networksPage.isNetworkInList(
        MONAD_NETWORK.name,
      );
      expect(monadVisible).toBe(true);

      await networksPage.switchToCustomTab();

      const customNetworkVisible = await networksPage.isNetworkInList(
        MONAD_NETWORK.name,
      );
      expect(customNetworkVisible).toBe(true);
    },
  );

  test(
    'As a CORE ext user on the Network page, I can edit custom network attributes except Chain ID',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetMonadNetworkExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);
      await networksPage.navigateToNetworks();

      await networksPage.openNetworkDetails(MONAD_CHAIN_ID);

      await networksPage.clickEditButton();

      const chainIdReadOnly = await networksPage.isFieldReadOnly(
        networksPage.chainIdField,
      );
      expect(chainIdReadOnly).toBe(true);

      const rpcUrlReadOnly = await networksPage.isFieldReadOnly(
        networksPage.rpcUrlField,
      );
      expect(rpcUrlReadOnly).toBe(false);

      const tokenSymbolReadOnly = await networksPage.isFieldReadOnly(
        networksPage.tokenSymbolField,
      );
      expect(tokenSymbolReadOnly).toBe(false);

      const tokenNameReadOnly = await networksPage.isFieldReadOnly(
        networksPage.tokenNameField,
      );
      expect(tokenNameReadOnly).toBe(false);

      const explorerUrlReadOnly = await networksPage.isFieldReadOnly(
        networksPage.explorerUrlField,
      );
      expect(explorerUrlReadOnly).toBe(false);

      const originalRpcUrl = await networksPage.getFieldValue(
        networksPage.rpcUrlField,
      );
      const originalTokenSymbol = await networksPage.getFieldValue(
        networksPage.tokenSymbolField,
      );
      const originalTokenName = await networksPage.getFieldValue(
        networksPage.tokenNameField,
      );
      const originalExplorerUrl = await networksPage.getFieldValue(
        networksPage.explorerUrlField,
      );

      const updatedRpcUrl = 'https://rpc-updated.monad.xyz';
      const updatedTokenSymbol = 'MNAD';
      const updatedTokenName = 'Monad Token';
      const updatedExplorerUrl = 'https://explorer.monad.xyz';

      await networksPage.editFormField(networksPage.rpcUrlField, updatedRpcUrl);
      await networksPage.editFormField(
        networksPage.tokenSymbolField,
        updatedTokenSymbol,
      );
      await networksPage.editFormField(
        networksPage.tokenNameField,
        updatedTokenName,
      );
      await networksPage.editFormField(
        networksPage.explorerUrlField,
        updatedExplorerUrl,
      );

      await networksPage.saveButton.click();

      const confirmSaveButton = unlockedExtensionPage
        .getByRole('button', { name: 'Save' })
        .last();
      const hasConfirmDialog = await confirmSaveButton
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (hasConfirmDialog) {
        await confirmSaveButton.click();
      }

      await networksPage.editButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await networksPage.clickEditButton();

      await expect
        .poll(() => networksPage.getFieldValue(networksPage.rpcUrlField), {
          timeout: 10000,
        })
        .toBe(updatedRpcUrl);

      expect(
        await networksPage.getFieldValue(networksPage.tokenSymbolField),
      ).toBe(updatedTokenSymbol);

      expect(
        await networksPage.getFieldValue(networksPage.tokenNameField),
      ).toBe(updatedTokenName);

      expect(
        await networksPage.getFieldValue(networksPage.explorerUrlField),
      ).toBe(updatedExplorerUrl);

      await networksPage.editFormField(
        networksPage.rpcUrlField,
        originalRpcUrl,
      );
      await networksPage.editFormField(
        networksPage.tokenSymbolField,
        originalTokenSymbol,
      );
      await networksPage.editFormField(
        networksPage.tokenNameField,
        originalTokenName,
      );
      await networksPage.editFormField(
        networksPage.explorerUrlField,
        originalExplorerUrl,
      );
      await networksPage.saveButton.click();

      const confirmRevertButton = unlockedExtensionPage
        .getByRole('button', { name: 'Save' })
        .last();
      const hasRevertDialog = await confirmRevertButton
        .isVisible({ timeout: 3000 })
        .catch(() => false);
      if (hasRevertDialog) {
        await confirmRevertButton.click();
      }
    },
  );

  test(
    'As a CORE ext user on the Network page, I can add/edit a Custom RPC header for custom and default networks',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetMonadNetworkExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-007',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);
      const ethereumChainId = 1;

      // --- Custom network: Monad ---
      await networksPage.navigateToNetworks();
      await networksPage.openNetworkDetails(MONAD_CHAIN_ID);
      await networksPage.openCustomRpcHeaders();

      await networksPage.addRpcHeader('Authorization', 'Bearer test-token');

      await networksPage.saveRpcHeaders();

      await networksPage.editButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await networksPage.openCustomRpcHeaders();

      const savedHeader = await networksPage.getRpcHeaderValues(0);
      expect(savedHeader.key).toBe('Authorization');
      expect(savedHeader.value).toBe('Bearer test-token');

      await networksPage.backButton.click();
      await networksPage.editButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });
      await networksPage.backButton.click();
      await networksPage.networksList.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      // --- Default network: Ethereum ---
      await networksPage.openNetworkDetails(ethereumChainId);
      await networksPage.openCustomRpcHeaders();

      await networksPage.addRpcHeader('X-Custom-Header', 'eth-value-123');

      await networksPage.saveRpcHeaders();

      await networksPage.editButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await networksPage.openCustomRpcHeaders();

      const ethHeader = await networksPage.getRpcHeaderValues(0);
      expect(ethHeader.key).toBe('X-Custom-Header');
      expect(ethHeader.value).toBe('eth-value-123');
    },
  );

  test(
    'As a CORE ext user on the Network page, I can only edit the default network, RPC URL and Custom RPC Header attributes',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-008',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);
      const ethereumChainId = 1;

      await networksPage.navigateToNetworks();
      await networksPage.openNetworkDetails(ethereumChainId);
      await networksPage.clickEditButton();

      // RPC URL should be editable for default networks
      const rpcUrlReadOnly = await networksPage.isFieldReadOnly(
        networksPage.rpcUrlField,
      );
      expect(rpcUrlReadOnly).toBe(false);

      // All other form fields should be read-only
      const chainIdReadOnly = await networksPage.isFieldReadOnly(
        networksPage.chainIdField,
      );
      expect(chainIdReadOnly).toBe(true);

      const tokenSymbolReadOnly = await networksPage.isFieldReadOnly(
        networksPage.tokenSymbolField,
      );
      expect(tokenSymbolReadOnly).toBe(true);

      const tokenNameReadOnly = await networksPage.isFieldReadOnly(
        networksPage.tokenNameField,
      );
      expect(tokenNameReadOnly).toBe(true);

      const explorerUrlReadOnly = await networksPage.isFieldReadOnly(
        networksPage.explorerUrlField,
      );
      expect(explorerUrlReadOnly).toBe(true);

      const _originalRpcUrl = await networksPage.getFieldValue(
        networksPage.rpcUrlField,
      );
      const updatedRpcUrl = 'https://eth-rpc-updated.example.com';
      await networksPage.editFormField(networksPage.rpcUrlField, updatedRpcUrl);

      await expect
        .poll(() => networksPage.getFieldValue(networksPage.rpcUrlField), {
          timeout: 10000,
        })
        .toBe(updatedRpcUrl);

      // Cancel to discard changes and go back to detail view
      await networksPage.cancelButton.click();
      await networksPage.editButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      // Custom RPC Headers should be accessible and editable
      await networksPage.openCustomRpcHeaders();

      await networksPage.addRpcHeader('X-Api-Key', 'default-net-key');
      await networksPage.saveRpcHeaders();

      await networksPage.editButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await networksPage.openCustomRpcHeaders();

      const header = await networksPage.getRpcHeaderValues(0);
      expect(header.key).toBe('X-Api-Key');
      expect(header.value).toBe('default-net-key');
    },
  );

  test(
    'As a CORE ext user on the Network page, I can delete custom networks',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetMonadNetworkExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-009',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);
      await networksPage.navigateToNetworks();

      const monadItem = networksPage.getNetworkItem(MONAD_CHAIN_ID);
      await monadItem.scrollIntoViewIfNeeded();
      await expect(monadItem).toBeVisible();

      await networksPage.openNetworkDetails(MONAD_CHAIN_ID);

      await expect(networksPage.deleteButton).toBeVisible();
      await networksPage.deleteButton.click();

      const confirmDeleteButton = unlockedExtensionPage.getByRole('button', {
        name: 'Delete',
      });
      await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
      await confirmDeleteButton.click();

      await networksPage.networksList.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await expect(
        networksPage.getNetworkItem(MONAD_CHAIN_ID),
      ).not.toBeVisible();

      await networksPage.switchToCustomTab();
      await unlockedExtensionPage.waitForTimeout(500);

      await expect(
        networksPage.getNetworkItem(MONAD_CHAIN_ID),
      ).not.toBeVisible();
    },
  );

  test(
    'As a CORE ext user on the Network page, when I disable any network, I should not see these network tokens in the Portfolio page',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetMonadNetworkExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NET-010',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const networksPage = new NetworksPage(unlockedExtensionPage);

      const manageButton = unlockedExtensionPage.getByRole('button', {
        name: 'Manage',
      });
      await manageButton.waitFor({ state: 'visible', timeout: 15000 });
      await manageButton.click();

      const manageTokensPage = unlockedExtensionPage.locator(
        '[data-testid="manage-tokens-page"]',
      );
      await manageTokensPage.waitFor({ state: 'visible', timeout: 10000 });

      const monToken = unlockedExtensionPage.getByText('MON', { exact: true });
      await expect(monToken.first()).toBeVisible({ timeout: 10000 });

      await networksPage.backButton.click();
      await unlockedExtensionPage.waitForTimeout(1000);

      await networksPage.navigateToNetworks();

      const isEnabled = await networksPage.isNetworkEnabled(MONAD_CHAIN_ID);
      expect(isEnabled).toBe(true);

      await networksPage.toggleNetwork(MONAD_CHAIN_ID);

      await expect
        .poll(() => networksPage.isNetworkEnabled(MONAD_CHAIN_ID), {
          timeout: 10000,
        })
        .toBe(false);

      await networksPage.backButton.click();
      await unlockedExtensionPage.waitForTimeout(500);
      await networksPage.backButton.click();
      await unlockedExtensionPage.waitForTimeout(1000);

      await manageButton.waitFor({ state: 'visible', timeout: 15000 });
      await manageButton.click();

      await manageTokensPage.waitFor({ state: 'visible', timeout: 10000 });

      await expect(monToken).not.toBeVisible({ timeout: 10000 });
    },
  );
});
