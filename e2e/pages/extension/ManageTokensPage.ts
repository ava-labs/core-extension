import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type TokenRef = { id: string; address: string };

// Inline warning shown by AddCustomToken.tsx when the catalog already lists
// the token (see useAddCustomToken.ts).
export const DUPLICATE_WARNING = 'Token already exists in the wallet.';

export class ManageTokensPage extends BasePage {
  readonly portfolioManageButton: Locator;

  readonly pageRoot: Locator;
  readonly searchInput: Locator;
  readonly hideSpamSwitch: Locator;
  readonly hideNoBalanceSwitch: Locator;
  readonly addCustomButton: Locator;
  readonly tokenRows: Locator;
  readonly toggleableRows: Locator;
  readonly scamIndicators: Locator;
  readonly noResults: Locator;

  readonly addressInput: Locator;
  readonly addSubmitButton: Locator;
  readonly addError: Locator;

  constructor(page: Page) {
    super(page);

    this.portfolioManageButton = page.locator(
      '[data-testid="portfolio-manage-tokens-button"]',
    );

    this.pageRoot = page.locator('[data-testid="manage-tokens-page"]');
    this.searchInput = page.locator(
      '[data-testid="manage-tokens-search-input"] input',
    );
    this.hideSpamSwitch = page.locator(
      '[data-testid="manage-tokens-hide-spam-switch"] input',
    );
    this.hideNoBalanceSwitch = page.locator(
      '[data-testid="manage-tokens-hide-no-balance-switch"] input',
    );
    this.addCustomButton = page.locator(
      '[data-testid="manage-tokens-add-custom-button"]',
    );
    this.tokenRows = page.locator('[data-testid="manage-tokens-item"]');
    this.toggleableRows = this.tokenRows.filter({
      has: page.locator('[data-testid="manage-tokens-item-switch"]'),
    });
    this.scamIndicators = page.locator(
      '[data-testid="manage-tokens-scam-indicator"]',
    );
    this.noResults = page.getByText('No results found');

    this.addressInput = page.locator(
      '[data-testid="add-custom-token-address-input"] textarea:not([aria-hidden="true"])',
    );
    this.addSubmitButton = page.locator(
      '[data-testid="add-custom-token-submit-button"]',
    );
    this.addError = page.locator('[data-testid="add-custom-token-error"]');
  }

  async openFromPortfolio(): Promise<void> {
    await this.portfolioManageButton.waitFor({
      state: 'visible',
      timeout: 60_000,
    });
    await this.portfolioManageButton.click();
    await this.waitForLoaded();
  }

