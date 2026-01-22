/**
 * Contacts Page - Manage wallet contacts
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ContactData, ContactUpdateData } from '../../types/contacts';

export class ContactsPage extends BasePage {
  // Navigation
  readonly contactsNavButton: Locator;
  readonly backButton: Locator;

  // Contact list
  readonly contactsList: Locator;
  readonly contactItems: Locator;
  readonly emptyStateMessage: Locator;
  readonly searchInput: Locator;
  readonly noSearchResultsMessage: Locator;

  // Add contact form
  readonly addContactButton: Locator;
  readonly contactNameInput: Locator;
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
    this.backButton = page.getByRole('button', { name: /back/i });

    // Contact list
    this.contactsList = page.locator('[data-testid="contacts-list"]');
    this.contactItems = page.locator('[data-testid="contact-item"]');
    this.emptyStateMessage = page.getByText(/no contacts yet/i);
    this.searchInput = page.getByPlaceholder(/search/i);
    this.noSearchResultsMessage = page.getByText(
      /no contacts match your search/i,
    );

    // Add contact form
    this.addContactButton = page.getByRole('button', { name: /add contact/i });
    this.contactNameInput = page.locator('input').first();
    this.avalancheCChainInput = page.locator('input').nth(1);
    this.avalancheXPInput = page.locator('input').nth(2);
    this.bitcoinInput = page.locator('input').nth(3);
    this.solanaInput = page.locator('input').nth(4);
    this.saveContactButton = page.getByRole('button', { name: /save/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });

    // Contact details
    this.editContactButton = page.getByRole('button', { name: /edit/i });
    this.deleteContactButton = page.getByRole('button', { name: /delete/i });
    this.copyAddressButton = page.getByRole('button', { name: /copy/i });
    this.contactDetailName = page.locator('[data-testid="contact-name"]');
  }

  async navigateToContacts(): Promise<void> {
    await this.contactsNavButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.emptyStateMessage.isVisible();
  }

  async addContact(contact: ContactData): Promise<void> {
    await this.addContactButton.click();
    await this.contactNameInput.waitFor({ state: 'visible' });

    await this.contactNameInput.fill(contact.name);

    if (contact.avalancheCChain) {
      await this.avalancheCChainInput.fill(contact.avalancheCChain);
    }
    if (contact.avalancheXP) {
      await this.avalancheXPInput.fill(contact.avalancheXP);
    }
    if (contact.bitcoin) {
      await this.bitcoinInput.fill(contact.bitcoin);
    }
    if (contact.solana) {
      await this.solanaInput.fill(contact.solana);
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
    await this.copyAddressButton.first().click();
    await this.page.waitForTimeout(500);
  }

  async editContact(updates: ContactUpdateData): Promise<void> {
    const inputs = await this.page.locator('input').all();

    if (updates.name && inputs.length > 0) {
      await inputs[0].clear();
      await inputs[0].fill(updates.name);
    }

    if (updates.avalancheCChain && inputs.length > 1) {
      await inputs[1].clear();
      await inputs[1].fill(updates.avalancheCChain);
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
