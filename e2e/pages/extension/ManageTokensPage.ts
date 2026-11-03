import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type TokenRef = { id: string; address: string };

export type AddCustomTokenOutcome = {
  status: 'added' | 'duplicate' | 'timeout';
  toastTitle?: string;
};

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

  async firstToggleableToken(): Promise<TokenRef> {
    const row = this.toggleableRows.first();
    await row.waitFor({ state: 'visible', timeout: 30_000 });
    return {
      id: (await row.getAttribute('data-token-id')) ?? '',
      address: (await row.getAttribute('data-token-address')) ?? '',
    };
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

  async isTokenEnabled(id: string): Promise<boolean> {
    return this.rowSwitch(id).locator('input').isChecked();
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
   * among the initially mounted react-window rows.
   */
  async hasScamIndicator(): Promise<boolean> {
    await this.waitForListLoaded();
    if ((await this.scamIndicators.count()) > 0) {
      return true;
    }
    for (let step = 0; step < 40; step++) {
      const atBottom = await this.tokenRows.first().evaluate((rowEl) => {
        const scroller = rowEl.closest(
          'div[style*="overflow"]',
        ) as HTMLElement | null;
        if (!scroller) {
          return true;
        }
        const previous = scroller.scrollTop;
        scroller.scrollTop = Math.min(
          previous + scroller.clientHeight,
          scroller.scrollHeight,
        );
        return scroller.scrollTop === previous;
      });
      await this.page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      if ((await this.scamIndicators.count()) > 0) {
        return true;
      }
      if (atBottom) {
        break;
      }
    }
    return (await this.scamIndicators.count()) > 0;
  }

  async openAddCustom(): Promise<void> {
    await this.addCustomButton.click();
    await this.page.waitForURL(/#\/manage-tokens\/add-custom/, {
      timeout: 10_000,
    });
    await this.addressInput.waitFor({ state: 'visible', timeout: 15_000 });
  }

  /**
   * Fills the address and waits for on-chain metadata validation to settle:
   * the Add button enables for a resolvable token. The on-chain read can
   * transiently fail under RPC load, leaving the button disabled with an
   * inline error, so re-fill to retry a bounded number of times.
   */
  private async fillAndValidate(
    address: string,
    retries = 2,
  ): Promise<boolean> {
    for (let attempt = 0; attempt <= retries; attempt++) {
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
          { timeout: 45_000 },
        )
        .catch(() => {});
      if (await this.addSubmitButton.isEnabled()) {
        return true;
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

  successToast(): Locator {
    return this.page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Token Added' });
  }

  /**
   * Attempts to add one custom token (assumes the Add Custom Token page is
   * open) and classifies the result from the actual UI signal: the success
   * toast means added; the "already exists" inline warning means the catalog
   * already lists it; anything else (no signal in time, a transient on-chain
   * error) is reported as a retryable timeout rather than a false duplicate.
   */
  async attemptAddCustomToken(address: string): Promise<AddCustomTokenOutcome> {
    if (!(await this.fillAndValidate(address))) {
      return { status: 'timeout' };
    }

    await this.addSubmitButton.click();
    const signal = await this.page
      .waitForFunction(
        () => {
          const added = Array.from(
            document.querySelectorAll('[data-sonner-toast]'),
          ).some((t) => (t.textContent ?? '').includes('Token Added'));
          if (added) {
            return 'added';
          }
          const error = document.querySelector(
            '[data-testid="add-custom-token-error"]',
          );
          const text = (error?.textContent ?? '').trim();
          return text.length > 0 ? `error:${text}` : false;
        },
        undefined,
        { timeout: 60_000 },
      )
      .then((handle) => handle.jsonValue() as Promise<string>)
      .catch(() => null);

    if (signal === 'added') {
      const toast = this.successToast();
      const title =
        (await toast
          .locator('[data-title]')
          .first()
          .textContent()
          .catch(() => null)) ?? (await toast.textContent().catch(() => null));
      return { status: 'added', toastTitle: (title ?? '').trim() };
    }
    if (typeof signal === 'string' && signal.includes('already exists')) {
      return { status: 'duplicate' };
    }
    return { status: 'timeout' };
  }

  async addFirstAddableCandidate(
    addresses: string[],
  ): Promise<{ address: string; toastTitle: string } | null> {
    for (const address of addresses) {
      for (let attempt = 0; attempt < 2; attempt++) {
        await this.ensureOnList();
        await this.openAddCustom();
        const outcome = await this.attemptAddCustomToken(address);
        if (outcome.status === 'added') {
          return { address, toastTitle: outcome.toastTitle ?? '' };
        }
        if (outcome.status === 'duplicate') {
          break;
        }
      }
    }
    return null;
  }
}
