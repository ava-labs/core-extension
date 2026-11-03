import { test, expect } from '../fixtures/extension.fixture';
import { SettingsPage } from '../pages/extension/SettingsPage';

const snapshot = (automationId: string) => ({
  tag: ['@regression'],
  annotation: [
    { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
    {
      type: 'testrail_case_field',
      description: `custom_automation_id:${automationId}`,
    },
  ],
});

test.describe('Settings Tests', () => {
  test(
    'As a CORE ext user, I can enable testnet',
    snapshot('SET-001'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.setSwitch(settings.testnetSwitch, false);
      await settings.setSwitch(settings.testnetSwitch, true);

      await settings.goBackToPortfolio();
      await expect(settings.portfolioTestnetIndicator).toBeVisible({
        timeout: 30_000,
      });
    },
  );

  test(
    'As a CORE ext user, I can disable testnet',
    snapshot('SET-002'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.setSwitch(settings.testnetSwitch, true);

      await settings.goBackToPortfolio();
      await expect(settings.portfolioTestnetIndicator).toBeVisible({
        timeout: 30_000,
      });

      await settings.open();
      await settings.setSwitch(settings.testnetSwitch, false);

      await settings.goBackToPortfolio();
      await expect(settings.portfolioTestnetIndicator).toBeHidden({
        timeout: 30_000,
      });
    },
  );

  test(
    'As a CORE ext user, I can enable privacy mode',
    snapshot('SET-003'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.setSwitch(settings.privacySwitch, false);
      await settings.setSwitch(settings.privacySwitch, true);

      await settings.goBackToPortfolio();
      await expect.poll(() => settings.isBalanceMasked()).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can disable privacy mode',
    snapshot('SET-004'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.setSwitch(settings.privacySwitch, true);
      await settings.setSwitch(settings.privacySwitch, false);

      await settings.goBackToPortfolio();
      await expect.poll(() => settings.isBalanceMasked()).toBe(false);
      await expect(settings.portfolioBalanceCurrency).not.toBeEmpty();
    },
  );

  test(
    'As a CORE ext user, I can switch languages',
    snapshot('SET-005'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      const flagApplied = await settings.enableLanguagesFlag();
      expect(
        flagApplied,
        'LANGUAGES feature flag selector did not appear (requires POSTHOG_KEY + flag fetch)',
      ).toBe(true);

      await expect(settings.pageTitle).toHaveText('Settings');
      await settings.selectLanguage('Deutsch');
      await expect(settings.pageTitle).toHaveText('Einstellungen', {
        timeout: 15_000,
      });
    },
  );

  test(
    'As a CORE ext user, I can switch currency',
    snapshot('SET-006'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      const current = await settings.getSelectedCurrency();
      const target =
        current === 'EUR'
          ? { label: 'Pound Sterling', symbol: 'GBP' }
          : { label: 'Euro', symbol: 'EUR' };

      await settings.selectCurrency(target.label);
      await expect(settings.currencySelector).toHaveText(target.symbol);

      await settings.goBackToPortfolio();
      await expect(settings.portfolioBalanceCurrency).toHaveText(
        target.symbol,
        { timeout: 15_000 },
      );
    },
  );

  test(
    'As a CORE ext user, I can change the avatar',
    snapshot('SET-007'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      const avatarBefore = await settings.getHeaderAvatarSrc();

      await settings.open();
      await settings.openAvatarSelector();
      await settings.selectDifferentAvatar();

      await settings.goBackToPortfolio();
      await expect
        .poll(() => settings.getHeaderAvatarSrc(), { timeout: 15_000 })
        .not.toBe(avatarBefore);
    },
  );

  test(
    'As a CORE ext user, I can switch to Dark mode',
    snapshot('SET-008'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.selectTheme('LIGHT');
      const lightLuminance = await settings.settingsBackgroundLuminance();

      await settings.selectTheme('DARK');
      await expect
        .poll(() => settings.settingsBackgroundLuminance(), { timeout: 10_000 })
        .toBeLessThan(lightLuminance - 0.3);
    },
  );

  test(
    'As a CORE ext user, I can switch to Light mode',
    snapshot('SET-009'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.selectTheme('DARK');
      const darkLuminance = await settings.settingsBackgroundLuminance();

      await settings.selectTheme('LIGHT');
      await expect
        .poll(() => settings.settingsBackgroundLuminance(), { timeout: 10_000 })
        .toBeGreaterThan(darkLuminance + 0.3);
    },
  );

  test(
    'As a CORE ext user, I can switch to System mode',
    snapshot('SET-010'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.selectTheme('SYSTEM');

      await unlockedExtensionPage.emulateMedia({ colorScheme: 'light' });
      await expect
        .poll(() => settings.settingsBackgroundLuminance(), { timeout: 10_000 })
        .toBeGreaterThan(0.6);
      const lightLuminance = await settings.settingsBackgroundLuminance();

      await unlockedExtensionPage.emulateMedia({ colorScheme: 'dark' });
      await expect
        .poll(() => settings.settingsBackgroundLuminance(), { timeout: 10_000 })
        .toBeLessThan(lightLuminance - 0.3);

      await unlockedExtensionPage.emulateMedia({ colorScheme: 'light' });
      await expect
        .poll(() => settings.settingsBackgroundLuminance(), { timeout: 10_000 })
        .toBeGreaterThan(lightLuminance - 0.1);
    },
  );

  test(
    'As a CORE ext user, I can enable Participate in Core Analytics',
    snapshot('SET-011'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.setSwitch(settings.analyticsToggle, false);
      await settings.setSwitch(settings.analyticsToggle, true);

      await settings.goBackToPortfolio();
      await settings.open();
      expect(await settings.isSwitchOn(settings.analyticsToggle)).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can disable Participate in Core Analytics',
    snapshot('SET-012'),
    async ({ unlockedExtensionPage }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await settings.setSwitch(settings.analyticsToggle, true);
      await settings.setSwitch(settings.analyticsToggle, false);

      await settings.goBackToPortfolio();
      await settings.open();
      expect(await settings.isSwitchOn(settings.analyticsToggle)).toBe(false);
    },
  );

  test(
    'As a CORE ext user, I can navigate to Terms and Privacy Policy',
    snapshot('SET-013'),
    async ({ unlockedExtensionPage, context }) => {
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();

      const termsTab = await settings.clickLinkExpectNewTab(
        settings.footerTermsLink,
        context,
      );
      expect(termsTab.url()).toContain('core.app/terms/core');
      await termsTab.close();

      const privacyTab = await settings.clickLinkExpectNewTab(
        settings.footerPrivacyLink,
        context,
      );
      expect(privacyTab.url()).toContain('avalabs.org/legal/privacy-policy');
      await privacyTab.close();
    },
  );
});
