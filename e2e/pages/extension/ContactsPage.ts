/**
 * Contacts Page - Manage wallet contacts
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ContactData, ContactUpdateData } from '../../types/contacts';

export class ContactsPage extends BasePage {
  // Navigation
  readonly backButton: Locator;
  readonly contactsNavButton: Locator;
  readonly savedAddressesNavItem: Locator;
  readonly settingsButton: Locator;

  // Contact list
  readonly contactItems: Locator;
  readonly contactsList: Locator;
  readonly emptyStateMessage: Locator;
  readonly noSearchResultsMessage: Locator;
  readonly searchInput: Locator;

  // Add contact form
  readonly addContactButton: Locator;
  readonly avalancheCChainField: Locator;
  readonly avalancheCChainInput: Locator;
  readonly avalancheXPField: Locator;
  readonly avalancheXPInput: Locator;
  readonly bitcoinField: Locator;
  readonly bitcoinInput: Locator;
  readonly cancelButton: Locator;
  readonly contactNameInput: Locator;
  readonly namePromptButton: Locator;
  readonly saveContactButton: Locator;
  readonly solanaField: Locator;
  readonly solanaInput: Locator;

  // Contact details
  readonly contactDetailName: Locator;
  readonly copyAddressButton: Locator;
  readonly deleteContactButton: Locator;
  readonly editContactButton: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.backButton = page.locator('[data-testid="page-back-button"] svg');
    this.contactsNavButton = page.locator(
      '[data-testid="contacts-nav-button"]',
    );
    this.savedAddressesNavItem = page.getByText(/saved addresses/i);
    this.settingsButton = page.locator('[data-testid="settings-button"]');

    // Contact list
    this.contactItems = page.locator('[data-testid="contact-item"]');
    this.contactsList = page.locator('[data-testid="contacts-list-page"]');
    this.emptyStateMessage = page.locator(
      '[data-testid="contacts-empty-state"]',
    );
    this.noSearchResultsMessage = page.getByText(
      /no contacts match your search/i,
    );
    this.searchInput = page.getByPlaceholder(/search/i);

    // Add contact form
    this.addContactButton = page.getByRole('button', {
      name: /add an address/i,
    });
    this.avalancheCChainField = page.locator(
      '[data-testid="contact-address-c-chain"]',
    );
    this.avalancheCChainInput = this.avalancheCChainField.locator('input');
    this.avalancheXPField = page.locator(
      '[data-testid="contact-address-xp-chain"]',
    );
    this.avalancheXPInput = this.avalancheXPField.locator('input');
    this.bitcoinField = page.locator('[data-testid="contact-address-bitcoin"]');
    this.bitcoinInput = this.bitcoinField.locator('input');
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.contactNameInput = page.locator('input:not([placeholder])');
    this.namePromptButton = page.getByRole('button', {
      name: /name this contact/i,
    });
    this.saveContactButton = page.getByRole('button', { name: /save/i });
    this.solanaField = page.locator('[data-testid="contact-address-solana"]');
    this.solanaInput = this.solanaField.locator('input');

    // Contact details
    this.contactDetailName = page.locator('[data-testid="contact-name"]');
    this.copyAddressButton = page.getByRole('button', { name: /copy/i });
    this.deleteContactButton = page.getByRole('button', { name: /delete/i });
    this.editContactButton = page.getByRole('button', { name: /edit/i });
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

  private async getContactNameInput(): Promise<Locator> {
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

  private async getContactAddressInput(field: Locator): Promise<Locator> {
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
    const nameInput = await this.getContactNameInput();

    await nameInput.fill(contact.name);

    if (contact.avalancheCChain) {
      const input = await this.getContactAddressInput(
        this.avalancheCChainField,
      );
      await input.fill(contact.avalancheCChain);
    }
    if (contact.avalancheXP) {
      const input = await this.getContactAddressInput(this.avalancheXPField);
      await input.fill(contact.avalancheXP);
    }
    if (contact.bitcoin) {
      const input = await this.getContactAddressInput(this.bitcoinField);
      await input.fill(contact.bitcoin);
    }
    if (contact.solana && (await this.solanaField.count()) > 0) {
      const input = await this.getContactAddressInput(this.solanaField);
      await input.fill(contact.solana);
    }

    await this.saveContactButton.click();
    await this.deleteContactButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }

  async getContactCount(): Promise<number> {
    await this.contactsList.waitFor({ state: 'visible', timeout: 5000 });
    return await this.contactItems.count();
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
    const confirmButton = this.page.locator(
      '[data-testid="confirm-delete-contact-button"]',
    );
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();
    await this.contactsList.waitFor({ state: 'visible', timeout: 5000 });
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
      const nameInput = await this.getContactNameInput();
      await nameInput.clear();
      await nameInput.fill(updates.name);
    }

    if (updates.avalancheCChain) {
      const input = await this.getContactAddressInput(
        this.avalancheCChainField,
      );
      await input.clear();
      await input.fill(updates.avalancheCChain);
    }

    await this.saveContactButton.click();
    await this.page.waitForTimeout(500);
  }

  async doesContactExist(contact: ContactData): Promise<boolean> {
    await this.contactsList.waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.contactItems
      .filter({ hasText: contact.name })
      .count();
    return count > 0;
  }

  async goBackToContactsList(): Promise<void> {
    await this.backButton.click();
    await this.contactsList.waitFor({ state: 'visible', timeout: 5000 });
  }
}
