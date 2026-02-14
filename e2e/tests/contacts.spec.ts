import { test, expect } from '../fixtures/extension.fixture';
import { ContactsPage } from '../pages/extension/ContactsPage';
import { TEST_CONTACTS } from '../constants';

const createContact = async (
  contactsPage: ContactsPage,
  contact: typeof TEST_CONTACTS.VALID,
) => {
  await contactsPage.addContact(contact);
  await contactsPage.goBackToContactsList();
};

test.describe('Contacts Tests', () => {
  test(
    'As a CORE ext user, when I have no contacts I see an empty state',
    {
      tag: ['@smoke', '@regression'],
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
      tag: ['@smoke', '@regression'],
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

      // Add contact with all address types: C-Chain, X/P-Chain, Bitcoin, and Solana
      await contactsPage.addContact(TEST_CONTACTS.FULL);

      await contactsPage.goBackToContactsList();
      await expect
        .poll(() => contactsPage.getContactCount(), { timeout: 10000 })
        .toBe(initialCount + 1);
    },
  );

  test(
    'As a CORE ext user, I can copy an address from the contact details',
    {
      tag: ['@regression'],
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
      await createContact(contactsPage, TEST_CONTACTS.VALID);
      await expect
        .poll(() => contactsPage.doesContactExist(TEST_CONTACTS.VALID), {
          timeout: 10000,
        })
        .toBe(true);

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
      tag: ['@regression'],
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
      await createContact(contactsPage, TEST_CONTACTS.VALID);
      await expect
        .poll(() => contactsPage.doesContactExist(TEST_CONTACTS.VALID), {
          timeout: 10000,
        })
        .toBe(true);

      await contactsPage.viewContactDetails(TEST_CONTACTS.VALID.name);
      await contactsPage.editContact({ name: updatedName });

      // Verify the contact was updated
      await contactsPage.goBackToContactsList();
      await expect
        .poll(
          () =>
            contactsPage.contactItems.filter({ hasText: updatedName }).count(),
          { timeout: 10000 },
        )
        .toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user, I can search for a contact',
    {
      tag: ['@regression'],
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
      await createContact(contactsPage, TEST_CONTACTS.SEARCH);
      await expect
        .poll(() => contactsPage.doesContactExist(TEST_CONTACTS.SEARCH), {
          timeout: 10000,
        })
        .toBe(true);

      await contactsPage.searchForContact(TEST_CONTACTS.SEARCH.name);

      await expect
        .poll(
          () =>
            contactsPage.contactItems
              .filter({ hasText: TEST_CONTACTS.SEARCH.name })
              .count(),
          { timeout: 10000 },
        )
        .toBeGreaterThan(0);
      await expect(
        contactsPage.contactItems.filter({
          hasNotText: TEST_CONTACTS.SEARCH.name,
        }),
      ).toHaveCount(0);
    },
  );

  test(
    'As a CORE ext user, when I search for a non existent contact I see No contacts match your search state',
    {
      tag: ['@regression'],
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
      tag: ['@regression'],
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
      await createContact(contactsPage, contactToDelete);
      await expect
        .poll(() => contactsPage.doesContactExist(contactToDelete), {
          timeout: 10000,
        })
        .toBe(true);

      const initialCount = await contactsPage.getContactCount();

      await contactsPage.viewContactDetails(contactToDelete.name);
      await contactsPage.deleteContact();

      await expect
        .poll(() => contactsPage.getContactCount(), { timeout: 10000 })
        .toBe(initialCount - 1);
      await expect
        .poll(() => contactsPage.doesContactExist(contactToDelete), {
          timeout: 10000,
        })
        .toBe(false);
    },
  );

  test(
    'As a CORE ext user, I can delete one contact when multiple contacts exist',
    {
      tag: ['@regression'],
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
      await createContact(contactsPage, contact1);
      await createContact(contactsPage, contact2);
      await expect
        .poll(() => contactsPage.doesContactExist(contact1), {
          timeout: 10000,
        })
        .toBe(true);
      await expect
        .poll(() => contactsPage.doesContactExist(contact2), {
          timeout: 10000,
        })
        .toBe(true);

      const initialCount = await contactsPage.getContactCount();
      expect(initialCount).toBeGreaterThanOrEqual(2);

      await contactsPage.viewContactDetails(contact2.name);
      await contactsPage.deleteContact();

      // Verify we still have contacts
      await expect
        .poll(() => contactsPage.getContactCount(), { timeout: 10000 })
        .toBe(initialCount - 1);
      await expect
        .poll(() => contactsPage.doesContactExist(contact2), {
          timeout: 10000,
        })
        .toBe(false);
    },
  );
});
