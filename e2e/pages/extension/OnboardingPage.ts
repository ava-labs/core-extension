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
  readonly termsOfUseCheckbox: Locator;
  // Customize Core page elements
  readonly customizeCoreTitle: Locator;
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

  constructor(page: Page) {
    super(page);
    // Onboarding screen elements
    this.coreLogo = page.locator('[data-testid="core-logo"]');
    this.continueWithGoogleButton = page.getByRole('button', {
      name: /continue with google/i,
    });
    this.continueWithAppleButton = page.getByRole('button', {
      name: /continue with apple/i,
    });
    this.createWalletButton = page.getByRole('button', {
      name: /manually create new wallet/i,
    });
    this.importWalletButton = page.getByRole('button', {
      name: /access existing wallet/i,
    });
    // Wallet setup elements
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = page.locator(
      '[data-testid="confirm-password-input"]',
    );
    this.termsCheckbox = page.locator('[data-testid="terms-checkbox"]');
    this.continueButton = page.getByRole('button', { name: /continue|next/i });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.recoveryPhraseDisplay = page.locator(
      '[data-testid="recovery-phrase"]',
    );
    this.recoveryPhraseInput = page.locator(
      '[data-testid="recovery-phrase-input"]',
    );
    this.confirmRecoveryButton = page.getByRole('button', {
      name: /confirm|verify/i,
    });
    this.finishButton = page.getByRole('button', { name: /finish|done/i });
    // Import wallet method options
    this.recoveryPhraseOption = page.locator(
      '[data-testid="import-recovery-phrase-option"]',
    );
    this.ledgerOption = page.locator('[data-testid="import-ledger-option"]');
    this.keystoneOption = page.locator(
      '[data-testid="import-keystone-option"]',
    );
    // Recovery phrase form elements
    this.phraseLengthSelectorButton = page.locator(
      '[data-testid="onboarding-phrase-length-selector"]',
    );
    this.wordCount12Option = page.getByRole('menuitem', {
      name: '12-word phrase',
    });
    this.wordCount24Option = page.getByRole('menuitem', {
      name: '24-word phrase',
    });
    this.clearAllButton = page.getByRole('button', { name: /clear all/i });
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.recoveryPhraseErrorMessage = page.locator(
      '[data-testid="recovery-phrase-error-message"]',
    );
    this.recoveryPhraseWordInputs = page.locator(
      'input[type="text"], input[type="password"]',
    );
    // Wallet details page elements
    this.walletNameInput = page.locator('[data-testid="wallet-name-input"]');
    this.unlockAirdropsToggle = page.getByRole('checkbox', {
      name: /unlock airdrops/i,
    });
    this.enterPasswordInput = page.locator(
      '[data-testid="enter-password-input"]',
    );
    this.confirmPasswordInputField = page.locator(
      '[data-testid="confirm-password-input"]',
    );
    this.termsOfUseCheckbox = page.getByRole('checkbox', {
      name: /i have read and agree/i,
    });
    // Customize Core page elements
    this.customizeCoreTitle = page.getByRole('heading', {
      name: /customize core to your liking/i,
    });
    // Select Avatar page elements
    this.selectAvatarTitle = page.getByRole('heading', {
      name: /select your personal avatar/i,
    });
    this.avatarOptions = page.locator('[data-testid="avatar-option"]');
    // Enjoy Your Wallet page elements
    this.enjoyWalletTitle = page.locator('[data-testid="enjoy-wallet-title"]');
    this.letsGoButton = page.getByRole('button', { name: /let's go/i });
    // Create new wallet flow elements
    this.newSeedphraseTitle = page.getByRole('heading', {
      name: /here is your wallet's recovery phrase/i,
    });
    this.seedphraseWords = page.locator('[data-testid="seedphrase-word"]');
    this.copyPhraseButton = page.getByRole('button', { name: /copy phrase/i });
    this.createWalletTermsCheckbox = page
      .locator('input[type="checkbox"]')
      .last();
    this.verifySeedphraseTitle = page.getByRole('heading', {
      name: 'Verify your recovery phrase',
      exact: true,
    });
    this.seedphraseVerificationButtons = page.getByRole('button', {
      name: /^[a-z]+$/i,
    });
  }

  async isOnOnboardingPage(): Promise<boolean> {
    const isCoreLogoVisible = await this.isVisible(this.coreLogo);
    const isImportButtonVisible = await this.isVisible(this.importWalletButton);
    const isCreateButtonVisible = await this.isVisible(this.createWalletButton);
    return isCoreLogoVisible && isImportButtonVisible && isCreateButtonVisible;
  }

  async startCreateWallet(): Promise<void> {
    await this.createWalletButton.click();
  }

  async startImportWallet(): Promise<void> {
    await this.importWalletButton.click();
  }

  async navigateToRecoveryPhraseScreen(): Promise<void> {
    await this.importWalletButton.click();
    await this.recoveryPhraseOption.waitFor({ state: 'visible' });
    await this.recoveryPhraseOption.click();
    await this.phraseLengthSelectorButton.waitFor({ state: 'visible' });
  }

  async selectWordCount(wordCount: 12 | 24): Promise<void> {
    await this.phraseLengthSelectorButton.click();
    const option =
      wordCount === 12 ? this.wordCount12Option : this.wordCount24Option;
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async getRecoveryPhraseInputs(expectedCount: number) {
    await this.recoveryPhraseWordInputs.first().waitFor({ state: 'visible' });
    await this.page
      .locator('input[type="text"], input[type="password"]')
      .nth(expectedCount - 1)
      .waitFor({ state: 'visible', timeout: 5000 });
    return await this.recoveryPhraseWordInputs.all();
  }

  async fillRecoveryPhrase(words: string[]): Promise<void> {
    const inputs = await this.getRecoveryPhraseInputs(words.length);
    for (let i = 0; i < words.length; i++) {
      await inputs[i].fill(words[i]);
    }
    await inputs[words.length - 1].blur();
  }

  async fillWalletDetails(walletName: string, password: string): Promise<void> {
    await this.walletNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.walletNameInput.fill(walletName);
    await this.enterPasswordInput.fill(password);
    await this.confirmPasswordInputField.fill(password);
    await this.termsOfUseCheckbox.check();
  }

  async customizeCoreStep(): Promise<void> {
    await this.customizeCoreTitle.waitFor({ state: 'visible', timeout: 10000 });
    await this.nextButton.click();
  }

  async selectAvatarStep(): Promise<void> {
    await this.selectAvatarTitle.waitFor({ state: 'visible', timeout: 10000 });
    const avatars = await this.avatarOptions.all();
    if (avatars.length > 0) {
      await avatars[0].click();
    }
    await this.nextButton.click();
  }

  async completeOnboarding(): Promise<void> {
    await this.letsGoButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.letsGoButton.click();
  }

  async completeRecoveryPhraseOnboarding(
    recoveryWords: string[],
    walletName: string,
    password: string,
  ): Promise<void> {
    // Fill recovery phrase
    await this.fillRecoveryPhrase(recoveryWords);
    await this.nextButton.click();

    // Fill wallet details
    await this.fillWalletDetails(walletName, password);
    await this.nextButton.click();

    // Customize Core step
    await this.customizeCoreStep();

    // Select Avatar step
    await this.selectAvatarStep();

    // Complete onboarding
    await this.completeOnboarding();
  }

  async getSeedphraseWords(): Promise<string[]> {
    await this.newSeedphraseTitle.waitFor({ state: 'visible', timeout: 15000 });
    const wordElements = await this.seedphraseWords.all();
    const words: string[] = [];
    for (const element of wordElements) {
      const text = await element.textContent();
      if (text) {
        const word = text.replace(/^\d+\.\s*/, '').trim();
        words.push(word);
      }
    }
    return words;
  }

  async answerSeedphraseVerification(seedphraseWords: string[]): Promise<void> {
    await this.verifySeedphraseTitle.waitFor({
      state: 'visible',
      timeout: 15000,
    });
    const verificationCount = 3;

    for (let i = 0; i < verificationCount; i++) {
      const questionText = await this.page
        .locator('text=/select word/i')
        .textContent();
      if (!questionText) continue;

      const match = questionText.match(/word\s*#?\s*(\d+)/i);
      if (!match) continue;

      const wordNumber = parseInt(match[1], 10);
      const correctWord = seedphraseWords[wordNumber - 1];

      await this.selectVerificationWord(correctWord);
    }
  }

  private async selectVerificationWord(word: string): Promise<void> {
    const wordButton = this.page.getByRole('button', {
      name: word,
      exact: true,
    });
    await wordButton.waitFor({ state: 'visible', timeout: 5000 });
    await wordButton.click();
    await this.page.waitForTimeout(300);
  }

  async completeManualWalletCreation(
    walletName: string,
    password: string,
  ): Promise<void> {
    // Get seedphrase
    const seedphraseWords = await this.getSeedphraseWords();

    // Agree to terms and continue
    await this.createWalletTermsCheckbox.check();
    await this.nextButton.click();

    // Answer seedphrase verification
    await this.answerSeedphraseVerification(seedphraseWords);
    await this.nextButton.click();

    // Fill wallet details
    await this.fillWalletDetails(walletName, password);
    await this.nextButton.click();

    // Customize Core step
    await this.customizeCoreStep();

    // Select Avatar step
    await this.selectAvatarStep();

    // Complete onboarding
    await this.completeOnboarding();
  }
}