  async waitForLoaded(): Promise<void> {
    await this.pageRoot.waitFor({ state: 'visible', timeout: 30_000 });
    await this.page.waitForURL(/#\/manage-tokens(\?|$)/, { timeout: 10_000 });
  }

  async ensureOnList(): Promise<void> {
    if (!/#\/manage-tokens(\?|$)/.test(this.page.url())) {
      await this.page.evaluate(() => {
        window.location.hash = '#/manage-tokens';
      });
      await this.waitForLoaded();
    }
  }

  async waitForListLoaded(timeout = 60_000): Promise<void> {
    await this.tokenRows.first().waitFor({ state: 'visible', timeout });
  }

  async rowCount(): Promise<number> {
    return this.tokenRows.count();
  }

  rowById(id: string): Locator {
    return this.page.locator(
      `[data-testid="manage-tokens-item"][data-token-id="${id}"]`,
    );
  }

  rowByAddress(address: string): Locator {
    return this.page.locator(
      `[data-testid="manage-tokens-item"][data-token-address="${address.toLowerCase()}"]`,
    );
  }

  private async readRowAttributes(
    attr: string,
    rows: Locator = this.tokenRows,
  ): Promise<string[]> {
    return rows.evaluateAll(
      (els, attribute) => els.map((el) => el.getAttribute(attribute) ?? ''),
      attr,
    );
  }

  async visibleRowIds(): Promise<string[]> {
    return this.readRowAttributes('data-token-id');
  }

  async toggleableTokens(): Promise<TokenRef[]> {
    const count = await this.toggleableRows.count();
    const refs: TokenRef[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.toggleableRows.nth(i);
      refs.push({
        id: (await row.getAttribute('data-token-id')) ?? '',
        address: (await row.getAttribute('data-token-address')) ?? '',
      });
    }
    return refs;
  }

  async search(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: 'visible', timeout: 15_000 });
    await this.searchInput.fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
  }

  async waitForSearchSettled(): Promise<void> {
    await this.tokenRows
      .first()
      .or(this.noResults)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  private rowSwitch(id: string): Locator {
    return this.rowById(id)
      .first()
      .locator('[data-testid="manage-tokens-item-switch"]');
  }

  async findToggleableTokenFromPortfolio(
    portfolioIds: string[],
  ): Promise<TokenRef> {
    for (const id of portfolioIds) {
      const [type, identifier] = id.split(':');
      if ((type !== 'ERC20' && type !== 'SPL') || !identifier) {
        continue;
      }
      await this.search(identifier);
      const row = this.rowById(id).first();
      const found = await row
        .waitFor({ state: 'visible', timeout: 10_000 })
        .then(() => true)
        .catch(() => false);
      const hasSwitch =
        found &&
        (await row
          .locator('[data-testid="manage-tokens-item-switch"]')
          .count()) > 0;
      await this.clearSearch();
      if (hasSwitch) {
        return { id, address: identifier };
      }
    }
    throw new Error(
      'No Portfolio-visible toggleable (ERC-20/SPL) token found in Manage Tokens.',
    );
  }

  async isTokenEnabled(token: TokenRef): Promise<boolean> {
    await this.search(token.address);
    await this.rowById(token.id)
      .first()
      .waitFor({ state: 'visible', timeout: 30_000 });
    return this.rowSwitch(token.id).locator('input').isChecked();
  }

  async setTokenEnabled(token: TokenRef, enabled: boolean): Promise<void> {
    await this.waitForListLoaded();
    await this.search(token.address);
    const row = this.rowById(token.id).first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });

    const input = this.rowSwitch(token.id).locator('input');
    if ((await input.isChecked()) === enabled) {
      return;
    }
    await this.rowSwitch(token.id).click();
    await expect(input).toBeChecked({ checked: enabled, timeout: 10_000 });
  }

  async setHideSpam(hidden: boolean): Promise<void> {
    await this.setSwitch(this.hideSpamSwitch, hidden);
  }

  async setHideNoBalance(hidden: boolean): Promise<void> {
    await this.setSwitch(this.hideNoBalanceSwitch, hidden);
  }

  private async setSwitch(input: Locator, checked: boolean): Promise<void> {
    await input.waitFor({ state: 'attached', timeout: 15_000 });
    if ((await input.isChecked()) === checked) {
      return;
    }
    await input.click();
    await expect(input).toBeChecked({ checked, timeout: 10_000 });
  }

  /**
   * Scrolls the virtualized token list from top to bottom looking for a scam
   * indicator, so the check does not depend on a flagged row happening to be
   * among the initially mounted react-window rows. Only returns false once the
   * end of the list has been positively reached; throws if the scroll
   * container is missing or the step cap is hit before the end, so a "no scam
   * token" result always reflects a complete scan.
   */
  async hasScamIndicator(): Promise<boolean> {
    await this.waitForListLoaded();
    if ((await this.scamIndicators.count()) > 0) {
      return true;
    }

    const maxSteps = 200;
    for (let step = 0; step < maxSteps; step++) {
      const progress = await this.tokenRows.first().evaluate((rowEl) => {
        const scroller = rowEl.closest(
          'div[style*="overflow"]',
        ) as HTMLElement | null;
        if (!scroller) {
          return null;
        }
        scroller.scrollTop = Math.min(
          scroller.scrollTop + scroller.clientHeight,
          scroller.scrollHeight,
        );
        return {
          atEnd:
            scroller.scrollTop + scroller.clientHeight >=
            scroller.scrollHeight - 1,
        };
      });

      if (progress === null) {
        throw new Error(
          'Manage Tokens list scroll container not found; cannot complete a full scam-token scan.',
        );
      }

      await this.page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );

      if ((await this.scamIndicators.count()) > 0) {
        return true;
      }
      if (progress.atEnd) {
        return false;
      }
    }

    throw new Error(
      'Manage Tokens list did not reach the end within the scroll-step cap; scam-token scan incomplete.',
    );
  }

  async openAddCustom(): Promise<void> {
    await this.addCustomButton.click();
    await this.page.waitForURL(/#\/manage-tokens\/add-custom/, {
      timeout: 10_000,
    });
    await this.addressInput.waitFor({ state: 'visible', timeout: 15_000 });
  }

  private async fillAndValidate(
    address: string,
    timeout = 20_000,
    attempts = 3,
  ): Promise<boolean> {
    // Validation calls the chain for token metadata; a transient RPC failure
    // surfaces as "Not a valid ERC-20 token…" and leaves the button disabled.
    // That is retryable. The catalog-duplicate warning is terminal, so return
    // immediately on it rather than burning retries.
    for (let attempt = 0; attempt < attempts; attempt++) {
      await this.addressInput.fill('');
      await this.addressInput.fill(address);
      await this.page
        .waitForFunction(
          () => {
            const button = document.querySelector(
              '[data-testid="add-custom-token-submit-button"]',
            ) as HTMLButtonElement | null;
            const error = document.querySelector(
              '[data-testid="add-custom-token-error"]',
            );
            return (
              (!!button && !button.disabled) ||
              (!!error && (error.textContent ?? '').trim().length > 0)
            );
          },
          undefined,
          { timeout },
        )
        .catch(() => {});

      if (await this.addSubmitButton.isEnabled()) {
        return true;
      }

      const error = (await this.addError.textContent().catch(() => ''))?.trim();
      if (error === DUPLICATE_WARNING) {
        return false;
      }

      if (attempt < attempts - 1) {
        await this.page.waitForTimeout(2_000);
      }
    }
    return this.addSubmitButton.isEnabled();
  }

  async enterValidatedAddress(address: string): Promise<void> {
    const enabled = await this.fillAndValidate(address);
    if (!enabled) {
      throw new Error(
        `Add Token stayed disabled for ${address}; on-chain metadata validation did not succeed (possible RPC throttling).`,
      );
    }
  }

  async submitCustomToken(): Promise<void> {
    await expect(this.addSubmitButton).toBeEnabled({ timeout: 30_000 });
    await this.addSubmitButton.click();
  }

  /**
   * After submitting a catalog-duplicate address, reports which terminal state
   * the UI reached. The service-worker duplicate check (isTokenAvailable) fails
   * open on a token-aggregator timeout, so a flaky lookup accepts the add and
   * navigates back to the list ('added') instead of rejecting it with the
   * inline warning ('duplicate'). Callers use 'added' to skip rather than
   * report a false duplicate-rejection regression.
   */
  async waitForAddOutcome(timeout = 30_000): Promise<'duplicate' | 'added'> {
    await expect(this.addError.or(this.pageRoot).first()).toBeVisible({
      timeout,
    });
    return (await this.pageRoot.isVisible()) ? 'added' : 'duplicate';
  }

  successToast(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Token Added' });
  }

  /**
   * Adds the first candidate the catalog accepts. A successful add navigates
   * back to the list (pageRoot reappears); a catalog duplicate keeps the
   * add-custom page open with the inline warning. Only the deterministic
   * duplicate warning advances to the next candidate — any other warning or
   * no settled signal in time throws, so a non-duplicate failure fails loudly
   * rather than masquerading as "no candidate was addable".
   */
  async addFirstAddableCandidate(
    addresses: string[],
    addTimeout = 25_000,
  ): Promise<{ address: string; toastTitle: string } | null> {
    for (const address of addresses) {
      await this.ensureOnList();
      await this.openAddCustom();

      if (!(await this.fillAndValidate(address))) {
        throw new Error(
          `Add Token stayed disabled for ${address}; on-chain metadata validation did not succeed (possible RPC throttling).`,
        );
      }
      await this.addSubmitButton.click();

      try {
        await expect(this.pageRoot.or(this.addError).first()).toBeVisible({
          timeout: addTimeout,
        });
      } catch {
        throw new Error(
          `Adding ${address} produced neither a success navigation nor the duplicate warning within ${addTimeout}ms (likely transient RPC failure).`,
        );
      }

      if (await this.pageRoot.isVisible()) {
        const toast = this.successToast();
        const title =
          (await toast
            .locator('[data-title]')
            .first()
            .textContent({ timeout: 5_000 })
            .catch(() => null)) ??
          (await toast.textContent().catch(() => null));
        return { address, toastTitle: (title ?? '').trim() };
      }

      const warning = (await this.addError.textContent())?.trim() ?? '';
      if (warning !== DUPLICATE_WARNING) {
        throw new Error(
          `Adding ${address} failed with an unexpected warning: "${warning}".`,
        );
      }
    }
    return null;
  }
}
