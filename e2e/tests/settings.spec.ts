import { test, expect } from '../fixtures/extension.fixture';
import { SettingsPage } from '../pages/extension/SettingsPage';
import {
  setFeatureFlagOverrides,
  waitForFeatureFlagValue,
} from '../helpers/featureFlagHelpers';

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
      await expect(settings.portfolioTotalBalance).toBeVisible({
        timeout: 30_000,
      });
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
      // The LANGUAGES override only applies after a live PostHog flag fetch,
      // so allow well beyond the default 60s timeout.
      test.setTimeout(120_000);
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      await setFeatureFlagOverrides(unlockedExtensionPage, { languages: true });
      let languagesEffective = true;
      try {
        await waitForFeatureFlagValue(unlockedExtensionPage, 'languages', true);
      } catch {
        languagesEffective = false;
      }
      test.skip(
        !languagesEffective,
        'LANGUAGES feature flag unavailable (POSTHOG_KEY missing / flag fetch failed)',
      );

      await expect(settings.languageSelector).toBeVisible({ timeout: 15_000 });
      await expect(settings.pageTitle).toHaveText('Settings');
      await settings.selectLanguage('de-DE');
      await expect(settings.pageTitle).toHaveText('Einstellungen', {
        timeout: 15_000,
      });
    },
  );

  test(
    'As a CORE ext user, I can switch currency',
    snapshot('SET-006'),
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120_000);
      const settings = new SettingsPage(unlockedExtensionPage);

      await settings.open();
      // SettingsService.getSettings() forces USD unless this flag is on, so a
      // non-USD selection would otherwise flip back on the next settings read.
      await setFeatureFlagOverrides(unlockedExtensionPage, {
        'balance-service-integration': true,
      });
      let balanceServiceEffective = true;
      try {
        await waitForFeatureFlagValue(
          unlockedExtensionPage,
          'balance-service-integration',
          true,
        );
      } catch {
        balanceServiceEffective = false;
      }
      test.skip(
        !balanceServiceEffective,
        'BALANCE_SERVICE_INTEGRATION unavailable (POSTHOG_KEY missing / flag fetch failed)',
      );

      const current = await settings.getSelectedCurrency();
      const targetSymbol = current === 'EUR' ? 'GBP' : 'EUR';

      await settings.selectCurrency(targetSymbol);
      await expect(settings.currencySelector).toHaveText(targetSymbol);

      await settings.goBackToPortfolio();
      await expect(settings.portfolioBalanceCurrency).toHaveText(targetSymbol, {
        timeout: 15_000,
      });

      await settings.reloadExtension();
      await settings.open();
      await expect(settings.currencySelector).toHaveText(targetSymbol);
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

      // SYSTEM is the default, so first prove an explicit theme applies before
      // switching to SYSTEM and checking it follows the OS color scheme.
      await settings.selectTheme('DARK');
      await expect
        .poll(() => settings.settingsBackgroundLuminance(), { timeout: 10_000 })
        .toBeLessThan(0.3);

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

      await settings.reloadExtension();
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

      await settings.reloadExtension();
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

      await expect(settings.footerTermsLink).toHaveAttribute(
        'href',
        'https://core.app/terms/core',
      );
      await expect(settings.footerPrivacyLink).toHaveAttribute(
        'href',
        'https://www.avalabs.org/legal/privacy-policy',
      );

      const termsTab = await settings.clickLinkExpectNewTab(
        settings.footerTermsLink,
        context,
      );
      await expect
        .poll(() => termsTab.url(), { timeout: 15_000 })
        .toContain('core.app/terms/core');
      await termsTab.close();

      const privacyTab = await settings.clickLinkExpectNewTab(
        settings.footerPrivacyLink,
        context,
      );
      await expect
        .poll(() => privacyTab.url(), { timeout: 15_000 })
        .toContain('avalabs.org/legal/privacy-policy');
      await privacyTab.close();
    },
  );
});
