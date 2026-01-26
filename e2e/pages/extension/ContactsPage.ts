/**
 * Contacts Page - Manage wallet contacts
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ContactData, ContactUpdateData } from '../../types/contacts';

export class ContactsPage extends BasePage {
  // Navigation
  readonly contactsNavButton: Locator;
  readonly settingsButton: Locator;
  readonly savedAddressesNavItem: Locator;
  readonly backButton: Locator;

  // Contact list
  readonly contactsList: Locator;
  readonly contactItems: Locator;
  readonly emptyStateMessage: Locator;
  readonly searchInput: Locator;
  readonly noSearchResultsMessage: Locator;

  // Add contact form
  readonly addContactButton: Locator;
  readonly namePromptButton: Locator;
  readonly contactNameInput: Locator;
  readonly avalancheCChainField: Locator;
  readonly avalancheXPField: Locator;
  readonly bitcoinField: Locator;
  readonly solanaField: Locator;
  readonly avalancheCChainInput: Locator;
  readonly avalancheXPInput: Locator;
  readonly bitcoinInput: Locator;
  readonly solanaInput: Locator;
  readonly saveContactButton: Locator;
  readonly cancelButton: Locator;

  // Contact details
  readonly editContactButton: Locator;
  readonly deleteContactButton: Locator;
  readonly copyAddressButton: Locator;
  readonly contactDetailName: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.contactsNavButton = page.locator(
      '[data-testid="contacts-nav-button"]',
    );
    this.settingsButton = page.locator('[data-testid="settings-button"]');
    this.savedAddressesNavItem = page.getByText(/saved addresses/i);
    this.backButton = page.locator('[data-testid="page-back-button"] svg');

    // Contact list
    this.contactsList = page.locator('[data-testid="contacts-list-page"]');
    this.contactItems = page.locator('[data-testid="contact-item"]');
    this.emptyStateMessage = page.locator(
      '[data-testid="contacts-empty-state"]',
    );
    this.searchInput = page.getByPlaceholder(/search/i);
    this.noSearchResultsMessage = page.getByText(
      /no contacts match your search/i,
    );

    // Add contact form
    this.addContactButton = page.getByRole('button', {
      name: /add an address/i,
    });
    this.namePromptButton = page.getByRole('button', {
      name: /name this contact/i,
    });
    this.contactNameInput = page.locator('input:not([placeholder])');
    this.avalancheCChainField = page.locator(
      '[data-testid="contact-address-c-chain"]',
    );
    this.avalancheXPField = page.locator(
      '[data-testid="contact-address-xp-chain"]',
    );
    this.bitcoinField = page.locator('[data-testid="contact-address-bitcoin"]');
    this.solanaField = page.locator('[data-testid="contact-address-solana"]');
    this.avalancheCChainInput = this.avalancheCChainField.locator('input');
    this.avalancheXPInput = this.avalancheXPField.locator('input');
    this.bitcoinInput = this.bitcoinField.locator('input');
    this.solanaInput = this.solanaField.locator('input');
    this.saveContactButton = page.getByRole('button', { name: /save/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });

    // Contact details
    this.editContactButton = page.getByRole('button', { name: /edit/i });
    this.deleteContactButton = page.getByRole('button', { name: /delete/i });
    this.copyAddressButton = page.getByRole('button', { name: /copy/i });
    this.contactDetailName = page.locator('[data-testid="contact-name"]');
  }

  async navigateToContacts(): Promise<void> {
    const hasDirectNav = await this.contactsNavButton
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (hasDirectNav) {
      await this.contactsNavButton.click();
      await this.page.waitForLoadState('domcontentloaded');
      return;
    }

    await this.settingsButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.settingsButton.click();
    await this.savedAddressesNavItem.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.savedAddressesNavItem.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.emptyStateMessage.isVisible();
  }

  private async ensureNameInputVisible(): Promise<Locator> {
    const input = this.contactNameInput.first();
    const isVisible = await input.isVisible().catch(() => false);
    if (!isVisible) {
      const promptVisible = await this.namePromptButton
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      if (promptVisible) {
        await this.namePromptButton.click();
      }
      await input.waitFor({ state: 'visible', timeout: 5000 });
    }
    return input;
  }

  private async ensureFieldInputVisible(field: Locator): Promise<Locator> {
    const input = field.locator('input');
    const fieldCount = await field.count();
    if (fieldCount === 0) {
      return input;
    }

    const isVisible = await input.isVisible().catch(() => false);
    if (!isVisible) {
      const namedPrompt = field.getByRole('button', { name: /add/i });
      const namedPromptVisible = await namedPrompt
        .isVisible({ timeout: 2000 })
        .catch(() => false);
      if (namedPromptVisible) {
        await namedPrompt.click();
      } else {
        const fallbackPrompt = field.getByRole('button').first();
        const fallbackVisible = await fallbackPrompt
          .isVisible({ timeout: 2000 })
          .catch(() => false);
        if (fallbackVisible) {
          await fallbackPrompt.click();
        }
      }
      await input.waitFor({ state: 'visible', timeout: 10000 });
    }
    return input;
  }

  async addContact(contact: ContactData): Promise<void> {
    await this.addContactButton.click();
    const nameInput = await this.ensureNameInputVisible();

    await nameInput.fill(contact.name);

    if (contact.avalancheCChain) {
      const input = await this.ensureFieldInputVisible(
        this.avalancheCChainField,
      );
      await input.fill(contact.avalancheCChain);
    }
    if (contact.avalancheXP) {
      const input = await this.ensureFieldInputVisible(this.avalancheXPField);
      await input.fill(contact.avalancheXP);
    }
    if (contact.bitcoin) {
      const input = await this.ensureFieldInputVisible(this.bitcoinField);
      await input.fill(contact.bitcoin);
    }
    if (contact.solana && (await this.solanaField.count()) > 0) {
      const input = await this.ensureFieldInputVisible(this.solanaField);
      await input.fill(contact.solana);
    }

    await this.saveContactButton.click();
    await this.deleteContactButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async getContactCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    const items = await this.contactItems.all();
    return items.length;
  }

  async viewContactDetails(contactName: string): Promise<void> {
    const contact = this.contactItems.filter({ hasText: contactName }).first();
    await contact.click();
    await this.deleteContactButton.waitFor({ state: 'visible', timeout: 5000 });
  }

  async searchForContact(query: string): Promise<void> {
    const isReady = await this.searchInput
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (!isReady) {
      return;
    }
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  async deleteContact(): Promise<void> {
    await this.deleteContactButton.click();
    // Confirm deletion if dialog appears
    const confirmButton = this.page.getByRole('button', {
      name: /confirm|yes|delete/i,
    });
    const isConfirmVisible = await confirmButton
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (isConfirmVisible) {
      await confirmButton.click();
    }
    await this.page.waitForTimeout(500);
  }

  async copyAddress(): Promise<void> {
    const field = this.avalancheCChainField;
    await field.hover();
    const copyButton = field.getByRole('button', { name: /copy/i });
    await copyButton.click();
    await this.page.waitForTimeout(500);
  }

  async editContact(updates: ContactUpdateData): Promise<void> {
    if (updates.name) {
      const nameInput = await this.ensureNameInputVisible();
      await nameInput.clear();
      await nameInput.fill(updates.name);
    }

    if (updates.avalancheCChain) {
      const input = await this.ensureFieldInputVisible(
        this.avalancheCChainField,
      );
      await input.clear();
      await input.fill(updates.avalancheCChain);
    }

    await this.saveContactButton.click();
    await this.page.waitForTimeout(500);
  }

  async ensureContactExists(contact: ContactData): Promise<void> {
    const items = await this.contactItems.all();
    let contactExists = false;

    for (const item of items) {
      const text = await item.textContent();
      if (text?.includes(contact.name)) {
        contactExists = true;
        break;
      }
    }

    if (!contactExists) {
      await this.addContact(contact);
      await this.backButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async goBackToContactsList(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForTimeout(500);
  }
}
