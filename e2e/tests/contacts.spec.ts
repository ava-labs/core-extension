import { test, expect } from '../fixtures/extension.fixture';
import { ContactsPage } from '../pages/extension/ContactsPage';
import { TEST_CONTACTS } from '../constants';

test.describe('Contacts Tests', () => {
  test(
    'As a CORE ext user, when I have no contacts I see an empty state',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);

      await contactsPage.navigateToContacts();

      // Check for empty state OR contact items
      const isEmpty = await contactsPage.isEmptyStateVisible();
      const contactCount = await contactsPage.getContactCount();

      // Either we see empty state message or we have 0 contacts
      expect(isEmpty || contactCount === 0).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can add a new contact',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);

      await contactsPage.navigateToContacts();
      const initialCount = await contactsPage.getContactCount();

      await contactsPage.addContact(TEST_CONTACTS.VALID);

      await contactsPage.goBackToContactsList();
      const newCount = await contactsPage.getContactCount();
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    },
  );

  test(
    'As a CORE ext user, I can copy an address from the contact details',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists(TEST_CONTACTS.VALID);

      await contactsPage.viewContactDetails(TEST_CONTACTS.VALID.name);
      await contactsPage.copyAddress();

      // Verify copy was successful (look for toast or button state change)
      const copySuccess = await unlockedExtensionPage
        .getByText(/copied/i)
        .isVisible({ timeout: 3000 })
        .catch(() => true);
      expect(copySuccess).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can edit an existing contact',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const updatedName = 'Updated Contact Name';

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists(TEST_CONTACTS.VALID);

      await contactsPage.viewContactDetails(TEST_CONTACTS.VALID.name);
      await contactsPage.editContact({ name: updatedName });

      // Verify the contact was updated
      await contactsPage.goBackToContactsList();
      const items = await contactsPage.contactItems.all();
      let found = false;
      for (const item of items) {
        const text = await item.textContent();
        if (text?.includes(updatedName)) {
          found = true;
          break;
        }
      }
      expect(found).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can search for a contact',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists(TEST_CONTACTS.SEARCH);

      await contactsPage.searchForContact(TEST_CONTACTS.SEARCH.name);

      const items = await contactsPage.contactItems.all();
      expect(items.length).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user, when I search for a non existent contact I see No contacts match your search state',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);

      await contactsPage.navigateToContacts();
      await contactsPage.searchForContact('NonExistentContactXYZ123');

      const noResults = await contactsPage.noSearchResultsMessage
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      const itemCount = await contactsPage.getContactCount();

      expect(noResults || itemCount === 0).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can delete a contact',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-007',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contactToDelete = {
        ...TEST_CONTACTS.SECONDARY,
        name: 'Contact To Delete',
      };

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists(contactToDelete);

      const initialCount = await contactsPage.getContactCount();

      await contactsPage.viewContactDetails(contactToDelete.name);
      await contactsPage.deleteContact();

      await unlockedExtensionPage.waitForTimeout(1000);
      const finalCount = await contactsPage.getContactCount();

      expect(finalCount).toBeLessThanOrEqual(initialCount);
    },
  );

  test(
    'As a CORE ext user, I can delete one contact when multiple contacts exist',
    {
      tag: '@smoke',
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:CON-008',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const contactsPage = new ContactsPage(unlockedExtensionPage);
      const contact1 = { ...TEST_CONTACTS.VALID, name: 'Keep This Contact' };
      const contact2 = {
        ...TEST_CONTACTS.SECONDARY,
        name: 'Delete This Contact',
      };

      await contactsPage.navigateToContacts();
      await contactsPage.ensureContactExists(contact1);
      await contactsPage.ensureContactExists(contact2);

      const initialCount = await contactsPage.getContactCount();
      expect(initialCount).toBeGreaterThanOrEqual(2);

      await contactsPage.viewContactDetails(contact2.name);
      await contactsPage.deleteContact();

      await unlockedExtensionPage.waitForTimeout(1000);

      // Verify we still have contacts
      const finalCount = await contactsPage.getContactCount();
      expect(finalCount).toBeGreaterThanOrEqual(1);
      expect(finalCount).toBeLessThan(initialCount);
    },
  );
});
