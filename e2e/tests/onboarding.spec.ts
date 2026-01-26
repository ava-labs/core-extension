import { test, expect } from '../fixtures/extension.fixture';
import { OnboardingPage } from '../pages/extension/OnboardingPage';
import { INVALID_RECOVERY_PHRASE_12, TEST_WALLET_NAMES } from '../constants';

const WALLET_PASSWORD = process.env.WALLET_PASSWORD || 'password#123';
const RECOVERY_PHRASE_12_WORDS =
  process.env.RECOVERY_PHRASE_12_WORDS?.split(' ') || [];
const RECOVERY_PHRASE_24_WORDS =
  process.env.RECOVERY_PHRASE_24_WORDS?.split(' ') || [];

test.describe('Onboarding Tests', () => {
  test(
    'As a CORE ext user, I can see Google, Apple, Manually create wallet, and Access existing wallet options',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
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
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
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
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
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
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
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

      await expect(onboardingPage.recoveryPhraseErrorMessage).toBeVisible({
        timeout: 10000,
      });
      await expect(onboardingPage.nextButton).toBeDisabled();
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option with 12 words, I can complete the full onboarding flow',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-005',
        },
      ],
    },
    async ({ extensionPage }) => {
      test.skip(
        !RECOVERY_PHRASE_12_WORDS.length,
        'RECOVERY_PHRASE_12_WORDS env var not set',
      );

      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.navigateToRecoveryPhraseScreen();
      await onboardingPage.selectWordCount(12);

      await onboardingPage.completeRecoveryPhraseOnboarding(
        RECOVERY_PHRASE_12_WORDS,
        TEST_WALLET_NAMES.RECOVERY_12,
        WALLET_PASSWORD,
        false,
      );

      await expect(onboardingPage.enjoyWalletTitle).toBeVisible({
        timeout: 20000,
      });
      await expect(onboardingPage.letsGoButton).toBeVisible({
        timeout: 20000,
      });
      await onboardingPage.completeOnboarding();
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option with 24 words, I can complete the full onboarding flow',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-006',
        },
      ],
    },
    async ({ extensionPage }) => {
      test.skip(
        !RECOVERY_PHRASE_24_WORDS.length,
        'RECOVERY_PHRASE_24_WORDS env var not set',
      );

      const onboardingPage = new OnboardingPage(extensionPage);

      await extensionPage.waitForTimeout(3000);
      await onboardingPage.navigateToRecoveryPhraseScreen();
      await onboardingPage.selectWordCount(24);

      await onboardingPage.completeRecoveryPhraseOnboarding(
        RECOVERY_PHRASE_24_WORDS,
        TEST_WALLET_NAMES.RECOVERY_24,
        WALLET_PASSWORD,
        false,
      );

      await expect(onboardingPage.enjoyWalletTitle).toBeVisible({
        timeout: 20000,
      });
      await expect(onboardingPage.letsGoButton).toBeVisible({
        timeout: 20000,
      });
      await onboardingPage.completeOnboarding();
    },
  );

  test(
    'As a CORE ext user, I can manually create a new wallet and complete the full onboarding flow',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'none',
        },
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
        WALLET_PASSWORD,
        false,
      );

      await expect(onboardingPage.enjoyWalletTitle).toBeVisible({
        timeout: 20000,
      });
      await expect(onboardingPage.letsGoButton).toBeVisible({
        timeout: 20000,
      });
      await onboardingPage.completeOnboarding();
    },
  );
});
