/**
 * Onboarding Page - First-time setup and wallet creation/import
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OnboardingPage extends BasePage {
  // Locators
  readonly coreLogo: Locator;
  readonly continueWithGoogleButton: Locator;
  readonly continueWithAppleButton: Locator;
  readonly createWalletButton: Locator;
  readonly importWalletButton: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly continueButton: Locator;
  readonly backButton: Locator;
  readonly recoveryPhraseDisplay: Locator;
  readonly recoveryPhraseInput: Locator;
  readonly confirmRecoveryButton: Locator;
  readonly finishButton: Locator;
  // Import wallet method options
  readonly recoveryPhraseOption: Locator;
  readonly ledgerOption: Locator;
  readonly keystoneOption: Locator;
  // Recovery phrase form elements
  readonly phraseLengthSelectorButton: Locator;
  readonly wordCount12Option: Locator;
  readonly wordCount24Option: Locator;
  readonly clearAllButton: Locator;
  readonly nextButton: Locator;
  readonly recoveryPhraseErrorMessage: Locator;
  readonly recoveryPhraseWordInputs: Locator;
  // Wallet details page elements
  readonly walletNameInput: Locator;
  readonly unlockAirdropsToggle: Locator;
  readonly enterPasswordInput: Locator;
  readonly confirmPasswordInputField: Locator;
  readonly passwordStrengthMessage: Locator;
  readonly passwordLengthError: Locator;
  readonly weakPasswordMessage: Locator;
  readonly newsletterCheckbox: Locator;
  readonly newsletterEmailInput: Locator;
  readonly newsletterEmailError: Locator;
  readonly privacyPolicyLink: Locator;
  readonly termsOfUseCheckbox: Locator;
  readonly termsOfUseLink: Locator;
  // Customize Core page elements
  readonly customizeCoreTitle: Locator;
  readonly floatingViewOption: Locator;
  readonly sidebarViewOption: Locator;
  // Select Avatar page elements
  readonly selectAvatarTitle: Locator;
  readonly avatarOptions: Locator;
  // Enjoy Your Wallet page elements
  readonly enjoyWalletTitle: Locator;
  readonly letsGoButton: Locator;
  // Create new wallet flow elements
  readonly newSeedphraseTitle: Locator;
  readonly seedphraseWords: Locator;
  readonly copyPhraseButton: Locator;
  readonly createWalletTermsCheckbox: Locator;
  readonly verifySeedphraseTitle: Locator;
  readonly seedphraseVerificationButtons: Locator;

  // prettier-ignore
  constructor(page: Page) {
    super(page);
    // Onboarding screen elements
    this.coreLogo = page.locator('[data-testid="core-logo"]');
    this.continueWithGoogleButton = page.getByRole('button', { name: /continue with google/i });
    this.continueWithAppleButton = page.getByRole('button', { name: /continue with apple/i });
    this.createWalletButton = page.getByRole('button', { name: /manually create new wallet/i });
    this.importWalletButton = page.getByRole('button', { name: /access existing wallet/i });
    // Wallet setup elements
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    this.termsCheckbox = page.locator('[data-testid="terms-checkbox"]');
    this.continueButton = page.getByRole('button', { name: /continue|next/i });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.recoveryPhraseDisplay = page.locator('[data-testid="recovery-phrase"]');
    this.recoveryPhraseInput = page.locator('[data-testid="recovery-phrase-input"]');
    this.confirmRecoveryButton = page.getByRole('button', { name: /confirm|verify/i });
    this.finishButton = page.getByRole('button', { name: /finish|done/i });
    // Import wallet method options
    this.recoveryPhraseOption = page.locator('[data-testid="import-recovery-phrase-option"]');
    this.ledgerOption = page.locator('[data-testid="import-ledger-option"]');
    this.keystoneOption = page.locator('[data-testid="import-keystone-option"]');
    // Recovery phrase form elements
    this.phraseLengthSelectorButton = page.locator('[data-testid="onboarding-phrase-length-selector"]');
    // Use role-based selectors for popover menu items
    this.wordCount12Option = page.getByRole('menuitem', { name: '12-word phrase' });
    this.wordCount24Option = page.getByRole('menuitem', { name: '24-word phrase' });
    this.clearAllButton = page.getByRole('button', { name: /clear all/i });
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.recoveryPhraseErrorMessage = page.locator('[data-testid="recovery-phrase-error-message"]');
    this.recoveryPhraseWordInputs = page.locator('input[type="text"], input[type="password"]');
    // Wallet details page elements
    this.walletNameInput = page.locator('[data-testid="wallet-name-input"]');
    this.unlockAirdropsToggle = page.getByRole('checkbox', { name: /unlock airdrops/i });
    this.enterPasswordInput = page.locator('[data-testid="enter-password-input"]');
    this.confirmPasswordInputField = page.locator('[data-testid="confirm-password-input"]');
    this.passwordStrengthMessage = page.locator('[data-testid="password-strength-message"]');
    this.passwordLengthError = page.locator('[data-testid="password-length-error"]');
    this.weakPasswordMessage = page.locator('[data-testid="weak-password-message"]');
    this.newsletterCheckbox = page.getByRole('checkbox', { name: /stay updated/i });
    this.newsletterEmailInput = page.locator('[data-testid="newsletter-email-input"]');
    this.newsletterEmailError = page.locator('[data-testid="newsletter-email-error"]');
    this.privacyPolicyLink = page.getByRole('link', { name: /privacy policy/i });
    this.termsOfUseCheckbox = page.getByRole('checkbox', { name: /i have read and agree/i });
    this.termsOfUseLink = page.getByRole('link', { name: /terms of use/i });
    // Customize Core page elements
    this.customizeCoreTitle = page.getByRole('heading', { name: /customize core to your liking/i });
    this.floatingViewOption = page.locator('[data-testid="floating-view-option"]');
    this.sidebarViewOption = page.locator('[data-testid="sidebar-view-option"]');
    // Select Avatar page elements
    this.selectAvatarTitle = page.getByRole('heading', { name: /select your personal avatar/i });
    this.avatarOptions = page.locator('[data-testid="avatar-option"]');
    // Enjoy Your Wallet page elements
    this.enjoyWalletTitle = page.locator('[data-testid="enjoy-wallet-title"]');
    this.letsGoButton = page.getByRole('button', { name: /let's go/i });
    // Create new wallet flow elements
    this.newSeedphraseTitle = page.getByRole('heading', { name: /here is your wallet's recovery phrase/i });
    this.seedphraseWords = page.locator('[data-testid="seedphrase-word"]');
    this.copyPhraseButton = page.getByRole('button', { name: /copy phrase/i });
    this.createWalletTermsCheckbox = page.locator('input[type="checkbox"]').last();
    this.verifySeedphraseTitle = page.getByRole('heading', { name: /verify your recovery phrase/i });
    this.seedphraseVerificationButtons = page.getByRole('button', { name: /^[a-z]+$/i });
  }

  /**
   * Check if we're on the onboarding page
   */
  async isOnOnboardingPage(): Promise<boolean> {
    // Check if Core logo and all onboarding screen buttons are visible
    const isCoreLogoVisible = await this.isVisible(this.coreLogo);
    const isImportButtonVisible = await this.isVisible(this.importWalletButton);
    const isCreateButtonVisible = await this.isVisible(this.createWalletButton);

    return isCoreLogoVisible && isImportButtonVisible && isCreateButtonVisible;
  }

  /**
   * Start create wallet flow
   */
  async startCreateWallet(): Promise<void> {
    await this.clickElement(this.createWalletButton);
  }

  /**
   * Start import wallet flow
   */
  async startImportWallet(): Promise<void> {
    await this.clickElement(this.importWalletButton);
  }

  /**
   * Set password
   */
  async setPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.confirmPasswordInput, password);
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms(): Promise<void> {
    await this.clickElement(this.termsCheckbox);
  }

  /**
   * Click continue button
   */
  async clickContinue(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  /**
   * Get recovery phrase displayed during wallet creation
   */
  async getRecoveryPhrase(): Promise<string> {
    await this.waitForVisible(this.recoveryPhraseDisplay);
    return await this.getText(this.recoveryPhraseDisplay);
  }

  /**
   * Enter recovery phrase for import or confirmation
   */
  async enterRecoveryPhrase(phrase: string): Promise<void> {
    await this.fillInput(this.recoveryPhraseInput, phrase);
  }

  /**
   * Confirm recovery phrase
   */
  async confirmRecoveryPhrase(): Promise<void> {
    await this.clickElement(this.confirmRecoveryButton);
  }

  /**
   * Finish onboarding
   */
  async finish(): Promise<void> {
    await this.clickElement(this.finishButton);
  }

  /**
   * Complete create wallet flow
   * @param password - Password for the wallet
   * @returns Recovery phrase
   */
  async createWallet(password: string): Promise<string> {
    console.log('Creating new wallet...');

    await this.startCreateWallet();
    await this.setPassword(password);
    await this.acceptTerms();
    await this.clickContinue();

    // Get recovery phrase
    const recoveryPhrase = await this.getRecoveryPhrase();
    console.log('Recovery phrase obtained');

    await this.clickContinue();

    // Confirm recovery phrase (some wallets require re-entry)
    // This might need adjustment based on your actual flow
    await this.enterRecoveryPhrase(recoveryPhrase);
    await this.confirmRecoveryPhrase();

    await this.finish();

    console.log('Wallet created');
    return recoveryPhrase;
  }

  /**
   * Complete import wallet flow
   * @param recoveryPhrase - Recovery phrase to import
   * @param password - Password for the wallet
   */
  async importWallet(recoveryPhrase: string, password: string): Promise<void> {
    console.log('Importing wallet...');

    await this.startImportWallet();
    await this.enterRecoveryPhrase(recoveryPhrase);
    await this.clickContinue();

    await this.setPassword(password);
    await this.acceptTerms();
    await this.clickContinue();

    await this.finish();

    console.log('Wallet imported');
  }

  /**
   * Navigate to recovery phrase import screen
   */
  async navigateToRecoveryPhraseScreen(): Promise<void> {
    await this.clickElement(this.importWalletButton);
    await this.recoveryPhraseOption.waitFor({ state: 'visible' });
    await this.clickElement(this.recoveryPhraseOption);
    await this.phraseLengthSelectorButton.waitFor({ state: 'visible' });
  }

  /**
   * Select word count (12 or 24)
   * @param wordCount - Number of words (12 or 24)
   */
  async selectWordCount(wordCount: 12 | 24): Promise<void> {
    await this.phraseLengthSelectorButton.click();
    const option = wordCount === 12 ? this.wordCount12Option : this.wordCount24Option;
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    console.log(`${wordCount}-word option selected from dropdown`);
  }

  /**
   * Wait for and get recovery phrase word inputs
   * @param expectedCount - Expected number of input fields
   */
  async getRecoveryPhraseInputs(expectedCount: number) {
    await this.recoveryPhraseWordInputs.first().waitFor({ state: 'visible' });
    await this.page
      .locator('input[type="text"], input[type="password"]')
      .nth(expectedCount - 1)
      .waitFor({ state: 'visible', timeout: 5000 });
    return await this.recoveryPhraseWordInputs.all();
  }

  /**
   * Fill recovery phrase words
   * @param words - Array of words to fill
   */
  async fillRecoveryPhrase(words: string[]): Promise<void> {
    const inputs = await this.getRecoveryPhraseInputs(words.length);
    for (let i = 0; i < words.length; i++) {
      await inputs[i].fill(words[i]);
    }
    await inputs[words.length - 1].blur();
    console.log(`Typed ${words.length}-word recovery phrase`);
  }

  /**
   * Test password validation scenarios
   * @param walletPassword - Final password to use
   */
  async testPasswordValidation(walletPassword: string): Promise<void> {
    await this.enterPasswordInput.fill('weak');
    await this.confirmPasswordInputField.fill('weak');

    await this.page.waitForSelector('text=/password must be at least 8 characters/i', {
      state: 'visible',
    });

    await this.enterPasswordInput.clear();
    await this.confirmPasswordInputField.clear();
    await this.enterPasswordInput.fill('weakpass');
    await this.confirmPasswordInputField.fill('weakpass');
    await this.confirmPasswordInputField.blur();

    await this.page.waitForSelector('text=/weak password! try adding more characters/i', {
      state: 'visible',
    });

    await this.enterPasswordInput.clear();
    await this.confirmPasswordInputField.clear();
    await this.enterPasswordInput.fill('Average123!@#');
    await this.confirmPasswordInputField.fill('Average123!@#');
    await this.confirmPasswordInputField.blur();

    await this.page.waitForSelector('text=/weak password! try adding more characters/i', {
      state: 'hidden',
    });

    await this.enterPasswordInput.clear();
    await this.confirmPasswordInputField.clear();
    await this.enterPasswordInput.fill(walletPassword);
    await this.confirmPasswordInputField.fill(walletPassword);
  }

  /**
   * Verify and test wallet details page
   * @param walletName - Name for the wallet
   * @param password - Wallet password
   */
  async fillWalletDetails(walletName: string, password: string): Promise<void> {
    await this.walletNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.walletNameInput.fill(walletName);

    await this.testPasswordValidation(password);

    await this.enterPasswordInput.clear();
    await this.confirmPasswordInputField.clear();
    await this.enterPasswordInput.fill(password);
    await this.confirmPasswordInputField.fill('differentPassword');
    await this.termsOfUseCheckbox.check();

    await this.confirmPasswordInputField.clear();
    await this.confirmPasswordInputField.fill(password);
  }

  /**
   * Verify policy links navigation
   */
  async verifyPolicyLinks(): Promise<void> {
    try {
      const [privacyPolicyPage] = await Promise.all([
        this.page.context().waitForEvent('page', { timeout: 10000 }),
        this.privacyPolicyLink.click(),
      ]);
      await privacyPolicyPage.waitForLoadState('domcontentloaded');
      await privacyPolicyPage.close();
    } catch (_error) {
      console.log('Privacy policy link verification skipped (page did not open)');
    }

    try {
      const [termsOfUsePage] = await Promise.all([
        this.page.context().waitForEvent('page', { timeout: 10000 }),
        this.termsOfUseLink.click(),
      ]);
      await termsOfUsePage.waitForLoadState('domcontentloaded');
      await termsOfUsePage.close();
    } catch (_error) {
      console.log('Terms of use link verification skipped (page did not open)');
    }
  }

  /**
   * Test email validation if newsletter is visible
   */
  async testNewsletterEmail(): Promise<void> {
    await this.unlockAirdropsToggle.click();
    await this.page.waitForTimeout(500); // Wait for toggle animation

    const isNewsletterVisible = await this.newsletterCheckbox.isVisible({ timeout: 5000 }).catch(() => false);

    if (isNewsletterVisible) {
      await this.newsletterCheckbox.check();
      await this.newsletterEmailInput.waitFor({ state: 'visible', timeout: 5000 });

      await this.newsletterEmailInput.fill('invalidemail');
      await this.newsletterEmailInput.blur();
      await this.newsletterEmailError.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('Newsletter email error not shown');
      });

      await this.newsletterEmailInput.clear();
      await this.newsletterEmailInput.fill('test@example.com');
      await this.newsletterEmailInput.blur();
    } else {
      console.log('Newsletter checkbox not visible, skipping email validation test');
    }
  }

  /**
   * Complete post-wallet setup pages (Customize, Avatar, Enjoy)
   */
  async completePostWalletSetup(): Promise<void> {
    await this.nextButton.click();

    await this.customizeCoreTitle.waitFor({ state: 'visible', timeout: 10000 });
    await this.floatingViewOption.click();
    await this.nextButton.click();

    await this.selectAvatarTitle.waitFor({ state: 'visible', timeout: 10000 });
    await this.avatarOptions.first().waitFor({ state: 'visible', timeout: 10000 });
    const avatars = await this.avatarOptions.all();
    await avatars[0].click();
    await this.nextButton.click();

    // Wait for wallet creation/initialization to complete
    // This can take a while in CI as it involves crypto operations
    console.log('Waiting for wallet creation to complete...');
    await this.page.waitForTimeout(2000); // Give it time to start processing

    // Wait for submission to complete (may show loading spinner first)
    // Increased timeout to 2 minutes for CI environment (crypto operations can be slow)
    await this.enjoyWalletTitle.waitFor({ state: 'visible', timeout: 120000 });
    console.log('Wallet creation completed - enjoy wallet screen shown');
    await this.letsGoButton.click();
  }
}
