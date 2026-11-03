import { test, expect } from '../fixtures/extension.fixture';
import { NotificationsPage } from '../pages/extension/NotificationsPage';

test.describe('Notifications Tests', () => {
  test(
    'As a CORE ext user, if there are no notifications I can see the No Notifications state',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetEmptyExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NTF-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const notificationsPage = new NotificationsPage(unlockedExtensionPage);

      await notificationsPage.openFromHeader();

      await expect(notificationsPage.emptyState).toBeVisible({
        timeout: 30_000,
      });
      await expect(notificationsPage.emptyState).toContainText(
        'No notifications',
      );
    },
  );

  test(
    'As a CORE ext user, I should see All, Transactions, Prices option on the bottom',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'mainnetEmptyExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:NTF-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const notificationsPage = new NotificationsPage(unlockedExtensionPage);

      await notificationsPage.openFromHeader();

      await expect(notificationsPage.tab('All')).toBeVisible({
        timeout: 30_000,
      });
      await expect(notificationsPage.tab('Transactions')).toBeVisible();
      await expect(notificationsPage.tab('Prices')).toBeVisible();

      await expect(notificationsPage.tabByTestId('All')).toBeVisible();
      await expect(notificationsPage.tabByTestId('Transactions')).toBeVisible();
      await expect(notificationsPage.tabByTestId('Prices')).toBeVisible();

      expect(await notificationsPage.isTabSelected('All')).toBe(true);

      await notificationsPage.selectTab('Transactions');
      expect(await notificationsPage.isTabSelected('Transactions')).toBe(true);
      expect(await notificationsPage.isTabSelected('All')).toBe(false);

      await notificationsPage.selectTab('Prices');
      expect(await notificationsPage.isTabSelected('Prices')).toBe(true);
      expect(await notificationsPage.isTabSelected('Transactions')).toBe(false);

      await notificationsPage.selectTab('All');
      expect(await notificationsPage.isTabSelected('All')).toBe(true);
      expect(await notificationsPage.isTabSelected('Prices')).toBe(false);
    },
  );
});
