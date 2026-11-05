import { expect, type Page } from '@playwright/test';
import { PortfolioPage } from '../pages/extension/PortfolioPage';
import { SettingsPage } from '../pages/extension/SettingsPage';

/**
 * Ensures testnet (developer) mode is the active network before a test runs.
 *
 * Tests seed a `testnet*` snapshot expecting Fuji to be the active network, but
 * under parallel load the service worker's network init can fail to resolve the
 * stored testnet scope against a contended chainlist and fall back to mainnet
 * (NetworkService.init). Enabling testnet mode explicitly via Settings makes the
 * active network deterministic regardless of that race. No-op when the snapshot
 * already applied testnet.
 */
export async function ensureTestnetMode(page: Page): Promise<void> {
  const testnetBanner = page.getByText('Testnet mode is on');

  const alreadyOn = await testnetBanner
    .waitFor({ state: 'visible', timeout: 8_000 })
    .then(() => true)
    .catch(() => false);
  if (alreadyOn) {
    return;
  }

  const portfolio = new PortfolioPage(page);
  const settings = new SettingsPage(page);

  await portfolio.openSettings();
  await settings.waitForLoaded();
  await settings.setTestnet(true);
  await settings.goBackToPortfolio();

  await expect(testnetBanner).toBeVisible({ timeout: 30_000 });
}
