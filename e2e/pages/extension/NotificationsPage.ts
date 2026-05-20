import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type NotificationTabName = 'All' | 'Transactions' | 'Prices';

/**
 * Notifications page (`/notifications`).
 *
 * Cross-chain swap transfers are persisted by `TransferTrackingService` and
 * surface here via `useTransferTrackingContext()` merged into the combined
 * activity list (`Notifications.tsx`). Single-chain swaps are NOT persisted,
 * so they never appear in this list — this POM is cross-chain-aware by
 * design.
 *
 * Tab semantics (per `Notifications.tsx`):
 *   - `All` and `Transactions` include transfers
 *   - `Prices` excludes transfers
 */
export class NotificationsPage extends BasePage {
  readonly notificationsButton: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);
    this.notificationsButton = page.getByTestId('notifications-button');
    this.emptyState = page.getByTestId('notifications-empty-state');
  }

  /**
   * Opens the Notifications page by clicking the header bell icon. Waits for
   * the URL to land on `#/notifications`.
   */
  async openFromHeader(timeout = 10_000): Promise<void> {
    await this.notificationsButton.waitFor({ state: 'visible', timeout });
    await this.notificationsButton.click();
    await this.page.waitForURL(/#\/notifications/, { timeout });
  }

  tab(name: NotificationTabName): Locator {
    // The Notifications page renders an MUI TabMenu with stable labels.
    // `getByRole('tab', { name })` is the preferred selector per the
    // workspace e2e locator rules.
    return this.page.getByRole('tab', { name, exact: true });
  }

  async selectTab(name: NotificationTabName): Promise<void> {
    const tab = this.tab(name);
    await tab.waitFor({ state: 'visible', timeout: 10_000 });
    await tab.click();
    // Small settle window for the tab transition / list re-render.
    await this.page.waitForTimeout(300);
  }

  transferItem(transferId: string): Locator {
    return this.page.getByTestId(`notification-transfer-item-${transferId}`);
  }

  /**
   * Asserts the given cross-chain transfer is present, in progress, and shows
   * a syncing icon. Use after opening Notifications while the swap is still
   * mid-flight.
   */
  async assertInProgressTransferVisible(args: {
    transferId: string;
    sourceSymbol: string;
    targetSymbol: string;
  }): Promise<void> {
    const item = this.transferItem(args.transferId);
    await expect(item).toBeVisible({ timeout: 10_000 });
    await expect(item).toContainText(
      new RegExp(
        `Swapping\\s+${escapeRegExp(args.sourceSymbol)}\\s+to\\s+${escapeRegExp(
          args.targetSymbol,
        )}\\s+in progress`,
        'i',
      ),
    );
    await expect(
      item.getByTestId('notification-transfer-icon-syncing'),
    ).toBeVisible();
  }

  /**
   * Asserts the given cross-chain transfer is present and shows the completed
   * icon. Use after `waitForCrossChainComplete()` returns.
   */
  async assertCompletedTransferVisible(args: {
    transferId: string;
    sourceSymbol: string;
    targetSymbol: string;
  }): Promise<void> {
    const item = this.transferItem(args.transferId);
    await expect(item).toBeVisible({ timeout: 10_000 });
    await expect(item).toContainText(
      new RegExp(
        `Swapped\\s+${escapeRegExp(args.sourceSymbol)}\\s+to\\s+${escapeRegExp(
          args.targetSymbol,
        )}`,
        'i',
      ),
    );
    await expect(
      item.getByTestId('notification-transfer-icon-completed'),
    ).toBeVisible();
  }

  /**
   * Clicks the transfer item and waits for the URL to deeplink back to the
   * progress page (`/fusion-transfer/:id`).
   */
  async clickTransferItem(transferId: string): Promise<void> {
    await this.transferItem(transferId).click();
    await this.page.waitForURL(
      new RegExp(`#/fusion-transfer/${escapeRegExp(transferId)}`),
      { timeout: 10_000 },
    );
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
