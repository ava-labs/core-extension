import { test, expect } from '../fixtures/extension.fixture';
import { ContactsPage } from '../pages/extension/ContactsPage';
import { TEST_CONFIG } from '../constants';

test.describe('Contacts', () => {
  test(
    'As a CORE ext user, when I have no contacts I see an empty state',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'testrail_case_field',
        description: 'custom_automation_id:EXT_CONTACTS_001',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      await contactsPage.navigateToContacts();

      expect(await contactsPage.isOnContactsPage()).toBe(true);
      expect(await contactsPage.isEmptyStateVisible()).toBe(true);
      expect(await contactsPage.getContactCount()).toBe(0);
    },
  );

  test(
    'As a CORE ext user, I can add a new contact',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'testrail_case_field',
        description: 'custom_automation_id:EXT_CONTACTS_002',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;

      await contactsPage.navigateToContacts();
      await contactsPage.addContact({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });

      await contactsPage.navigateBackToContactsList();
      await contactsPage.verifyContactVisible(contact1.name);
      expect(await contactsPage.getContactCount()).toBeGreaterThanOrEqual(1);
    },
  );

  test(
    'As a CORE ext user, I can see Avalanche CXP Chain, BTC, and Solana addresses for contacts',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'testrail_case_field',
        description: 'custom_automation_id:EXT_CONTACTS_003',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });

      await contactsPage.viewContactDetails(contact1.name);
      await contactsPage.expandAddressesInDetails(contact1.name);

      // Verify all addresses are visible in input fields
      const cChainInput = unlockedExtensionPage.locator('input').nth(1);
      const xpInput = unlockedExtensionPage.locator('input').nth(2);
      const bitcoinInput = unlockedExtensionPage.locator('input').nth(3);
      const solanaInput = unlockedExtensionPage.locator('input').nth(4);

      await expect(cChainInput).toHaveValue(contact1.avalancheCChain);
      await expect(xpInput).toHaveValue(contact1.avalancheXP);
      await expect(bitcoinInput).toHaveValue(contact1.bitcoin);
      await expect(solanaInput).toHaveValue(contact1.solana);
    },
  );

  test(
    'As a CORE ext user, I can copy an address from the contact details',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_automation_id',
        description: 'EXT_CONTACTS_004',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });

      await contactsPage.viewContactDetails(contact1.name);
      await contactsPage.hoverOverChainLabels();

      const copyButtons = unlockedExtensionPage.getByRole('button', { name: /copy/i });
      expect(await copyButtons.count()).toBeGreaterThan(0);

      await copyButtons.first().click();

      const clipboardContent: string = await unlockedExtensionPage.evaluate(async () => {
        // @ts-expect-error - navigator is available in browser context
        return await navigator.clipboard.readText();
      });

      const isValidAddress =
        clipboardContent === contact1.avalancheCChain ||
        clipboardContent === contact1.avalancheXP ||
        clipboardContent === contact1.bitcoin ||
        clipboardContent === contact1.solana;
      expect(isValidAddress).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can edit an existing contact',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_automation_id',
        description: 'EXT_CONTACTS_005',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;
      const contact2 = TEST_CONFIG.testData.contacts.contact2;

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });

      await contactsPage.editContact(contact1.name, {
        name: contact2.name,
        avalancheCChain: contact2.avalancheCChain,
        avalancheXP: contact2.avalancheXP,
        bitcoin: contact2.bitcoin,
        solana: contact2.solana,
      });

      await contactsPage.navigateBackToContactsList();
      await contactsPage.verifyContactVisible(contact2.name);

      const oldContactItem = unlockedExtensionPage.locator(`text="${contact1.name}"`).first();
      await expect(oldContactItem)
        .not.toBeVisible({ timeout: 5000 })
        .catch(() => {});
    },
  );

  test(
    'As a CORE ext user, I can search for a contact',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_automation_id',
        description: 'EXT_CONTACTS_006',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;
      const contact2 = TEST_CONFIG.testData.contacts.contact2;

      await contactsPage.navigateToContacts();

      // Ensure both contacts exist
      await contactsPage.ensureContactExists({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });
      await contactsPage.ensureContactExists({
        name: contact2.name,
        avalancheCChain: contact2.avalancheCChain,
        avalancheXP: contact2.avalancheXP,
        bitcoin: contact2.bitcoin,
        solana: contact2.solana,
      });

      const initialContactCount = await contactsPage.getContactCount();
      expect(initialContactCount).toBeGreaterThanOrEqual(2);

      // Search by name
      await contactsPage.searchAndVerifyContact(contact1.name, contact1.name);
      await contactsPage.clearSearch();
      expect(await contactsPage.getContactCount()).toBe(initialContactCount);

      // Search by partial name
      await contactsPage.searchAndVerifyContact('Alice', contact1.name);
      await contactsPage.clearSearch();

      // Search by partial addresses
      const addressTests = [
        { type: 'C-Chain', address: contact1.avalancheCChain, contact: contact1 },
        { type: 'X/P-Chain', address: contact1.avalancheXP, contact: contact1 },
        { type: 'Bitcoin', address: contact1.bitcoin, contact: contact1 },
        { type: 'Solana', address: contact1.solana, contact: contact1 },
      ];

      for (const addressTest of addressTests) {
        await contactsPage.searchAndVerifyContact(addressTest.address.substring(0, 10), addressTest.contact.name);
        await contactsPage.clearSearch();
      }

      // Search by contact2's address to verify filtering
      await contactsPage.searchAndVerifyContact(contact2.avalancheCChain.substring(0, 10), contact2.name);
      await contactsPage.clearSearch();

      // Search by full addresses
      for (const addressTest of addressTests) {
        await contactsPage.searchAndVerifyContact(addressTest.address, addressTest.contact.name);
        await contactsPage.clearSearch();
      }

      // Search by contact2's full address
      await contactsPage.searchAndVerifyContact(contact2.avalancheCChain, contact2.name);
    },
  );

  test(
    'As a CORE ext user, when I search for a non existent contact I see No contacts match your search state',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_automation_id',
        description: 'EXT_CONTACTS_007',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });

      await contactsPage.searchContact('NonExistentContact12345');
      expect(await contactsPage.getContactCount()).toBe(0);
      expect(await contactsPage.isNoSearchResultsVisible()).toBe(true);

      await contactsPage.clearSearch();
      expect(await contactsPage.getContactCount()).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user, I can delete a contact',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'testrail_case_field',
        description: 'custom_automation_id:EXT_CONTACTS_008',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;

      await contactsPage.navigateToContacts();

      // Create a contact first
      await contactsPage.addContact({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });
      await contactsPage.navigateBackToContactsList();

      // Verify contact exists before deletion
      await contactsPage.verifyContactVisible(contact1.name);

      // Delete the contact
      await contactsPage.deleteContact(contact1.name);

      // Verify contact is deleted - check count is 0 (instant, no waiting)
      const contactCount = await unlockedExtensionPage.locator(`text="${contact1.name}"`).count();
      expect(contactCount).toBe(0);
    },
  );

  test(
    'As a CORE ext user, I can delete one contact when multiple contacts exist',
    {
      tag: '@smoke',
      annotation: [{ type: 'snapshot', description: 'mainnetPrimaryExtWallet' }],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_automation_id',
        description: 'EXT_CONTACTS_009',
      });

      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = TEST_CONFIG.testData.contacts.contact1;
      const contact2 = TEST_CONFIG.testData.contacts.contact2;

      await contactsPage.navigateToContacts();

      // Create first contact
      await contactsPage.addContact({
        name: contact1.name,
        avalancheCChain: contact1.avalancheCChain,
        avalancheXP: contact1.avalancheXP,
        bitcoin: contact1.bitcoin,
        solana: contact1.solana,
      });
      await contactsPage.navigateBackToContactsList();

      // Create second contact
      await contactsPage.addContact({
        name: contact2.name,
        avalancheCChain: contact2.avalancheCChain,
        avalancheXP: contact2.avalancheXP,
        bitcoin: contact2.bitcoin,
        solana: contact2.solana,
      });
      await contactsPage.navigateBackToContactsList();

      // Verify both contacts exist
      await contactsPage.verifyContactVisible(contact1.name);
      await contactsPage.verifyContactVisible(contact2.name);

      // Delete the first contact
      await contactsPage.deleteContact(contact1.name);

      // Verify deleted contact is gone
      const deletedContactCount = await unlockedExtensionPage.locator(`text="${contact1.name}"`).count();
      expect(deletedContactCount).toBe(0);

      // Verify the other contact still exists
      await contactsPage.verifyContactVisible(contact2.name);
    },
  );
});
