import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/extension.fixture';
import { SendPage } from '../pages/extension/SendPage';
import {
  setFeatureFlagOverrides,
  waitForFeatureFlagValue,
} from '../helpers/featureFlagHelpers';

const SEND_TEST_TIMEOUT_MS = 180_000;

// FeatureVars.SAE_OVERRIDE; 'enabled' turns SAE on, which disables optimistic
// confirmations (including on Avalanche C-Chain) so a pending toast is always
// shown before confirmation.
const SAE_OVERRIDE_FLAG = 'sae-override';

const CCHAIN_AVAX_SEND = {
  amount: '0.0001',
  recipientAccount: 'Account 2',
};

async function openCChainAvaxApproval(
  page: Page,
  sendPage: SendPage,
): Promise<void> {
  // Developer (testnet) mode is on ⇒ Avalanche C-Chain is Fuji (43113), never
  // mainnet (43114). Assert it before entering an amount or approving.
  await expect(page.getByText('Testnet mode is on')).toBeVisible({
    timeout: 30_000,
  });

  await sendPage.openSendFromPortfolioHome();
  await sendPage.selectFujiCChainAvax();
  await sendPage.enterAmount(CCHAIN_AVAX_SEND.amount);
  await sendPage.selectRecipientAccount(CCHAIN_AVAX_SEND.recipientAccount);

  await expect
    .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15_000 })
    .toBe(true);

  await sendPage.clickSend();
  await sendPage.waitForApprovalScreen();

  await expect(sendPage.getApprovalDetailRow('Network')).toContainText(
    'Avalanche',
  );

  if (await sendPage.isGaslessToggleVisible()) {
    await sendPage.toggleGaslessOff();
    await expect(sendPage.getGaslessCheckbox()).not.toBeChecked();
  }
}

test.describe('Transaction Toast Tests', () => {
  test(
    'As a CORE ext user with an extension wallet, verify the banner for "Transaction pending"',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:TOAST-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
      const sendPage = new SendPage(unlockedExtensionPage);

      await setFeatureFlagOverrides(unlockedExtensionPage, {
        [SAE_OVERRIDE_FLAG]: 'enabled',
      });
      await waitForFeatureFlagValue(
        unlockedExtensionPage,
        SAE_OVERRIDE_FLAG,
        'enabled',
      );

      await openCChainAvaxApproval(unlockedExtensionPage, sendPage);

      // The pending toast is dismissed on confirmation, so start watching for
      // it before approving.
      const pendingToastPromise =
        sendPage.waitForPendingToast(SEND_TEST_TIMEOUT_MS);

      await sendPage.approveTransaction();

      const pendingToast = await pendingToastPromise;
      await expect(pendingToast).toContainText('Transaction pending');
    },
  );

  test(
    'As a CORE ext user with an extension wallet, verify the banner for "Transaction successful"',
    {
      tag: ['@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:TOAST-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
      const sendPage = new SendPage(unlockedExtensionPage);

      await openCChainAvaxApproval(unlockedExtensionPage, sendPage);

      const successToastPromise =
        sendPage.waitForSuccessToast(SEND_TEST_TIMEOUT_MS);

      await sendPage.approveTransaction();

      const successToast = await successToastPromise;
      await expect(successToast).toContainText('Transaction successful');

      await expect(sendPage.getToastExplorerLink()).toBeVisible({
        timeout: 15_000,
      });

      const txHash = await sendPage.getTxHashFromToast();
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    },
  );
});
