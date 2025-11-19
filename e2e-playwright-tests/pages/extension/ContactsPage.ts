/**
 * Contacts Page - Manage wallet contacts
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactsPage extends BasePage {
  // Locators
  readonly contactsPageTitle: Locator;
  readonly addContactButton: Locator;
  readonly searchContactInput: Locator;
  readonly emptyStateMessage: Locator;
  readonly noSearchResultsMessage: Locator;
  readonly contactsList: Locator;
  readonly contactListItem: Locator;

  // Add/Edit Contact Modal
  readonly contactModal: Locator;
  readonly contactNameInput: Locator;
  readonly avalancheCChainInput: Locator;
  readonly avalancheXPInput: Locator;
  readonly bitcoinAddressInput: Locator;
  readonly solanaAddressInput: Locator;
  readonly saveContactButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteContactButton: Locator;

  // Contact Details View
  readonly contactDetailsModal: Locator;
  readonly contactDetailsName: Locator;
  readonly contactDetailsAvalancheCChain: Locator;
  readonly contactDetailsAvalancheXP: Locator;
  readonly contactDetailsBitcoin: Locator;
  readonly contactDetailsSolana: Locator;
  readonly copyAddressButton: Locator;
  readonly editContactButton: Locator;
  readonly closeDetailsButton: Locator;

  constructor(page: Page) {
    super(page);
    // Main page elements
    this.contactsPageTitle = page.getByRole('heading', { name: /contacts/i });
    this.addContactButton = page.getByRole('button', { name: /add an address|add contact|new contact|\+/i });
    this.searchContactInput = page.locator('[data-testid="contact-search-input"], input[placeholder*="Search" i]');
    this.emptyStateMessage = page.locator('[data-testid="contacts-empty-state"], text=/no saved addresses/i');
    this.noSearchResultsMessage = page.locator(
      '[data-testid="no-search-results"], text=/no contacts match your search/i',
    );
    this.contactsList = page.locator('[data-testid="contacts-list"]');
    this.contactListItem = page.locator('[data-testid="contact-item"]');

    // Add/Edit Contact Modal
    this.contactModal = page.locator('[data-testid="contact-modal"], [role="dialog"]');
    this.contactNameInput = page.locator('[data-testid="contact-name-input"], input[name="name"]');
    this.avalancheCChainInput = page.locator(
      '[data-testid="avalanche-c-chain-input"], input[name*="avalanche" i][name*="c" i], input[placeholder*="avalanche" i][placeholder*="c-chain" i]',
    );
    this.avalancheXPInput = page.locator(
      '[data-testid="avalanche-xp-input"], input[name*="avalanche" i][name*="xp" i], input[placeholder*="avalanche" i][placeholder*="x/p" i]',
    );
    this.bitcoinAddressInput = page.locator(
      '[data-testid="bitcoin-address-input"], input[name*="bitcoin" i], input[placeholder*="bitcoin" i]',
    );
    this.solanaAddressInput = page.locator(
      '[data-testid="solana-address-input"], input[name*="solana" i], input[placeholder*="solana" i]',
    );
    this.saveContactButton = page.getByRole('button', { name: /save|add contact/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.deleteContactButton = page.getByRole('button', { name: /delete/i });

    // Contact Details View
    this.contactDetailsModal = page.locator('[data-testid="contact-details-modal"]');
    this.contactDetailsName = page.locator('[data-testid="contact-details-name"]');
    // Contact details addresses - find by text content or data-testid
    this.contactDetailsAvalancheCChain = page.locator(
      '[data-testid="contact-details-avalanche-c"], div:has-text("0x"), div:has-text(/Avalanche C-Chain/i)',
    );
    this.contactDetailsAvalancheXP = page.locator(
      '[data-testid="contact-details-avalanche-xp"], div:has-text("avax"), div:has-text(/Avalanche X/P-Chain/i)',
    );
    this.contactDetailsBitcoin = page.locator(
      '[data-testid="contact-details-bitcoin"], div:has-text("bc1"), div:has-text(/Bitcoin/i)',
    );
    this.contactDetailsSolana = page.locator('[data-testid="contact-details-solana"], div:has-text(/Solana/i)');
    this.copyAddressButton = page.getByRole('button', { name: /copy/i });
    this.editContactButton = page.getByRole('button', { name: /edit/i });
    this.closeDetailsButton = page.getByRole('button', { name: /close|back/i });
  }

  /**
   * Navigate to contacts page
   * Steps: Portfolio page → Settings button → Saved addresses option
   */
  async navigateToContacts(): Promise<void> {
    // Fast URL check - if already on contacts page, return immediately
    const currentUrl = this.page.url();
    if (currentUrl.includes('/contacts/list')) {
      return;
    }

    const settingsButton = this.page.locator('[data-testid="settings-button"]');

    // Quick check if Settings button is already visible (1 second max)
    const isVisible = await settingsButton.isVisible({ timeout: 1000 }).catch(() => false);

    if (!isVisible) {
      // Settings button not visible, navigate to home if needed
      if (!currentUrl.includes('popup.html#/home') && !currentUrl.includes('home.html#/home')) {
        await this.goto('popup.html#/home');
      }

      // Wait for page to load after navigation
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
    }

    // Wait for Settings button to be visible and clickable
    await settingsButton.waitFor({ state: 'visible', timeout: 15000 });
    await settingsButton.click({ timeout: 10000 });

    // Wait for settings menu and click "Saved addresses"
    const savedAddressesOption = this.page.getByText('Saved addresses', { exact: false });
    await savedAddressesOption.waitFor({ state: 'visible', timeout: 10000 });
    await savedAddressesOption.scrollIntoViewIfNeeded();
    await savedAddressesOption.click();

    // Wait for contacts page to load
    await Promise.race([
      this.contactsPageTitle.waitFor({ state: 'visible', timeout: 10000 }),
      this.page.waitForURL('**/contacts/list', { timeout: 10000 }),
    ]);
  }

  /**
   * Check if we're on the contacts page
   */
  async isOnContactsPage(): Promise<boolean> {
    // Check URL first (most reliable)
    const currentUrl = this.page.url();
    if (currentUrl.includes('/contacts/list')) {
      return true;
    }

    // Fallback: check for contacts page title or "Contacts" text
    const hasTitle = await this.isVisible(this.contactsPageTitle).catch(() => false);
    if (hasTitle) {
      return true;
    }

    // Also check for "Contacts" text on the page
    const contactsText = this.page.locator('text=/contacts/i').first();
    return await contactsText.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Check if empty state is displayed
   */
  async isEmptyStateVisible(): Promise<boolean> {
    const emptyState = this.page.locator('[data-testid="contacts-empty-state"]');
    return await emptyState.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Add a new contact with all address types
   */
  async addContact(contactData: {
    name: string;
    avalancheCChain?: string;
    avalancheXP?: string;
    bitcoin?: string;
    solana?: string;
  }): Promise<void> {
    // Click "Add an address" button
    await this.clickElement(this.addContactButton);

    // Wait for the add contact page to load - wait for "Name this contact" button
    const nameContactButton = this.page.getByRole('button', { name: /name this contact/i });
    await nameContactButton.waitFor({ state: 'visible', timeout: 10000 });
    await nameContactButton.click();

    // Wait for name input to appear and fill it
    const nameInput = this.page.locator('input[type="text"], input[name="name"], input').first();
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill(contactData.name);

    // Add Avalanche C-Chain address if provided
    if (contactData.avalancheCChain) {
      const addCChainButton = this.page.getByRole('button', { name: /add avalanche c-chain address/i });
      await addCChainButton.waitFor({ state: 'visible', timeout: 5000 });
      await addCChainButton.click();
      // Wait for input to appear - try multiple selectors
      const cChainInput = this.page.locator('input[type="text"]').last();
      await cChainInput.waitFor({ state: 'visible', timeout: 5000 });
      await cChainInput.fill(contactData.avalancheCChain);
    }

    // Add Avalanche X/P-Chain address if provided
    if (contactData.avalancheXP) {
      const addXPButton = this.page.getByRole('button', { name: /add avalanche x\/p-chain address/i });
      await addXPButton.waitFor({ state: 'visible', timeout: 5000 });
      await addXPButton.click();
      // Wait for input to appear
      const xpInput = this.page.locator('input[type="text"]').last();
      await xpInput.waitFor({ state: 'visible', timeout: 5000 });
      await xpInput.fill(contactData.avalancheXP);
    }

    // Add Bitcoin address if provided
    if (contactData.bitcoin) {
      const addBitcoinButton = this.page.getByRole('button', { name: /add bitcoin address/i });
      await addBitcoinButton.waitFor({ state: 'visible', timeout: 5000 });
      await addBitcoinButton.click();
      // Wait for input to appear
      const bitcoinInput = this.page.locator('input[type="text"]').last();
      await bitcoinInput.waitFor({ state: 'visible', timeout: 5000 });
      await bitcoinInput.fill(contactData.bitcoin);
    }

    // Add Solana address if provided
    if (contactData.solana) {
      const addSolanaButton = this.page.getByRole('button', { name: /add solana address/i });
      await addSolanaButton.waitFor({ state: 'visible', timeout: 5000 });
      await addSolanaButton.click();
      // Wait for input to appear
      const solanaInput = this.page.locator('input[type="text"]').last();
      await solanaInput.waitFor({ state: 'visible', timeout: 5000 });
      await solanaInput.fill(contactData.solana);
    }

    // Click save button
    await this.clickElement(this.saveContactButton);

    // Wait for "Contact created" message to appear
    const successMessage = this.page.locator('text=/contact created/i');
    await successMessage.waitFor({ state: 'visible', timeout: 10000 });

    // Navigate back to contacts list using back button
    await this.navigateBackToContactsList();
  }

  /**
   * Search for a contact
   */
  async searchContact(searchTerm: string): Promise<void> {
    await this.searchContactInput.fill(searchTerm);
    // Wait for search results to update - wait for contact list or empty state to update
    await Promise.race([
      this.page
        .locator('div[role="button"]')
        .first()
        .waitFor({ state: 'visible', timeout: 3000 })
        .catch(() => {}),
      this.page
        .locator('text=/no saved addresses|no contacts match/i')
        .first()
        .waitFor({ state: 'visible', timeout: 3000 })
        .catch(() => {}),
      this.page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {}),
    ]);
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    await this.searchContactInput.clear();
    // Wait for search to clear - wait for contact list to update
    await Promise.race([
      this.page
        .locator('div[role="button"]')
        .first()
        .waitFor({ state: 'visible', timeout: 3000 })
        .catch(() => {}),
      this.page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {}),
    ]);
  }

  /**
   * Get list of visible contacts
   */
  async getVisibleContacts(): Promise<Locator[]> {
    await this.contactListItem
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    return await this.contactListItem.all();
  }

  /**
   * Get contact count
   */
  async getContactCount(): Promise<number> {
    // Check if empty state is visible
    if (await this.isEmptyStateVisible()) {
      return 0;
    }

    // Get search term if present
    const searchInputValue = await this.searchContactInput.inputValue().catch(() => '');
    const searchTermLower = searchInputValue.trim().toLowerCase();
    const hasSearchTerm = searchTermLower.length > 0;

    // Count visible contact items (div[role="button"] elements containing addresses)
    const contactItems = this.page.locator('div[role="button"]');
    const allItems = await contactItems.all();

    let count = 0;
    for (const item of allItems) {
      const isVisible = await item.isVisible().catch(() => false);
      if (!isVisible) continue;

      const text = await item.textContent().catch(() => '');
      if (!text) continue;

      // Only count items that contain crypto addresses
      const hasAddress = text.includes('0x') || text.includes('avax') || text.includes('bc1');
      if (!hasAddress) continue;

      // If there's a search term, only count matching contacts
      if (hasSearchTerm) {
        if (text.toLowerCase().includes(searchTermLower)) {
          count++;
        }
      } else {
        count++;
      }
    }

    return count;
  }

  /**
   * Click on a contact by name
   */
  async clickContactByName(contactName: string): Promise<void> {
    // Contact items are div[role="button"] elements that contain the contact name
    const contactItem = this.page.locator(`div[role="button"]:has-text("${contactName}")`);
    await this.clickElement(contactItem);
  }

  /**
   * View contact details
   */
  async viewContactDetails(contactName: string): Promise<void> {
    await this.clickContactByName(contactName);

    // Check if we navigated to a details page
    const currentUrl = this.page.url();
    if (currentUrl.includes('/contacts/details')) {
      // Navigated to details page, wait for it to load
      await this.page.waitForLoadState('domcontentloaded');
      // Wait for contact name to be visible
      await this.contactDetailsName.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    } else {
      // Try waiting for modal
      await this.contactDetailsModal.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        // If modal not found, wait for contact name instead
        return this.contactDetailsName.waitFor({ state: 'visible', timeout: 5000 });
      });
    }
  }

  /**
   * Edit an existing contact
   */
  async editContact(
    currentName: string,
    updatedData: {
      name?: string;
      avalancheCChain?: string;
      avalancheXP?: string;
      bitcoin?: string;
      solana?: string;
    },
  ): Promise<void> {
    await this.viewContactDetails(currentName);

    // Wait for details page to load - wait for contact name to be visible
    await this.contactDetailsName.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // Click on each chain label to expand addresses if needed
    const chainLabels = ['Avalanche C-Chain', 'Avalanche X/P-Chain', 'Bitcoin', 'Solana'];
    for (let i = 0; i < chainLabels.length; i++) {
      const label = chainLabels[i];
      const labelElement = this.page.getByText(label, { exact: false }).first();
      await labelElement.waitFor({ state: 'visible', timeout: 5000 });
      await labelElement.click();

      // After clicking the last label, click elsewhere to validate addresses
      if (i === chainLabels.length - 1) {
        const contactNameElement = this.page.getByText(currentName, { exact: false }).first();
        const nameVisible = await contactNameElement.isVisible({ timeout: 500 }).catch(() => false);
        if (nameVisible) {
          await contactNameElement.click();
        } else {
          await this.page.click('body', { position: { x: 10, y: 10 } });
        }
        // Wait for input fields to appear after clicking
        await this.page
          .locator('input')
          .first()
          .waitFor({ state: 'visible', timeout: 3000 })
          .catch(() => {});
      }
    }

    // Wait for input fields to appear (page is already in edit mode)
    await this.page.locator('input').first().waitFor({ state: 'visible', timeout: 3000 });

    // Step 1: Edit contact name first
    if (updatedData.name !== undefined) {
      const nameInput = this.page.locator('input').nth(0);
      await nameInput.waitFor({ state: 'visible', timeout: 3000 });
      await nameInput.click();
      await nameInput.clear(); // Remove existing value
      await nameInput.fill(updatedData.name); // Add new value
    }

    // Step 2: Edit token addresses (remove existing value and add new one)
    if (updatedData.avalancheCChain !== undefined) {
      const cChainInput = this.page.locator('input').nth(1);
      await cChainInput.waitFor({ state: 'visible', timeout: 3000 });
      await cChainInput.click();
      await cChainInput.clear(); // Remove existing value
      await cChainInput.fill(updatedData.avalancheCChain); // Add new value
    }

    if (updatedData.avalancheXP !== undefined) {
      const xpInput = this.page.locator('input').nth(2);
      await xpInput.waitFor({ state: 'visible', timeout: 3000 });
      await xpInput.click();
      await xpInput.clear(); // Remove existing value
      await xpInput.fill(updatedData.avalancheXP); // Add new value
    }

    if (updatedData.bitcoin !== undefined) {
      const bitcoinInput = this.page.locator('input').nth(3);
      await bitcoinInput.waitFor({ state: 'visible', timeout: 3000 });
      await bitcoinInput.click();
      await bitcoinInput.clear(); // Remove existing value
      await bitcoinInput.fill(updatedData.bitcoin); // Add new value
    }

    if (updatedData.solana !== undefined) {
      const solanaInput = this.page.locator('input').nth(4);
      await solanaInput.waitFor({ state: 'visible', timeout: 3000 });
      await solanaInput.click();
      await solanaInput.clear(); // Remove existing value
      await solanaInput.fill(updatedData.solana); // Add new value
    }

    // Click save button
    await this.clickElement(this.saveContactButton);

    // Wait for "Contact updated" message to appear
    const successMessage = this.page.locator('text=/contact updated/i');
    await successMessage.waitFor({ state: 'visible', timeout: 10000 });

    // Navigate back to contacts list using back button
    await this.navigateBackToContactsList();
  }

  /**
   * Delete a contact
   */
  async deleteContact(contactName: string): Promise<void> {
    await this.viewContactDetails(contactName);

    // Click delete button on contact details page
    await this.deleteContactButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.deleteContactButton.click();

    // Wait for and click confirm delete button on confirmation page
    const confirmDeleteButton = this.page.locator('[data-testid="confirm-delete-contact-button"]');
    await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmDeleteButton.click();

    // Verify navigation back to contacts list using URL (delete automatically navigates back)
    await this.page.waitForURL('**/contacts/list', { timeout: 10000 }).catch(() => {
      // If URL check fails, verify by checking for contacts list page element
      return this.page.locator('[data-testid="contacts-list-page"]').waitFor({ state: 'visible', timeout: 5000 });
    });
  }

  /**
   * Copy address from contact details
   */
  async copyAddressFromDetails(addressType: 'avalancheCChain' | 'avalancheXP' | 'bitcoin' | 'solana'): Promise<void> {
    let addressLocator: Locator;

    switch (addressType) {
      case 'avalancheCChain':
        addressLocator = this.contactDetailsAvalancheCChain;
        break;
      case 'avalancheXP':
        addressLocator = this.contactDetailsAvalancheXP;
        break;
      case 'bitcoin':
        addressLocator = this.contactDetailsBitcoin;
        break;
      case 'solana':
        addressLocator = this.contactDetailsSolana;
        break;
    }

    // Find the copy button associated with this address
    const copyButton = addressLocator.locator('..').getByRole('button', { name: /copy/i });
    await this.clickElement(copyButton);
  }

  /**
   * Get contact details from the details modal
   */
  async getContactDetailsFromModal(): Promise<{
    name: string;
    avalancheCChain: string;
    avalancheXP: string;
    bitcoin: string;
    solana: string;
  }> {
    return {
      name: await this.getText(this.contactDetailsName),
      avalancheCChain: await this.getText(this.contactDetailsAvalancheCChain),
      avalancheXP: await this.getText(this.contactDetailsAvalancheXP),
      bitcoin: await this.getText(this.contactDetailsBitcoin),
      solana: await this.getText(this.contactDetailsSolana),
    };
  }

  /**
   * Check if no search results message is displayed
   */
  async isNoSearchResultsVisible(): Promise<boolean> {
    // Check if there's an active search term
    const searchInputValue = await this.searchContactInput.inputValue().catch(() => '');
    const hasSearchTerm = searchInputValue.trim().length > 0;

    if (!hasSearchTerm) {
      return false;
    }

    // If there's a search term and no contacts found, that means search returned no results
    const contactCount = await this.getContactCount();
    return contactCount === 0;
  }

  /**
   * Close contact details modal
   */
  async closeContactDetails(): Promise<void> {
    await this.clickElement(this.closeDetailsButton);
    await this.contactDetailsModal.waitFor({ state: 'hidden', timeout: 5000 });
  }

  /**
   * Get locator for Avalanche C-Chain address field
   */
  getAvalancheCChainAddressLocator(): Locator {
    return this.page.locator('[data-testid="contact-address-c-chain"]');
  }

  /**
   * Get locator for Avalanche X/P-Chain address field
   */
  getAvalancheXPAddressLocator(): Locator {
    return this.page.locator('[data-testid="contact-address-xp-chain"]');
  }

  /**
   * Get locator for Bitcoin address field
   */
  getBitcoinAddressLocator(): Locator {
    return this.page.locator('[data-testid="contact-address-bitcoin"]');
  }

  /**
   * Get locator for Solana address field
   */
  getSolanaAddressLocator(): Locator {
    return this.page.locator('[data-testid="contact-address-solana"]');
  }

  /**
   * Ensure a contact exists, creating it if it doesn't
   */
  async ensureContactExists(contactData: {
    name: string;
    avalancheCChain?: string;
    avalancheXP?: string;
    bitcoin?: string;
    solana?: string;
  }): Promise<void> {
    const contactCount = await this.getContactCount();
    if (contactCount === 0) {
      await this.addContact(contactData);
    } else {
      // Check if contact with this name exists
      const contactItem = this.page.locator(`text="${contactData.name}"`);
      const exists = await contactItem.isVisible({ timeout: 2000 }).catch(() => false);
      if (!exists) {
        await this.addContact(contactData);
      }
    }
  }

  /**
   * Expand addresses in contact details by clicking chain labels
   */
  async expandAddressesInDetails(contactName: string): Promise<void> {
    // Wait for contact name to be visible first
    await this.contactDetailsName.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const chainLabels = ['Avalanche C-Chain', 'Avalanche X/P-Chain', 'Bitcoin', 'Solana'];

    for (let i = 0; i < chainLabels.length; i++) {
      const label = chainLabels[i];
      const labelElement = this.page.getByText(label, { exact: false }).first();
      await labelElement.waitFor({ state: 'visible', timeout: 5000 });
      await labelElement.click();

      // After clicking the last label, click elsewhere to validate addresses
      if (i === chainLabels.length - 1) {
        const contactNameElement = this.page.getByText(contactName, { exact: false }).first();
        const nameVisible = await contactNameElement.isVisible({ timeout: 500 }).catch(() => false);
        if (nameVisible) {
          await contactNameElement.click();
        } else {
          await this.page.click('body', { position: { x: 10, y: 10 } });
        }
        // Wait for input fields to appear
        await this.page
          .locator('input')
          .first()
          .waitFor({ state: 'visible', timeout: 3000 })
          .catch(() => {});
      }
    }
    // Wait for all input fields to be ready
    await this.page.locator('input').first().waitFor({ state: 'visible', timeout: 3000 });
  }

  /**
   * Hover over chain labels to reveal copy buttons
   */
  async hoverOverChainLabels(): Promise<void> {
    const chainLabels = ['Avalanche C-Chain', 'Avalanche X/P-Chain', 'Bitcoin', 'Solana'];
    for (const label of chainLabels) {
      const labelElement = this.page.getByText(label, { exact: false }).first();
      await labelElement.waitFor({ state: 'visible', timeout: 5000 });
      await labelElement.hover();
      // Wait for copy button to appear after hover
      await this.page
        .getByRole('button', { name: /copy/i })
        .first()
        .waitFor({ state: 'visible', timeout: 2000 })
        .catch(() => {});
    }
  }

  /**
   * Verify a contact is visible in the list
   */
  async verifyContactVisible(contactName: string, timeout = 10000): Promise<void> {
    const contactItem = this.page.locator(`text="${contactName}"`);
    await contactItem.waitFor({ state: 'visible', timeout });
  }

  /**
   * Verify a contact is deleted (not visible in the list)
   */
  async verifyContactDeleted(contactName: string, timeout = 5000): Promise<void> {
    const contactItem = this.page.locator(`text="${contactName}"`).first();
    await expect(contactItem).not.toBeVisible({ timeout });
  }

  /**
   * Search for a contact and verify it's visible
   */
  async searchAndVerifyContact(searchTerm: string, expectedContactName: string): Promise<void> {
    await this.searchContact(searchTerm);
    await this.verifyContactVisible(expectedContactName);
  }

  /**
   * Navigate back to contacts list, handling page closing
   */
  async navigateBackToContactsList(): Promise<void> {
    // Check if already on contacts list page
    const currentUrl = this.page.url();
    if (currentUrl.includes('/contacts/list')) {
      return;
    }

    // Click back button to navigate back
    const backBtn = this.page.locator('[data-testid="page-back-button"]');
    await backBtn.waitFor({ state: 'visible', timeout: 5000 });
    await backBtn.click();

    // Verify navigation to contacts list page using URL
    await this.page.waitForURL('**/contacts/list', { timeout: 10000 }).catch(() => {
      // If URL check fails, verify by checking for contacts list page element
      return this.page.locator('[data-testid="contacts-list-page"]').waitFor({ state: 'visible', timeout: 5000 });
    });
  }
}
