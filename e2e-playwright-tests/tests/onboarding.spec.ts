/**
 * Onboarding Tests
 * Tests for the extension onboarding flow and wallet options
 */
import { test, expect } from '../fixtures/extension.fixture';
import { OnboardingPage } from '../pages/extension/OnboardingPage';
import { TEST_CONFIG } from '../constants';

test.describe('Onboarding', () => {
  test(
    'As a CORE ext user, I can see Google, Apple, Manually create wallet, and Access existing wallet options',
    { tag: '@smoke' },
    async ({ extensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_case_automation_id',
        description: 'EXT_ONBOARDING_001',
      });
      console.log('Verifying onboarding options...');

      const onboardingPage = new OnboardingPage(extensionPage);

      const isOnOnboarding = await onboardingPage.isOnOnboardingPage();
      expect(isOnOnboarding).toBe(true);
      console.log('Onboarding page is visible');

      await expect(onboardingPage.continueWithGoogleButton).toBeVisible();
      console.log('"Continue with Google" button is visible');

      await expect(onboardingPage.continueWithAppleButton).toBeVisible();
      console.log('"Continue with Apple" button is visible');

      await expect(onboardingPage.createWalletButton).toBeVisible();
      console.log('"Manually create new wallet" button is visible');

      await expect(onboardingPage.importWalletButton).toBeVisible();
      console.log('"Access existing wallet" button is visible');

      console.log('All onboarding options are visible');
    },
  );

  test(
    'As a CORE ext user, on the onboarding page, I can check the language dropdown box and verify all languages are selectable',
    { tag: '@smoke' },
    async ({ extensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_case_automation_id',
        description: 'EXT_ONBOARDING_002',
      });
      console.log('Verifying language dropdown functionality...');

      const languageSelector = extensionPage.locator('[data-testid="onboarding-language-selector"]');
      await expect(languageSelector).toBeVisible();
      console.log('Language selector is visible');

      await languageSelector.click();
      console.log('Clicked language selector');

      const expectedLanguages = [
        { name: 'English (English)', originalName: 'English' },
        { name: 'Chinese - Simplified (简体中文)', originalName: '简体中文' },
        { name: 'Chinese - Traditional (繁體中文)', originalName: '繁體中文' },
        { name: 'German (Deutsch)', originalName: 'Deutsch' },
        { name: 'French (Français)', originalName: 'Français' },
        { name: 'Hindi (हिन्दी)', originalName: 'हिन्दी' },
        { name: 'Japanese (日本語)', originalName: '日本語' },
        { name: 'Korean (한국인)', originalName: '한국인' },
        { name: 'Russian (Русский)', originalName: 'Русский' },
        { name: 'Spanish (Español)', originalName: 'Español' },
        { name: 'Turkish (Türkçe)', originalName: 'Türkçe' },
      ];

      const firstLanguageOption = extensionPage.getByText('English (English)', { exact: true });
      await firstLanguageOption.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Dropdown menu is visible');

      for (const lang of expectedLanguages) {
        const langOption = extensionPage.getByText(lang.name, { exact: true });
        await expect(langOption).toBeVisible();
        console.log(`Verified: ${lang.originalName} option is visible`);
      }

      const germanOption = extensionPage.getByText('German (Deutsch)', { exact: true });
      await germanOption.click();
      console.log('Selected German language');

      await expect(languageSelector).toContainText('German');
      console.log('Verified: Language changed to German');

      await languageSelector.click();
      await firstLanguageOption.waitFor({ state: 'visible', timeout: 5000 });
      const englishOption = extensionPage.getByText('English (English)', { exact: true });
      await englishOption.click();
      console.log('Changed back to English');

      await expect(languageSelector).toContainText('English');
      console.log('Verified: Language changed back to English');

      console.log('All languages are selectable and functional');
    },
  );

  test(
    'As a CORE ext user, when I select the Access existing wallet option, I can see Recovery Phrase, Ledger and Keystone options',
    { tag: '@smoke' },
    async ({ extensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_case_automation_id',
        description: 'EXT_ONBOARDING_003',
      });
      console.log('Verifying import wallet options...');

      const onboardingPage = new OnboardingPage(extensionPage);

      await onboardingPage.clickElement(onboardingPage.importWalletButton);
      await onboardingPage.recoveryPhraseOption.waitFor({ state: 'visible' });

      await expect(onboardingPage.recoveryPhraseOption).toBeVisible();
      console.log('"Manually enter a recovery phrase" option is visible');

      await expect(onboardingPage.ledgerOption).toBeVisible();
      console.log('"Add using Ledger" option is visible');

      await expect(onboardingPage.keystoneOption).toBeVisible();
      console.log('"Add using Keystone" option is visible');

      console.log('All import wallet options are visible');
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option, 12-24 words can be selectable, Clear All and Next buttons can be functional',
    { tag: '@smoke' },
    async ({ extensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_case_automation_id',
        description: 'EXT_ONBOARDING_004',
      });
      console.log('Verifying recovery phrase form functionality...');

      const onboardingPage = new OnboardingPage(extensionPage);

      await onboardingPage.navigateToRecoveryPhraseScreen();
      console.log('Recovery phrase form loaded');

      await onboardingPage.selectWordCount(12);
      await expect(onboardingPage.phraseLengthSelectorButton).toContainText('12-word phrase');
      console.log('Verified: Dropdown displays "12-word phrase"');

      const wordInputs = await onboardingPage.getRecoveryPhraseInputs(12);
      expect(wordInputs.length).toBe(12);
      console.log('Verified: 12 input fields are displayed');

      await wordInputs[0].fill('test');
      await onboardingPage.clickElement(onboardingPage.clearAllButton);
      await expect(wordInputs[0]).toHaveValue('');
      console.log('Verified: Clear All button clears input fields');

      await onboardingPage.selectWordCount(24);
      await expect(onboardingPage.phraseLengthSelectorButton).toContainText('24-word phrase');
      console.log('Verified: Dropdown displays "24-word phrase"');

      const wordInputs24 = await onboardingPage.getRecoveryPhraseInputs(24);
      expect(wordInputs24.length).toBe(24);
      console.log('Verified: 24 input fields are displayed');

      await wordInputs24[0].fill('test');
      await onboardingPage.clickElement(onboardingPage.clearAllButton);
      await expect(wordInputs24[0]).toHaveValue('');
      console.log('Verified: Clear All button clears 24-word input fields');

      console.log('Recovery phrase form functionality verified');
    },
  );

  test(
    'As a CORE ext user, for the Access Recovery Phrase option, an Invalid Phrase error can be displayed if the user types the wrong one',
    { tag: '@smoke' },
    async ({ extensionPage }, testInfo) => {
      testInfo.annotations.push({
        type: 'custom_case_automation_id',
        description: 'EXT_ONBOARDING_005',
      });
      console.log('Verifying invalid recovery phrase error...');

      const onboardingPage = new OnboardingPage(extensionPage);
      const invalidWords12 = [
        'abandon',
        'ability',
        'able',
        'about',
        'above',
        'absent',
        'absorb',
        'abstract',
        'absurd',
        'abuse',
        'access',
        'accident',
      ];

      await onboardingPage.navigateToRecoveryPhraseScreen();
      console.log('Recovery phrase form loaded');

      await onboardingPage.selectWordCount(12);
      await onboardingPage.fillRecoveryPhrase(invalidWords12);
      console.log('Typed 12 valid BIP39 words that form an invalid recovery phrase');

      await expect(onboardingPage.recoveryPhraseErrorMessage).toBeVisible({ timeout: 10000 });
      console.log('Error message appeared for 12-word invalid phrase');

      await expect(onboardingPage.nextButton).toBeDisabled();
      console.log('Verified: Next button is disabled due to invalid 12-word phrase');

      await onboardingPage.clickElement(onboardingPage.clearAllButton);
      console.log('Clicked Clear All button');

      await onboardingPage.selectWordCount(24);
      const invalidWords24 = [...invalidWords12, ...invalidWords12];
      await onboardingPage.fillRecoveryPhrase(invalidWords24);
      console.log('Typed 24 valid BIP39 words that form an invalid recovery phrase');

      await expect(onboardingPage.recoveryPhraseErrorMessage).toBeVisible({ timeout: 10000 });
      console.log('Error message appeared for 24-word invalid phrase');

      await expect(onboardingPage.nextButton).toBeDisabled();
      console.log('Verified: Next button is disabled due to invalid 24-word phrase');

      console.log(
        'Invalid recovery phrase error validation completed: Error messages displayed correctly for both 12 and 24-word invalid phrases',
      );
    },
  );

  test('As a CORE ext user, for the Access Recovery Phrase option with 12 words, I can complete the full onboarding flow including wallet details, policy links verification, newsletter validation, customize core view selection, avatar selection, and wallet completion', async ({
    extensionPage,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'custom_case_automation_id',
      description: 'EXT_ONBOARDING_006',
    });
    console.log('Verifying successful onboarding with valid 12-word recovery phrase...');

    const onboardingPage = new OnboardingPage(extensionPage);
    const validWords12 = TEST_CONFIG.wallet.recoveryPhrase12Words.split(' ');
    const walletPassword = TEST_CONFIG.wallet.password;

    await onboardingPage.navigateToRecoveryPhraseScreen();
    await onboardingPage.selectWordCount(12);
    await expect(onboardingPage.phraseLengthSelectorButton).toContainText('12-word phrase');

    await onboardingPage.fillRecoveryPhrase(validWords12);

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 10000 });
    console.log('Verified: Next button is enabled with valid 12-word phrase');

    await onboardingPage.nextButton.click();
    console.log('Clicked Next button - navigating to wallet details page');

    await onboardingPage.fillWalletDetails('Wallet 12-word', walletPassword);
    console.log('Wallet details filled with password validation');

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 10000 });
    console.log('Verified: Next button is enabled with all mandatory fields filled');

    await onboardingPage.verifyPolicyLinks();
    console.log('Verified: Policy links navigate correctly');

    await onboardingPage.testNewsletterEmail();
    console.log('Verified: Newsletter email validation');

    await expect(onboardingPage.nextButton).toBeEnabled();
    await onboardingPage.completePostWalletSetup();

    console.log('Successful end-to-end onboarding with 12-word recovery phrase completed');
  });

  test('As a CORE ext user, for the Access Recovery Phrase option with 24 words, I can complete the full onboarding flow including wallet details, policy links verification, newsletter validation,core view selection, avatar selection, and wallet completion', async ({
    extensionPage,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'custom_case_automation_id',
      description: 'EXT_ONBOARDING_007',
    });
    console.log('Verifying successful onboarding with valid 24-word recovery phrase...');

    const onboardingPage = new OnboardingPage(extensionPage);
    const validWords24 = TEST_CONFIG.wallet.recoveryPhrase24Words.split(' ');
    const walletPassword = TEST_CONFIG.wallet.password;

    await onboardingPage.navigateToRecoveryPhraseScreen();
    await onboardingPage.selectWordCount(24);
    await expect(onboardingPage.phraseLengthSelectorButton).toContainText('24-word phrase');

    await onboardingPage.fillRecoveryPhrase(validWords24);

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 10000 });
    console.log('Verified: Next button is enabled with valid 24-word phrase');

    await onboardingPage.nextButton.click();
    console.log('Clicked Next button - navigating to wallet details page');

    await onboardingPage.fillWalletDetails('Wallet 24-word', walletPassword);
    console.log('Wallet details filled with password validation');

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 10000 });
    console.log('Verified: Next button is enabled with all mandatory fields filled');

    await onboardingPage.verifyPolicyLinks();
    console.log('Verified: Policy links navigate correctly');

    await onboardingPage.testNewsletterEmail();
    console.log('Verified: Newsletter email validation');

    await expect(onboardingPage.nextButton).toBeEnabled();
    await onboardingPage.completePostWalletSetup();

    console.log('Successful end-to-end onboarding with 24-word recovery phrase completed');
  });

  test('As a CORE ext user, I can manually create a new wallet and complete the full onboarding flow', async ({
    extensionPage,
  }, testInfo) => {
    testInfo.annotations.push({
      type: 'custom_case_automation_id',
      description: 'EXT_ONBOARDING_008',
    });
    console.log('Verifying manual wallet creation flow...');

    const onboardingPage = new OnboardingPage(extensionPage);
    const walletPassword = TEST_CONFIG.wallet.password;

    await onboardingPage.clickElement(onboardingPage.createWalletButton);
    console.log('Clicked "Manually create new wallet" button');

    await onboardingPage.newSeedphraseTitle.waitFor({ state: 'visible', timeout: 10000 });
    console.log('New seedphrase screen loaded');

    await expect(onboardingPage.newSeedphraseTitle).toBeVisible();
    console.log('Verified: Recovery phrase title is visible');

    const listItems = extensionPage.locator('ol li');
    await listItems.first().waitFor({ state: 'visible', timeout: 5000 });

    const seedphraseWordsArray: string[] = [];
    const count = await listItems.count();
    for (let i = 0; i < count; i++) {
      const itemText = await listItems.nth(i).locator('p').first().textContent();
      if (itemText && itemText.trim()) {
        seedphraseWordsArray.push(itemText.trim());
      }
    }

    expect(seedphraseWordsArray.length).toBeGreaterThan(0);
    console.log(`Verified: ${seedphraseWordsArray.length} seedphrase words are displayed`);

    await expect(onboardingPage.copyPhraseButton).toBeVisible();
    console.log('Verified: Copy phrase button is visible');

    await expect(onboardingPage.nextButton).toBeDisabled();
    console.log('Verified: Next button is disabled initially');

    await onboardingPage.createWalletTermsCheckbox.check();
    console.log('Checked terms checkbox');

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 5000 });
    console.log('Verified: Next button is enabled after accepting terms');

    await onboardingPage.nextButton.click();
    console.log('Clicked Next button - navigating to verify seedphrase page');

    await onboardingPage.verifySeedphraseTitle.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Verify seedphrase screen loaded');

    await expect(onboardingPage.verifySeedphraseTitle).toBeVisible();
    console.log('Verified: Verify recovery phrase title is visible');

    // Wait for all verification buttons to be fully loaded
    await extensionPage.waitForTimeout(2000);
    await extensionPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('Network not idle, continuing with verification...');
    });

    const verificationButtons = await onboardingPage.seedphraseVerificationButtons.all();
    expect(verificationButtons.length).toBeGreaterThan(0);
    console.log(`Verified: ${verificationButtons.length} verification buttons are available`);

    const verificationQuestions = extensionPage.locator('p:has-text("Select the")');
    const questionCount = await verificationQuestions.count();
    console.log(`Answering ${questionCount} seedphrase verification questions`);

    for (let i = 0; i < questionCount; i++) {
      const questionText = await verificationQuestions.nth(i).textContent();

      if (questionText?.includes('first word')) {
        const firstWord = seedphraseWordsArray[0];
        const firstWordButton = extensionPage.getByRole('button', { name: firstWord, exact: true }).first();
        await firstWordButton.waitFor({ state: 'visible', timeout: 10000 });
        await firstWordButton.click();
        console.log(`Selected first word: ${firstWord}`);
      } else if (questionText?.includes('last word')) {
        const lastWord = seedphraseWordsArray[seedphraseWordsArray.length - 1];
        const lastWordButton = extensionPage.getByRole('button', { name: lastWord, exact: true }).first();
        await lastWordButton.waitFor({ state: 'visible', timeout: 10000 });
        await lastWordButton.click();
        console.log(`Selected last word: ${lastWord}`);
      } else if (questionText?.includes('comes after')) {
        const wordMatch = questionText.match(/comes after.*?([a-z]+)/i);
        if (wordMatch) {
          const afterWord = wordMatch[1].toLowerCase();
          const afterWordIndex = seedphraseWordsArray.indexOf(afterWord);
          if (afterWordIndex !== -1 && afterWordIndex < seedphraseWordsArray.length - 1) {
            const nextWord = seedphraseWordsArray[afterWordIndex + 1];
            console.log(`Looking for word "${nextWord}" that comes after "${afterWord}"`);
            const nextWordButton = extensionPage.getByRole('button', { name: nextWord, exact: true }).first();
            await nextWordButton.waitFor({ state: 'visible', timeout: 10000 });
            await nextWordButton.click();
            console.log(`Selected word after "${afterWord}": ${nextWord}`);
          }
        }
      }
    }

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 5000 });
    console.log('Verified: Next button is enabled after seedphrase verification');

    await onboardingPage.nextButton.click();
    console.log('Clicked Next button - navigating to wallet details page');

    await onboardingPage.fillWalletDetails('My New Wallet', walletPassword);
    console.log('Wallet details filled with password validation');

    await expect(onboardingPage.nextButton).toBeEnabled({ timeout: 10000 });
    console.log('Verified: Next button is enabled with all mandatory fields filled');

    await onboardingPage.verifyPolicyLinks();
    console.log('Verified: Policy links navigate correctly');

    await onboardingPage.testNewsletterEmail();
    console.log('Verified: Newsletter email validation');

    await expect(onboardingPage.nextButton).toBeEnabled();
    await onboardingPage.completePostWalletSetup();

    console.log('Successful end-to-end wallet creation completed');
  });
});
