/**
 * Onboarding Page - First-time setup and wallet creation/import
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForExtensionLoad } from '../../helpers/extensionHelpers';
import { unlockWallet } from '../../helpers/walletHelpers';

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
  readonly extensionId: string | null;

  constructor(page: Page) {
    super(page);
    this.extensionId = this.getExtensionIdFromUrl(page.url());
    // Onboarding screen elements
    this.coreLogo = page.getByRole('img', { name: /core logo/i });
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
    this.backButton = page.locator('[data-testid="page-back-button"] svg');
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
    const isImportButtonVisible = await this.isVisible(this.importWalletButton);
    const isCreateButtonVisible = await this.isVisible(this.createWalletButton);
    const isSocialButtonVisible = await this.isVisible(
      this.continueWithGoogleButton,
    );
    return (
      (isImportButtonVisible && isCreateButtonVisible) || isSocialButtonVisible
    );
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
    const promptBlocks = this.page.locator('p', {
      hasText: /^Select/i,
    });
    const promptCount = await promptBlocks.count();

    for (let i = 0; i < promptCount; i++) {
      const prompt = promptBlocks.nth(i);
      const promptText = (await prompt.textContent())?.trim() ?? '';
      const optionsContainer = prompt.locator('..');
      const optionButtons = optionsContainer.getByRole('button');
      const optionTexts = (await optionButtons.allTextContents()).map((text) =>
        text.trim(),
      );

      const correctWord = this.resolveVerificationWord(
        promptText,
        seedphraseWords,
        optionTexts,
      );
      if (!correctWord) {
        continue;
      }

      await this.selectVerificationWord(optionButtons, correctWord);
    }
  }

  private async selectVerificationWord(
    buttons: Locator,
    word: string,
  ): Promise<void> {
    const wordButton = buttons.filter({ hasText: word }).first();
    await wordButton.waitFor({ state: 'visible', timeout: 5000 });
    await wordButton.click();
    await this.page.waitForTimeout(300);
  }

  private resolveVerificationWord(
    promptText: string,
    seedphraseWords: string[],
    optionTexts: string[],
  ): string | undefined {
    const normalized = this.normalizePromptText(promptText);

    if (normalized.includes('select the first word')) {
      return seedphraseWords[0];
    }
    if (normalized.includes('select the last word')) {
      return seedphraseWords[seedphraseWords.length - 1];
    }

    const indexMatch = normalized.match(/word\s*#?\s*(\d+)/i);
    if (indexMatch) {
      const index = Number(indexMatch[1]);
      if (
        Number.isFinite(index) &&
        index > 0 &&
        index <= seedphraseWords.length
      ) {
        return seedphraseWords[index - 1];
      }
    }

    const afterMatch = normalized.match(/after\s+"?([a-z]+)"?/i);
    if (afterMatch) {
      return this.findRelativeWord(
        afterMatch[1],
        seedphraseWords,
        optionTexts,
        1,
      );
    }

    const beforeMatch = normalized.match(/before\s+"?([a-z]+)"?/i);
    if (beforeMatch) {
      return this.findRelativeWord(
        beforeMatch[1],
        seedphraseWords,
        optionTexts,
        -1,
      );
    }

    return undefined;
  }

  private findRelativeWord(
    anchor: string,
    seedphraseWords: string[],
    optionTexts: string[],
    offset: 1 | -1,
  ): string | undefined {
    const anchorLower = anchor.toLowerCase();
    const optionsLower = optionTexts.map((option) => option.toLowerCase());

    for (let i = 0; i < seedphraseWords.length; i++) {
      if (seedphraseWords[i].toLowerCase() !== anchorLower) continue;
      const targetIndex = i + offset;
      if (targetIndex < 0 || targetIndex >= seedphraseWords.length) continue;
      const candidate = seedphraseWords[targetIndex];
      if (optionsLower.includes(candidate.toLowerCase())) {
        return candidate;
      }
    }

    const fallbackIndex = seedphraseWords.findIndex(
      (word) => word.toLowerCase() === anchorLower,
    );
    if (fallbackIndex === -1) {
      return undefined;
    }
    const targetIndex = fallbackIndex + offset;
    if (targetIndex < 0 || targetIndex >= seedphraseWords.length) {
      return undefined;
    }
    return seedphraseWords[targetIndex];
  }

  private normalizePromptText(text: string): string {
    return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").toLowerCase();
  }

  private getExtensionIdFromUrl(url: string): string | null {
    try {
      return new URL(url).host;
    } catch {
      return null;
    }
  }

  async getActiveExtensionPage(): Promise<Page> {
    const context = this.page.context();
    const extensionId = this.extensionId;

    const candidates = context
      .pages()
      .filter(
        (page) =>
          !page.isClosed() &&
          (!extensionId || page.url().includes(extensionId)),
      );
    const existingPage =
      candidates.find((page) => page.url().includes('popup.html')) ??
      candidates.find((page) => page.url().includes('home.html')) ??
      candidates[0];

    if (existingPage) {
      await waitForExtensionLoad(existingPage, 45000);
      if (!existingPage.isClosed()) {
        return existingPage;
      }
    }

    const openedPage = await context
      .waitForEvent('page', { timeout: 15000 })
      .catch(() => undefined);
    if (
      openedPage &&
      !openedPage.isClosed() &&
      (!extensionId || openedPage.url().includes(extensionId))
    ) {
      await waitForExtensionLoad(openedPage, 45000);
      if (!openedPage.isClosed()) {
        return openedPage;
      }
    }

    if (extensionId) {
      const fallbackPage = await context.newPage();
      await fallbackPage.goto(`chrome-extension://${extensionId}/popup.html`, {
        waitUntil: 'domcontentloaded',
      });
      await waitForExtensionLoad(fallbackPage, 45000);
      return fallbackPage;
    }

    const fallbackPage = context
      .pages()
      .find(
        (page) =>
          !page.isClosed() && page.url().includes('chrome-extension://'),
      );
    const pageToUse = fallbackPage ?? this.page;
    if (!pageToUse.isClosed()) {
      await waitForExtensionLoad(pageToUse, 45000);
    }
    return pageToUse;
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

  async unlockIfNeeded(page: Page, password: string): Promise<void> {
    const passwordInput = page.getByPlaceholder(/password/i);
    const isLocked = await passwordInput
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (isLocked) {
      await unlockWallet(page, password);
    }
  }
}
