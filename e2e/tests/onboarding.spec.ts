import { test, expect } from '../fixtures/extension.fixture';
import { OnboardingPage } from '../pages/extension/OnboardingPage';
import {
  TEST_CONFIG,
  TEST_TAGS,
  INVALID_RECOVERY_PHRASE_12,
  TEST_WALLET_NAMES,
} from '../constants';

test.describe('Onboarding Tests', () => {
  test(
    'As a CORE ext user, I can see Google, Apple, Manually create wallet, and Access existing wallet options',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-001',
        },
      ],
    },
    async ({ extensionPage }) => {
      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      const isOnOnboarding = await onboardingPage.isOnOnboardingPage();
      expect(isOnOnboarding).toBe(true);

      await expect(onboardingPage.continueWithGoogleButton).toBeVisible();
      await expect(onboardingPage.continueWithAppleButton).toBeVisible();
      await expect(onboardingPage.createWalletButton).toBeVisible();
      await expect(onboardingPage.importWalletButton).toBeVisible();
    },
  );

  test(
    'As a CORE ext user, when I select the Access existing wallet option, I can see Recovery Phrase, Ledger and Keystone options',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-002',
        },
      ],
    },
    async ({ extensionPage }) => {
      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.startImportWallet();

      await expect(onboardingPage.recoveryPhraseOption).toBeVisible();
      await expect(onboardingPage.ledgerOption).toBeVisible();
      await expect(onboardingPage.keystoneOption).toBeVisible();
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option, 12-24 words can be selectable, Clear All and Next buttons can be functional',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-003',
        },
      ],
    },
    async ({ extensionPage }) => {
      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.navigateToRecoveryPhraseScreen();

      // Check 12-word option
      await onboardingPage.selectWordCount(12);
      let inputs = await onboardingPage.getRecoveryPhraseInputs(12);
      expect(inputs.length).toBe(12);

      // Check 24-word option
      await onboardingPage.selectWordCount(24);
      inputs = await onboardingPage.getRecoveryPhraseInputs(24);
      expect(inputs.length).toBe(24);

      // Test Clear All button
      await onboardingPage.selectWordCount(12);
      inputs = await onboardingPage.getRecoveryPhraseInputs(12);
      await inputs[0].fill('test');
      await onboardingPage.clearAllButton.click();
      const value = await inputs[0].inputValue();
      expect(value).toBe('');

      // Verify Next button exists
      await expect(onboardingPage.nextButton).toBeVisible();
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option, an Invalid Phrase error can be displayed if the user types the wrong one',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-004',
        },
      ],
    },
    async ({ extensionPage }) => {
      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.navigateToRecoveryPhraseScreen();
      await onboardingPage.selectWordCount(12);

      await onboardingPage.fillRecoveryPhrase(INVALID_RECOVERY_PHRASE_12);
      await onboardingPage.nextButton.click();

      await expect(onboardingPage.recoveryPhraseErrorMessage).toBeVisible({
        timeout: 10000,
      });
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option with 12 words, I can complete the full onboarding flow',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-005',
        },
      ],
    },
    async ({ extensionPage }) => {
      test.skip(
        !TEST_CONFIG.wallet.recoveryPhrase12.length,
        'RECOVERY_PHRASE_12_WORDS env var not set',
      );

      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.navigateToRecoveryPhraseScreen();
      await onboardingPage.selectWordCount(12);

      await onboardingPage.completeRecoveryPhraseOnboarding(
        TEST_CONFIG.wallet.recoveryPhrase12,
        TEST_WALLET_NAMES.RECOVERY_12,
        TEST_CONFIG.wallet.password,
      );

      // Verify we reached the portfolio/main page
      await extensionPage.waitForTimeout(2000);
      const portfolioVisible = await extensionPage
        .getByText(/portfolio|balance/i)
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      expect(portfolioVisible).toBe(true);
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option with 24 words, I can complete the full onboarding flow',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-006',
        },
      ],
    },
    async ({ extensionPage }) => {
      test.skip(
        !TEST_CONFIG.wallet.recoveryPhrase24.length,
        'RECOVERY_PHRASE_24_WORDS env var not set',
      );

      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.navigateToRecoveryPhraseScreen();
      await onboardingPage.selectWordCount(24);

      await onboardingPage.completeRecoveryPhraseOnboarding(
        TEST_CONFIG.wallet.recoveryPhrase24,
        TEST_WALLET_NAMES.RECOVERY_24,
        TEST_CONFIG.wallet.password,
      );

      // Verify we reached the portfolio/main page
      await extensionPage.waitForTimeout(2000);
      const portfolioVisible = await extensionPage
        .getByText(/portfolio|balance/i)
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      expect(portfolioVisible).toBe(true);
    },
  );

  test(
    'As a CORE ext user, I can manually create a new wallet and complete the full onboarding flow',
    {
      tag: TEST_TAGS.ONBOARDING,
      annotation: [
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-007',
        },
      ],
    },
    async ({ extensionPage }) => {
      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.startCreateWallet();

      await onboardingPage.completeManualWalletCreation(
        TEST_WALLET_NAMES.MANUAL,
        TEST_CONFIG.wallet.password,
      );

      // Verify we reached the portfolio/main page
      await extensionPage.waitForTimeout(2000);
      const portfolioVisible = await extensionPage
        .getByText(/portfolio|balance/i)
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      expect(portfolioVisible).toBe(true);
    },
  );
});
