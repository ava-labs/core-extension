import { Page } from '@playwright/test';

export async function importWalletWithRecovery(page: Page, recoveryPhrase: string, password: string): Promise<void> {
  console.log('Importing wallet with recovery phrase...');

  // These selectors should match your extension's UI
  // Update them based on your actual implementation
  await page.getByRole('button', { name: /import/i }).click();
  await page.fill('[data-testid="recovery-phrase-input"]', recoveryPhrase);
  await page.fill('[data-testid="password-input"]', password);
  await page.fill('[data-testid="confirm-password-input"]', password);
  await page.getByRole('button', { name: /continue|import/i }).click();

  // Wait for wallet to be imported
  await page.waitForURL(/.*home.*/);

  console.log('Wallet imported');
}

export async function createNewWallet(page: Page, password: string): Promise<string> {
  console.log('Creating new wallet...');

  // These selectors should match your extension's UI
  // Update them based on your actual implementation
  await page.getByRole('button', { name: /create.*wallet/i }).click();
  await page.fill('[data-testid="password-input"]', password);
  await page.fill('[data-testid="confirm-password-input"]', password);
  await page.getByRole('button', { name: /continue|create/i }).click();

  // Get recovery phrase
  const recoveryPhraseElement = page.locator('[data-testid="recovery-phrase"]');
  const recoveryPhrase = (await recoveryPhraseElement.textContent()) || '';

  // Confirm recovery phrase
  await page.getByRole('button', { name: /continue|next/i }).click();

  console.log('Wallet created');
  return recoveryPhrase.trim();
}

export async function unlockWallet(page: Page, password: string): Promise<void> {
  console.log('Unlocking wallet...');

  // Wait for password input to appear
  const passwordInput = page.locator('input[type="password"]');

  try {
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Password input found');
  } catch (_error) {
    console.log('No password input found - checking if wallet is already unlocked...');

    // Check if we're on a page that indicates the wallet is already unlocked
    const currentUrl = page.url();
    if (currentUrl.includes('home') && !currentUrl.includes('onboard')) {
      console.log('Already on home page - wallet appears to be unlocked');
      return;
    }

    // Otherwise, this is an error
    throw new Error(`Password input not found. Current URL: ${currentUrl}`);
  }

  // Enter password
  await passwordInput.fill(password);
  console.log('Password entered');

  // Click unlock/login button
  const unlockButton = page.getByRole('button', { name: /unlock|log.*in|continue/i });
  await unlockButton.click();
  console.log('Unlock button clicked');

  // Wait for unlock to complete (password input should disappear)
  await passwordInput.waitFor({ state: 'hidden', timeout: 15000 });
  console.log('Password input hidden - wallet unlocked');

  // Wait for the Portfolio/Home page to load
  // This can be identified by the presence of certain elements on the main page
  try {
    // Wait for URL to change from login/lock screen
    await page.waitForTimeout(1000);
    console.log('Waiting for Portfolio page to load...');

    // Wait for network load to be idle
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.log('Network not idle, continuing anyway');
    });

    console.log('Wallet unlocked and Portfolio page loaded');
  } catch (error) {
    console.warn('Portfolio page may not have fully loaded:', error);
  }
}

export async function lockWallet(page: Page): Promise<void> {
  console.log('Locking wallet...');

  // Open menu/settings
  await page.getByRole('button', { name: /menu|settings/i }).click();

  // Click lock/sign out
  await page.getByRole('button', { name: /lock|sign.*out|log.*out/i }).click();

  // Wait for lock screen to appear
  await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 5000 });

  console.log('Wallet locked');
}

export async function getTokenBalance(page: Page, tokenSymbol: string): Promise<string> {
  // This selector should match your extension's UI
  const balanceElement = page.locator(`[data-testid="balance-${tokenSymbol}"]`);
  await balanceElement.waitFor({ state: 'visible', timeout: 10000 });

  const balance = await balanceElement.textContent();
  return balance?.trim() || '0';
}

export async function switchNetwork(page: Page, network: string): Promise<void> {
  console.log(`Switching to ${network}...`);

  // Open network selector
  await page.getByRole('button', { name: /network/i }).click();

  // Select network
  await page.getByRole('button', { name: new RegExp(network, 'i') }).click();

  // Wait for network switch to complete
  await page.waitForTimeout(2000);

  console.log(`Switched to ${network}`);
}

export async function getCurrentAccountAddress(page: Page): Promise<string> {
  // This should be adjusted based on your extension's storage structure
  return await page.evaluate(async () => {
    return new Promise<string>((resolve) => {
      chrome.storage.local.get(['wallet'], (result) => {
        const address = result.wallet?.accounts?.[result.wallet?.activeAccountIndex]?.addressC || '';
        resolve(address);
      });
    });
  });
}
