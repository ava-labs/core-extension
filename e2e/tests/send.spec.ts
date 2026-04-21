import { test, expect } from '../fixtures/extension.fixture';
import { SendPage } from '../pages/extension/SendPage';
import { TEST_SEND } from '../constants';
import {
  verifyTransactionOnExplorer,
  type ExplorerNetwork,
} from '../helpers/explorerApi';

const SEND_TEST_TIMEOUT_MS = 180_000;

test.describe('Send Tests', () => {
  test(
    'As a CORE ext user with an extension wallet, I can send C-Chain AVAX with gasless toggled off',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
      const sendPage = new SendPage(unlockedExtensionPage);

      // SND-001: Portfolio → Send → choose token + amount (no prefilled token).
      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectToken(TEST_SEND.CCHAIN_AVAX.tokenSymbol);

      await sendPage.enterAmount(TEST_SEND.CCHAIN_AVAX.amount);
      await sendPage.selectRecipientAccount(
        TEST_SEND.CCHAIN_AVAX.recipientAccount,
      );

      await expect
        .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
        .toBe(true);

      await sendPage.clickSend();
      await sendPage.waitForApprovalScreen();

      // ── Validate transaction approval page ──
      // Token + amount
      await expect(sendPage.getApprovalBalanceChange()).toBeVisible();
      await expect(sendPage.getApprovalTokenSymbol()).toContainText('AVAX');
      await expect(sendPage.getApprovalBalanceChange()).toContainText('0.001');

      // From row — Account 1 with truncated address (0x…)
      const fromRow = sendPage.getApprovalDetailRow('From');
      await expect(fromRow).toBeVisible();
      await expect(fromRow).toContainText('Account 1');
      await expect(fromRow).toContainText(/0x\w{4}…\w{4}/);

      // Network row
      const networkRow = sendPage.getApprovalDetailRow('Network');
      await expect(networkRow).toBeVisible();
      await expect(networkRow).toContainText('Avalanche');

      // To row — Account 2 with truncated address (0x…)
      const toRow = sendPage.getApprovalDetailRow('To');
      await expect(toRow).toBeVisible();
      await expect(toRow).toContainText('Account 2');
      await expect(toRow).toContainText(/0x\w{4}…\w{4}/);

      // Fee preset buttons visible
      await expect(sendPage.getFeePresetSelector()).toBeVisible();
      await expect(sendPage.getFeePresetButton('slow')).toBeVisible();
      await expect(sendPage.getFeePresetButton('normal')).toBeVisible();
      await expect(sendPage.getFeePresetButton('fast')).toBeVisible();
      await expect(sendPage.getFeePresetButton('custom')).toBeVisible();

      // Verify fee presets are selectable and switch active state
      await sendPage.clickFeePreset('slow');
      await expect.poll(() => sendPage.isFeePresetActive('slow')).toBe(true);

      await sendPage.clickFeePreset('normal');
      await expect.poll(() => sendPage.isFeePresetActive('normal')).toBe(true);
      await expect.poll(() => sendPage.isFeePresetActive('slow')).toBe(false);

      await sendPage.clickFeePreset('fast');
      await expect.poll(() => sendPage.isFeePresetActive('fast')).toBe(true);
      await expect.poll(() => sendPage.isFeePresetActive('normal')).toBe(false);

      // Total network fee visible with AVAX symbol
      await expect(sendPage.getApprovalTotalFee()).toBeVisible();
      await expect(sendPage.getApprovalTotalFee()).toContainText('AVAX');

      // Approve / Reject buttons
      await expect(sendPage.getApproveButton()).toBeVisible();
      await expect(sendPage.getApproveButton()).toBeEnabled();
      await expect(sendPage.getRejectButton()).toBeVisible();

      // ── Custom fee: validation error scenario ──

      await sendPage.clickFeePreset('custom');
      await sendPage.waitForCustomFeeScreen();

      // Capture the initial total fee text for comparison
      const initialTotalFee = await sendPage
        .getCustomFeeTotalRow()
        .textContent();

      // Set max priority fee HIGHER than max base fee to trigger error
      await sendPage.fillCustomFeeInput(
        sendPage.getCustomFeeMaxBaseInput(),
        '0.000000088',
      );
      await sendPage.fillCustomFeeInput(
        sendPage.getCustomFeeMaxPriorityInput(),
        '0.000000098',
      );

      // Verify error message is displayed
      await expect(sendPage.getCustomFeeError()).toContainText(
        'Max base fee must be greater than max priority fee',
      );

      // Save button should be disabled when there's an error
      await expect(sendPage.getCustomFeeSaveButton()).toBeDisabled();

      // ── Custom fee: set valid values and verify total fee changes ──

      await sendPage.fillCustomFeeInput(
        sendPage.getCustomFeeMaxBaseInput(),
        '50.0',
      );
      await sendPage.fillCustomFeeInput(
        sendPage.getCustomFeeMaxPriorityInput(),
        '10.0',
      );
      await sendPage.fillCustomFeeInput(
        sendPage.getCustomFeeGasLimitInput(),
        '22000',
      );

      // Error should be gone
      await expect(sendPage.getCustomFeeError()).not.toBeVisible();

      // Save button should be enabled
      await expect(sendPage.getCustomFeeSaveButton()).toBeEnabled();

      // Total network fee should have changed from the initial value
      const updatedTotalFee = await sendPage
        .getCustomFeeTotalRow()
        .textContent();
      expect(updatedTotalFee).not.toEqual(initialTotalFee);
      await expect(sendPage.getCustomFeeTotalRow()).toContainText('AVAX');

      // Save and return to approval screen
      await sendPage.saveCustomFee();

      // ── Verify custom fee is reflected on approval page ──

      // Custom preset should now be active
      await expect.poll(() => sendPage.isFeePresetActive('custom')).toBe(true);

      // Total network fee on approval screen should match the custom fee
      await expect(sendPage.getApprovalTotalFee()).toBeVisible();
      await expect(sendPage.getApprovalTotalFee()).toContainText('AVAX');

      // ── Gasless toggle ──

      const isGaslessVisible = await sendPage.isGaslessToggleVisible();

      if (isGaslessVisible) {
        await sendPage.toggleGaslessOff();
        const gaslessCheckbox = sendPage.getGaslessCheckbox();
        await expect(gaslessCheckbox).not.toBeChecked();
      }

      // ── Approve and verify on-chain ──

      const successToastPromise = sendPage.waitForSuccessToast();

      await sendPage.approveTransaction();

      const successToast = await successToastPromise;
      await expect(successToast).toContainText('Transaction successful');

      const txHash = await sendPage.getTxHashFromToast();
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

      await verifyTransactionOnExplorer(txHash, 'Avalanche C-Chain', 'Testnet');
    },
  );

  /** Same approval shape (Avalanche UTXO details) and steps — only chain + explorer differ. */
  const utxoAvaxSendCases: Array<{
    description: string;
    testrailId: string;
    sendData: typeof TEST_SEND.PCHAIN_AVAX | typeof TEST_SEND.XCHAIN_AVAX;
    chainLabel: string;
    recipientPattern: RegExp;
    explorerNetwork: ExplorerNetwork;
  }> = [
    {
      description: 'P-Chain',
      testrailId: 'SND-003',
      sendData: TEST_SEND.PCHAIN_AVAX,
      chainLabel: 'Avalanche P-Chain',
      recipientPattern: /P-fuji/,
      explorerNetwork: 'Avalanche P-Chain',
    },
    {
      description: 'X-Chain',
      testrailId: 'SND-004',
      sendData: TEST_SEND.XCHAIN_AVAX,
      chainLabel: 'Avalanche X-Chain',
      recipientPattern: /X-fuji/,
      explorerNetwork: 'Avalanche X-Chain',
    },
  ];

  // `test.each` is not available on the extended fixture's `test` — use a data table + loop.
  for (const row of utxoAvaxSendCases) {
    test.skip(
      `As a CORE ext user with an extension wallet, I can send ${row.description} AVAX`,
      {
        tag: ['@smoke', '@regression'],
        annotation: [
          {
            type: 'snapshot',
            description: 'testnetPrimaryExtWallet',
          },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${row.testrailId}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }, testInfo) => {
        testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
        const sendPage = new SendPage(unlockedExtensionPage);

        await sendPage.openSendFromPortfolioHome();
        await sendPage.selectTokenBySymbolAndChainBadge(
          row.sendData.tokenSymbol,
          row.sendData.chainBadgeAltText,
        );

        await sendPage.enterAmount(row.sendData.amount);
        await sendPage.selectRecipientAccount(row.sendData.recipientAccount);

        await expect
          .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
          .toBe(true);

        await sendPage.clickSend();
        await sendPage.waitForApprovalScreen();

        const approval = sendPage.getApprovalDialog();
        await expect(approval).toContainText(row.chainLabel, {
          timeout: 15000,
        });
        await expect(approval).toContainText('Account 2');
        await expect(approval).toContainText(row.recipientPattern, {
          timeout: 15000,
        });
        await expect(approval).toContainText('0.001 AVAX');

        await expect(sendPage.getFeePresetSelector()).not.toBeVisible();
        await expect(sendPage.getApproveButton()).toBeVisible();
        await expect(sendPage.getApproveButton()).toBeEnabled();
        await expect(sendPage.getRejectButton()).toBeVisible();

        const successToastPromise = sendPage.waitForSuccessToast();

        await sendPage.approveTransaction();

        const successToast = await successToastPromise;
        await expect(successToast).toContainText('Transaction successful');

        const txId = await sendPage.getTxHashFromToast();
        expect(txId.length).toBeGreaterThan(10);
        expect(txId).toMatch(/^[1-9A-HJ-NP-Za-km-z]+$/);

        await verifyTransactionOnExplorer(txId, row.explorerNetwork, 'Testnet');
      },
    );
  }

  const evmNativeSendCases: Array<{
    description: string;
    testrailId: string;
    sendData: typeof TEST_SEND.ETH;
    explorerNetwork: ExplorerNetwork;
  }> = [
    {
      description: 'ETH',
      testrailId: 'SND-007',
      sendData: TEST_SEND.ETH,
      explorerNetwork: 'Ethereum',
    },
    {
      description: 'a token on an L1',
      testrailId: 'SND-011',
      sendData: TEST_SEND.BEAM,
      explorerNetwork: 'Beam L1',
    },
  ];

  for (const row of evmNativeSendCases) {
    test(
      `As a CORE ext user with an extension wallet, I can send ${row.description}`,
      {
        tag: ['@smoke', '@regression'],
        annotation: [
          {
            type: 'snapshot',
            description: 'testnetPrimaryExtWallet',
          },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${row.testrailId}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }, testInfo) => {
        testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
        const sendPage = new SendPage(unlockedExtensionPage);
        const sendData = row.sendData;

        await sendPage.openSendFromPortfolioHome();
        await sendPage.selectTokenBySymbolAndChainBadge(
          sendData.tokenSearchTerm,
          sendData.chainBadgeAltText,
          sendData.chainFilterChip,
        );

        await sendPage.enterAmount(sendData.amount);
        await sendPage.selectRecipientAccount(sendData.recipientAccount);

        await expect
          .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
          .toBe(true);

        await sendPage.clickSend();
        await sendPage.waitForApprovalScreen();

        const fromRow = sendPage.getApprovalDetailRow('From');
        await expect(fromRow).toBeVisible();
        await expect(fromRow).toContainText('Account 1');

        const networkRow = sendPage.getApprovalDetailRow('Network');
        await expect(networkRow).toBeVisible();
        await expect(networkRow).toContainText(sendData.networkLabel);

        const toRow = sendPage.getApprovalDetailRow('To');
        await expect(toRow).toBeVisible();
        await expect(toRow).toContainText('Account 2');
        await expect(toRow).toContainText(/0x\w{4}…\w{4}/);

        await expect(sendPage.getFeePresetSelector()).toBeVisible();
        await expect(sendPage.getApprovalTotalFee()).toBeVisible();
        await expect(sendPage.getApprovalTotalFee()).toContainText(
          sendData.tokenSymbol,
        );

        await expect(sendPage.getApproveButton()).toBeVisible();
        await expect(sendPage.getApproveButton()).toBeEnabled();
        await expect(sendPage.getRejectButton()).toBeVisible();

        const pendingToastPromise = sendPage.waitForPendingToast();
        const successToastPromise = sendPage.waitForSuccessToast();

        await sendPage.approveTransaction();

        const pendingToast = await pendingToastPromise;
        await expect(pendingToast).toContainText('Transaction pending');

        const successToast = await successToastPromise;
        await expect(successToast).toContainText('Transaction successful');

        const txHash = await sendPage.getTxHashFromToast();
        expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

        await verifyTransactionOnExplorer(
          txHash,
          row.explorerNetwork,
          'Testnet',
        );
      },
    );
  }

  test(
    'As a CORE ext user with an extension wallet, I can send BTC',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-008',
        },
      ],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
      const sendPage = new SendPage(unlockedExtensionPage);
      const sendData = TEST_SEND.BTC;

      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectTokenBySymbolAndChainBadge(
        sendData.tokenSymbol,
        sendData.chainBadgeAltText,
        /^Bitcoin Testnet$/i,
      );

      await sendPage.enterAmount(sendData.amount);
      await sendPage.selectRecipientAccount(sendData.recipientAccount);

      await expect
        .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
        .toBe(true);

      await sendPage.clickSend();
      await sendPage.waitForApprovalScreen();

      const approval = sendPage.getApprovalDialog();
      await expect(approval).toContainText('Bitcoin', { timeout: 15000 });
      await expect(approval).toContainText('Account 2');
      await expect(approval).toContainText(`${sendData.amount} BTC`);

      await expect(sendPage.getFeePresetSelector()).not.toBeVisible();
      await expect(sendPage.getApproveButton()).toBeVisible();
      await expect(sendPage.getApproveButton()).toBeEnabled();
      await expect(sendPage.getRejectButton()).toBeVisible();

      const pendingToastPromise = sendPage.waitForPendingToast();
      const successToastPromise = sendPage.waitForSuccessToast();

      await sendPage.approveTransaction();

      const pendingToast = await pendingToastPromise;
      await expect(pendingToast).toContainText('Transaction pending');

      const successToast = await successToastPromise;
      await expect(successToast).toContainText('Transaction successful');

      const txHash = await sendPage.getTxHashFromToast();
      expect(txHash.length).toBeGreaterThan(10);

      await verifyTransactionOnExplorer(txHash, 'Bitcoin', 'Testnet');
    },
  );

  const erc20SendCases: Array<{
    description: string;
    testrailId: string;
    sendData: typeof TEST_SEND.CCHAIN_LINK & {
      chainFilterChip?: string | RegExp;
    };
    gasless?: 'on' | 'off';
    explorerNetwork: ExplorerNetwork;
    skip?: string;
  }> = [
    {
      description: 'an ERC-20 token on C-Chain with gasless toggled off',
      testrailId: 'SND-005',
      sendData: TEST_SEND.CCHAIN_LINK,
      gasless: 'off',
      explorerNetwork: 'Avalanche C-Chain',
    },
    {
      description: 'an ERC-20 token on C-Chain with gasless toggled on',
      testrailId: 'SND-006',
      sendData: TEST_SEND.CCHAIN_LINK,
      gasless: 'on',
      explorerNetwork: 'Avalanche C-Chain',
    },
    {
      description: 'USDC on Ethereum Sepolia',
      testrailId: 'SND-025',
      sendData: TEST_SEND.SEPOLIA_USDC,
      explorerNetwork: 'Ethereum',
      skip: 'Sepolia ERC-20 display issue — re-enable after fix',
    },
  ];

  for (const row of erc20SendCases) {
    test(
      `As a CORE ext user with an extension wallet, I can send ${row.description}`,
      {
        tag: ['@smoke', '@regression'],
        annotation: [
          {
            type: 'snapshot',
            description: 'testnetPrimaryExtWallet',
          },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${row.testrailId}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }, testInfo) => {
        if (row.skip) {
          test.skip(true, row.skip);
        }
        testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
        const sendPage = new SendPage(unlockedExtensionPage);
        const sendData = row.sendData;

        await sendPage.openSendFromPortfolioHome();
        await sendPage.selectTokenBySymbolAndChainBadge(
          sendData.tokenSearchTerm,
          sendData.chainBadgeAltText,
          sendData.chainFilterChip,
        );

        await sendPage.enterAmount(sendData.amount);
        await sendPage.selectRecipientAccount(sendData.recipientAccount);

        await expect
          .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
          .toBe(true);

        await sendPage.clickSend();
        await sendPage.waitForApprovalScreen();

        await expect(sendPage.getApprovalBalanceChange()).toBeVisible();
        await expect(sendPage.getApprovalTokenSymbol()).toContainText(
          sendData.tokenSymbol,
        );
        await expect(sendPage.getApprovalBalanceChange()).toContainText(
          sendData.amount,
        );

        const fromRow = sendPage.getApprovalDetailRow('From');
        await expect(fromRow).toBeVisible();
        await expect(fromRow).toContainText('Account 1');

        const networkRow = sendPage.getApprovalDetailRow('Network');
        await expect(networkRow).toBeVisible();
        await expect(networkRow).toContainText(sendData.networkLabel);

        const contractRow = sendPage.getApprovalDetailRow('Contract');
        await expect(contractRow).toBeVisible();
        await expect(contractRow).toContainText(/0x\w{4}…\w{4}/);

        await expect(sendPage.getApprovalTotalFee()).toBeVisible();
        await expect(sendPage.getApprovalTotalFee()).toContainText(
          sendData.feeSymbol,
        );

        if (row.gasless) {
          const gaslessVisible = await sendPage.isGaslessToggleVisible();

          if (gaslessVisible) {
            if (row.gasless === 'on') {
              await sendPage.toggleGaslessOn();
              await expect(sendPage.getGaslessCheckbox()).toBeChecked();
              await expect(sendPage.getFeePresetSelector()).not.toBeVisible();
            } else {
              await sendPage.toggleGaslessOff();
              await expect(sendPage.getGaslessCheckbox()).not.toBeChecked();
              await expect(sendPage.getFeePresetSelector()).toBeVisible();
            }
          } else {
            await expect(sendPage.getFeePresetSelector()).toBeVisible();
            testInfo.annotations.push({
              type: 'note',
              description: `${row.testrailId}: gasless toggle not shown; asserted paid-fee path.`,
            });
          }
        } else {
          await expect(sendPage.getFeePresetSelector()).toBeVisible();
        }

        await expect(sendPage.getApproveButton()).toBeVisible();
        await expect(sendPage.getApproveButton()).toBeEnabled();
        await expect(sendPage.getRejectButton()).toBeVisible();

        const successToastPromise = sendPage.waitForSuccessToast();

        await sendPage.approveTransaction();

        const successToast = await successToastPromise;
        await expect(successToast).toContainText('Transaction successful');

        const txHash = await sendPage.getTxHashFromToast();
        expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

        await verifyTransactionOnExplorer(
          txHash,
          row.explorerNetwork,
          'Testnet',
        );
      },
    );
  }

  const solanaSendCases: Array<{
    description: string;
    testrailId: string;
    sendData: typeof TEST_SEND.SOL_CONTACT;
  }> = [
    {
      description: 'Solana',
      testrailId: 'SND-009',
      sendData: TEST_SEND.SOL_CONTACT,
    },
    {
      description: 'Solana SPL tokens',
      testrailId: 'SND-010',
      sendData: TEST_SEND.SOL_PYUSD_CONTACT,
    },
  ];

  for (const row of solanaSendCases) {
    test(
      `As a CORE ext user with an extension wallet, I can send ${row.description}`,
      {
        tag: ['@smoke', '@regression'],
        annotation: [
          {
            type: 'snapshot',
            description: 'testnetContactExtWallet',
          },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${row.testrailId}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }, testInfo) => {
        testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
        const sendPage = new SendPage(unlockedExtensionPage);
        const sendData = row.sendData;

        await sendPage.openSendFromPortfolioHome();
        await sendPage.selectTokenBySymbolAndChainBadge(
          sendData.tokenSearchTerm,
          sendData.chainBadgeAltText,
          /^Solana \(Devnet\)$/i,
        );

        await sendPage.enterAmount(sendData.amount);

        await sendPage.typeRecipientSearchQuery(
          sendData.recipientContactSolAddress,
        );
        await sendPage.selectRecipientFromOpenDropdownByContactName(
          sendData.recipientContactName,
        );

        await expect
          .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
          .toBe(true);

        await sendPage.clickSend();
        await sendPage.waitForApprovalScreen();

        const balanceChangeRow = sendPage
          .getApprovalBalanceChange()
          .filter({ hasText: sendData.tokenSymbol })
          .first();
        await expect(balanceChangeRow).toBeVisible();
        await expect(balanceChangeRow).toContainText(sendData.amount);

        const fromRow = sendPage.getApprovalDetailRow('From');
        await expect(fromRow).toBeVisible();
        await expect(fromRow).toContainText('Account 1');

        const toRow = sendPage.getApprovalDetailRow('To');
        await expect(toRow).toBeVisible();
        const solAddr = sendData.recipientContactSolAddress;
        await expect(toRow).toContainText(solAddr.slice(0, 6));
        await expect(toRow).toContainText(solAddr.slice(-4));

        await expect(sendPage.getApproveButton()).toBeVisible();
        await expect(sendPage.getApproveButton()).toBeEnabled();
        await expect(sendPage.getRejectButton()).toBeVisible();

        const pendingToastPromise = sendPage.waitForPendingToast();
        const successToastPromise = sendPage.waitForSuccessToast();

        await sendPage.approveTransaction();

        const pendingToast = await pendingToastPromise;
        await expect(pendingToast).toContainText('Transaction pending');

        const successToast = await successToastPromise;
        await expect(successToast).toContainText('Transaction successful');

        const txSignature = await sendPage.getTxHashFromToast();
        expect(txSignature.length).toBeGreaterThan(10);

        await verifyTransactionOnExplorer(txSignature, 'Solana', 'Testnet');
      },
    );
  }

  test(
    'As a CORE ext user with an extension wallet, I can send C-Chain AVAX with gasless toggled on',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetContactExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }, testInfo) => {
      testInfo.setTimeout(SEND_TEST_TIMEOUT_MS);
      const sendPage = new SendPage(unlockedExtensionPage);
      const sendData = TEST_SEND.CCHAIN_AVAX_CONTACT_GASLESS;

      // SND-002: Portfolio → AVAX → Token details → Send → AVAX prefilled.
      await sendPage.openSendWithTokenFromPortfolio(sendData.tokenSymbol);
      await expect(sendPage.tokenSelectTrigger).toContainText(
        sendData.tokenSymbol,
      );

      await sendPage.enterAmount(sendData.amount);

      await sendPage.typeRecipientSearchQuery(sendData.randomUnsavedEvmAddress);
      await expect(sendPage.getUnknownRecipientLabel()).toBeVisible({
        timeout: 15000,
      });
      await sendPage.selectRecipientFromOpenDropdownByContactName(
        sendData.recipientContactName,
      );

      await expect
        .poll(() => sendPage.isSendButtonEnabled(), { timeout: 15000 })
        .toBe(true);

      await sendPage.clickSend();
      await sendPage.waitForApprovalScreen();

      await expect(sendPage.getApprovalBalanceChange()).toBeVisible();
      await expect(sendPage.getApprovalTokenSymbol()).toContainText('AVAX');
      await expect(sendPage.getApprovalBalanceChange()).toContainText('0.001');

      const fromRow = sendPage.getApprovalDetailRow('From');
      await expect(fromRow).toBeVisible();
      await expect(fromRow).toContainText('Account 1');

      const networkRow = sendPage.getApprovalDetailRow('Network');
      await expect(networkRow).toBeVisible();
      await expect(networkRow).toContainText('Avalanche');

      // External / address-book recipients use label "Contract" (not "To") on approval.
      const toRow = sendPage.getApprovalDetailRow('Contract');
      await expect(toRow).toBeVisible();
      const contactAddr = sendData.recipientContactEvmAddress;
      await expect(toRow).toContainText(contactAddr.slice(0, 6));
      await expect(toRow).toContainText(contactAddr.slice(-4));

      // Gasless depends on Gas Station + App Check; local builds often lack keys — branch like SND-001.
      const gaslessVisible = await sendPage.isGaslessToggleVisible();

      if (gaslessVisible) {
        await sendPage.toggleGaslessOn();
        await expect(sendPage.getGaslessCheckbox()).toBeChecked();
        await expect(sendPage.getFeePresetSelector()).not.toBeVisible();
      } else {
        await expect(sendPage.getFeePresetSelector()).toBeVisible();
        testInfo.annotations.push({
          type: 'note',
          description:
            'SND-002: gasless toggle not shown (e.g. eligibility / API); asserted paid-fee approval path.',
        });
      }

      const successToastPromise = sendPage.waitForSuccessToast();

      await sendPage.approveTransaction();

      const successToast = await successToastPromise;
      await expect(successToast).toContainText('Transaction successful');

      const txHash = await sendPage.getTxHashFromToast();
      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);

      await verifyTransactionOnExplorer(txHash, 'Avalanche C-Chain', 'Testnet');
    },
  );

  // ────────────────────────────────────────────────────────────────────────
  // Send Form UI Validation Tests
  // ────────────────────────────────────────────────────────────────────────

  // ── Token Select dropdown ──────────────────────────────────────────────

  test(
    'As a CORE ext user, I can search for a token in the token select dropdown',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-012',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();

      await sendPage.searchTokenInPopover('AVAX');

      const options = sendPage.getTokenSelectOptions();
      await expect(options.first()).toBeVisible({ timeout: 10000 });
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
    },
  );

  test(
    'As a CORE ext user, when I search for a token in the token select dropdown I get an error or empty state',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-013',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();

      await sendPage.searchTokenInPopover('ZZZZNONEXISTENT');

      await expect(sendPage.getDropdownNoResults()).toBeVisible({
        timeout: 5000,
      });
      await expect(sendPage.getTokenSelectOptions()).toHaveCount(0);
    },
  );

  // ── Send To dropdown ───────────────────────────────────────────────────

  test(
    'As a CORE ext user, when I open the Send To dropdown it shows the most recently transacted addresses',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetContactExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-014',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectToken('AVAX');

      await sendPage.openRecipientDropdown();

      const options = sendPage.getRecipientOptions();
      await expect(options.first()).toBeVisible({ timeout: 15000 });
      const count = await options.count();
      expect(count).toBeGreaterThan(0);

      const groupHeader = sendPage
        .getRecipientGroupHeader('Contacts')
        .or(sendPage.getRecipientGroupHeader('My Accounts'));
      await expect(groupHeader.first()).toBeVisible({ timeout: 5000 });
    },
  );

  test(
    'As a CORE ext user, when I open the Send To dropdown I can search for a contact name or address',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetContactExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-015',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectToken('AVAX');

      await sendPage.searchRecipientInDropdown('QA Wallet 2');

      const options = sendPage.getRecipientOptions();
      await expect(options.first()).toBeVisible({ timeout: 10000 });
      await expect(options.first()).toContainText('QA Wallet 2');
    },
  );

  test(
    'As a CORE ext user, when I search for an invalid address in the Send To dropdown I get an error or empty state',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-016',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();
      await sendPage.selectToken('AVAX');

      await sendPage.searchRecipientInDropdown('invalidaddress12345xyz');

      await expect(sendPage.getDropdownNoResults()).toBeVisible({
        timeout: 5000,
      });
    },
  );

  // ── Accounts dropdown ──────────────────────────────────────────────────

  test(
    'As a CORE ext user, when I open the Accounts dropdown I can search for an account name or address',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-017',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();

      await sendPage.searchAccountInDropdown('Account 1');

      const options = sendPage.getAccountSelectOptions();
      await expect(options.first()).toBeVisible({ timeout: 10000 });
      await expect(options.first()).toContainText('Account 1');
    },
  );

  test(
    'As a CORE ext user, when I search for an invalid address in the Accounts dropdown I get an error or empty state',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-018',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();

      await sendPage.searchAccountInDropdown('NonExistentAccount999');

      await expect(sendPage.getDropdownNoResults()).toBeVisible({
        timeout: 5000,
      });
    },
  );

  // ── Amount validation ──────────────────────────────────────────────────

  test(
    'As a CORE ext user, when I enter an amount larger than the selected token balance I get an error',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        {
          type: 'snapshot',
          description: 'testnetPrimaryExtWallet',
        },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:SND-019',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const sendPage = new SendPage(unlockedExtensionPage);
      await sendPage.openSendFromPortfolioHome();

      await sendPage.selectToken('AVAX');
      await sendPage.enterAmount('999999999');
      await sendPage.selectRecipientAccount('Account 2');

      const errorMessage = sendPage.getErrorMessage(
        /Maximum available amount after fees/i,
      );
      await expect(errorMessage).toBeVisible({ timeout: 15000 });
      await expect(errorMessage).toContainText('AVAX');
    },
  );

  const amountPresetCases: Array<{
    description: string;
    testrailId: string;
    presetLabel: string;
  }> = [
    { description: '25%', testrailId: 'SND-020', presetLabel: '25%' },
    { description: '50%', testrailId: 'SND-021', presetLabel: '50%' },
    { description: 'Max', testrailId: 'SND-022', presetLabel: 'Max' },
  ];

  for (const row of amountPresetCases) {
    test(
      `As a CORE ext user, when selecting ${row.description} the amount input is auto populated with the correct amount`,
      {
        tag: ['@smoke', '@regression'],
        annotation: [
          {
            type: 'snapshot',
            description: 'testnetPrimaryExtWallet',
          },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${row.testrailId}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }) => {
        const sendPage = new SendPage(unlockedExtensionPage);

        await sendPage.openSendWithTokenFromPortfolio('AVAX');
        await expect(sendPage.tokenSelectTrigger).toContainText('AVAX');

        await sendPage.amountInput.waitFor({
          state: 'visible',
          timeout: 10000,
        });

        await sendPage.clickAmountPreset(row.presetLabel);

        await expect
          .poll(() => sendPage.getAmountInputValue(), { timeout: 10000 })
          .not.toBe('');

        const value = await sendPage.getAmountInputValue();
        const numValue = parseFloat(value);
        expect(numValue).toBeGreaterThan(0);
      },
    );
  }

  const invalidAmountCases: Array<{
    description: string;
    testrailId: string;
    amount: string;
  }> = [
    { description: '0 amount', testrailId: 'SND-023', amount: '0' },
    {
      description: 'a negative amount',
      testrailId: 'SND-024',
      amount: '-1',
    },
  ];

  for (const row of invalidAmountCases) {
    test(
      `As a CORE ext user, when entering ${row.description} I get an error`,
      {
        tag: ['@smoke', '@regression'],
        annotation: [
          {
            type: 'snapshot',
            description: 'testnetPrimaryExtWallet',
          },
          {
            type: 'testrail_case_field',
            description: `custom_automation_id:${row.testrailId}`,
          },
        ],
      },
      async ({ unlockedExtensionPage }) => {
        const sendPage = new SendPage(unlockedExtensionPage);
        await sendPage.openSendFromPortfolioHome();

        await sendPage.selectToken('AVAX');
        await sendPage.enterAmount(row.amount);
        await sendPage.selectRecipientAccount('Account 2');

        await expect(sendPage.sendButton).toBeDisabled({ timeout: 5000 });
      },
    );
  }
});
