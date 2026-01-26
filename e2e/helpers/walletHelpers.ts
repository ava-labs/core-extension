import type { Page } from '@playwright/test';
import { TEST_CONFIG } from '../constants';

/**
 * Unlocks the wallet with the provided password
 */
export async function unlockWallet(
  page: Page,
  password?: string,
): Promise<void> {
  const walletPassword = password || TEST_CONFIG.wallet.password;

  // Wait for the password input to be visible
  const passwordInput = page.getByPlaceholder(/password/i);
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });

  // Enter password
  await passwordInput.fill(walletPassword);

  // Click unlock/login button (label differs across flows)
  const unlockButton = page.getByRole('button', {
    name: /(login)/i,
  });
  await unlockButton.click();

  // Wait for unlock to complete (portfolio or main view should be visible)
  await page.waitForTimeout(2000);
}

/**
 * Locks the wallet
 */
export async function lockWallet(page: Page): Promise<void> {
  // Navigate to settings and lock
  const settingsButton = page.getByRole('button', { name: /settings/i });
  await settingsButton.click();

  const lockButton = page.getByRole('button', { name: /lock/i });
  await lockButton.click();

  // Wait for lock screen
  await page.waitForSelector('input[type="password"]', {
    state: 'visible',
    timeout: 10000,
  });
}

/**
 * Creates a new wallet with the given recovery phrase
 */
export async function importWalletWithRecoveryPhrase(
  page: Page,
  recoveryPhrase: string[],
  walletName: string,
  password: string,
): Promise<void> {
  // This is a placeholder - implementation depends on the actual UI flow
  console.log(
    `Importing wallet ${walletName} with ${recoveryPhrase.length} words`,
  );

  // Enter recovery phrase words
  for (let i = 0; i < recoveryPhrase.length; i++) {
    const wordInput = page.getByTestId(`word-${i + 1}`);
    await wordInput.fill(recoveryPhrase[i]);
  }

  // Set wallet name
  const nameInput = page.getByPlaceholder(/wallet name/i);
  await nameInput.fill(walletName);

  // Set password
  const passwordInput = page.getByPlaceholder(/^password$/i);
  await passwordInput.fill(password);

  const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
  await confirmPasswordInput.fill(password);

  // Submit
  const submitButton = page.getByRole('button', {
    name: /next|create|import/i,
  });
  await submitButton.click();
}

/**
 * Checks if the wallet is locked
 */
export async function isWalletLocked(page: Page): Promise<boolean> {
  const passwordInput = page.getByPlaceholder(/password/i);
  return await passwordInput.isVisible().catch(() => false);
}

/**
 * Gets the current wallet balance (placeholder)
 */
export async function getWalletBalance(page: Page): Promise<string> {
  const balanceElement = page.getByTestId('total-balance');
  return (await balanceElement.textContent()) || '0';
}
