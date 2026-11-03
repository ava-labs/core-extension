import { test, expect } from '../fixtures/extension.fixture';
import { SendPage } from '../pages/extension/SendPage';
import { TEST_SEND } from '../constants';

const SEND_TEST_TIMEOUT_MS = 180_000;

async function prepareCChainAvaxSend(sendPage: SendPage): Promise<void> {
  await sendPage.openSendFromPortfolioHome();
  await sendPage.selectToken(TEST_SEND.CCHAIN_AVAX.tokenSymbol);
  await sendPage.enterAmount(TEST_SEND.CCHAIN_AVAX.amount);
  await sendPage.selectRecipientAccount(TEST_SEND.CCHAIN_AVAX.recipientAccount);

  await expect
    .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15_000 })
    .toBe(true);

  await sendPage.clickSend();
  await sendPage.waitForApprovalScreen();

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

      await prepareCChainAvaxSend(sendPage);

      // The pending toast is dismissed as soon as the tx confirms, so start
      // watching for it before approving to avoid missing a short-lived banner.
      const pendingToastPromise =
        sendPage.waitForPendingToast(SEND_TEST_TIMEOUT_MS);

      await sendPage.approveTransaction();

      const pendingToast = await pendingToastPromise;
      await expect(pendingToast).toContainText('Transaction pending');

      await expect(sendPage.getSuccessToast()).toContainText(
        'Transaction successful',
        { timeout: SEND_TEST_TIMEOUT_MS },
      );
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

      await prepareCChainAvaxSend(sendPage);

      const successToastPromise =
        sendPage.waitForSuccessToast(SEND_TEST_TIMEOUT_MS);

      await sendPage.approveTransaction();

      const successToast = await successToastPromise;
      await expect(successToast).toContainText('Transaction successful');

      await expect(sendPage.getToastExplorerLink()).toBeVisible({
        timeout: 15_000,
      });

      // The explorer link exposes either an EVM hash (0x…) or a base58
      // Avalanche tx id, depending on which AVAX chain the send resolves to.
      const txHash = await sendPage.getTxHashFromToast();
      expect(txHash).toMatch(/^(0x[a-fA-F0-9]{64}|[1-9A-HJ-NP-Za-km-z]{30,})$/);
    },
  );
});
