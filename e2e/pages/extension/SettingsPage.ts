/**
 * Settings Page - app settings, including the "Show highlights" toggle that
 * controls the Portfolio highlights/trending banner carousel.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SettingsPage extends BasePage {
  readonly showHighlightsToggle: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.showHighlightsToggle = page.locator(
      '[data-testid="settings-show-highlights-toggle"]',
    );
    this.backButton = page.locator('[data-testid="page-back-button"]');
  }

  async waitForLoaded(): Promise<void> {
    await this.showHighlightsToggle.waitFor({
      state: 'visible',
      timeout: 15_000,
    });
  }

  /**
   * The k2 Switch renders an inner checkbox input; read its checked state.
   */
  async isHighlightsEnabled(): Promise<boolean> {
    const input = this.showHighlightsToggle.locator('input[type="checkbox"]');
    return input.isChecked();
  }

  async setHighlights(enabled: boolean): Promise<void> {
    const current = await this.isHighlightsEnabled();
    if (current !== enabled) {
      await this.showHighlightsToggle.click();
      await expect
        .poll(() => this.isHighlightsEnabled(), { timeout: 5_000 })
        .toBe(enabled);
    }
  }

  /**
   * Returns to the Portfolio home. Settings' back navigates to `/`.
   */
  async goBackToPortfolio(): Promise<void> {
    await this.page.evaluate(() => {
      window.location.hash = '#/';
    });
    await this.page.waitForURL(/#\/(\?|$)/, { timeout: 10_000 });
  }
}
