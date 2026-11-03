import { test, expect } from '../fixtures/extension.fixture';
import { SendPage } from '../pages/extension/SendPage';
import { TEST_SEND } from '../constants';
import {
  setFeatureFlagOverrides,
  waitForFeatureFlagValue,
} from '../helpers/featureFlagHelpers';

const SEND_TEST_TIMEOUT_MS = 180_000;

// FeatureVars.SAE_OVERRIDE; 'enabled' turns SAE on, which disables optimistic
// confirmations so a pending toast is always shown before confirmation.
const SAE_OVERRIDE_FLAG = 'sae-override';

async function submitToApproval(sendPage: SendPage): Promise<void> {
  await expect
    .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15_000 })
    .toBe(true);

  await sendPage.clickSend();
  await sendPage.waitForApprovalScreen();
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
      const sendData = TEST_SEND.ETH;

      await setFeatureFlagOverrides(unlockedExtensionPage, {
        [SAE_OVERRIDE_FLAG]: 'enabled',
      });
      await waitForFeatureFlagValue(
        unlockedExtensionPage,
        SAE_OVERRIDE_FLAG,
        'enabled',
      );

      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectTokenBySymbolAndChainBadge(
        sendData.tokenSearchTerm,
        sendData.chainBadgeAltText,
        sendData.chainFilterChip,
      );
      await sendPage.enterAmount(sendData.amount);
      await sendPage.selectRecipientAccount(sendData.recipientAccount);
      await submitToApproval(sendPage);

      const networkRow = sendPage.getApprovalDetailRow('Network');
      await expect(networkRow).toContainText(sendData.networkLabel);

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

      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectTokenBySymbolAndChainBadge(
        TEST_SEND.CCHAIN_AVAX.tokenSymbol,
        /\(C-Chain\)/i,
      );
      await sendPage.enterAmount(TEST_SEND.CCHAIN_AVAX.amount);
      await sendPage.selectRecipientAccount(
        TEST_SEND.CCHAIN_AVAX.recipientAccount,
      );
      await submitToApproval(sendPage);

      const networkRow = sendPage.getApprovalDetailRow('Network');
      await expect(networkRow).toContainText('Avalanche');

      if (await sendPage.isGaslessToggleVisible()) {
        await sendPage.toggleGaslessOff();
        await expect(sendPage.getGaslessCheckbox()).not.toBeChecked();
      }

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
