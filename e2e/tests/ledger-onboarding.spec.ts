import { test, expect } from '../fixtures/extension.fixture';
import { OnboardingPage } from '../pages/extension/OnboardingPage';
import {
  ALLOW_FAILURE_SCREENSHOT_ANNOTATION,
  TEST_TAGS,
  TEST_WALLET_NAMES,
} from '../constants';
import { seedLedgerSpeculosUrl } from '../helpers/ledgerSpeculos';
import { SpeculosApi } from '../helpers/speculosApi';
import { requestFromServiceWorker } from '../helpers/serviceWorker';

// First BIP44 EVM address (m/44'/60'/0'/0/0) of the Speculos seed, the BIP39
// all-zero test vector.
const EXPECTED_FIRST_ADDRESS = '0x9858EfFD232B4033E47d90003D41EC34EcaEda94';
const WALLET_PASSWORD = 'password#123';

// ExtensionRequest methods and enum values (ui-connection.ts, secrets.ts in @core/types).
const WALLET_GET_DETAILS = 'wallet_getDetails';
const ACCOUNT_GET_ACCOUNTS = 'account_get';
const SECRET_TYPE_LEDGER = 'ledger';
const DERIVATION_PATH_BIP44 = 'bip44';

type WalletDetails = { id: string; type: string; derivationPath: string };
type Accounts = { active?: { addressC?: string } };

const speculos = new SpeculosApi();

test.describe('Ledger onboarding (Speculos)', () => {
  test.skip(
    process.env.USE_SPECULOS !== 'true',
    'Requires a running Speculos emulator; set USE_SPECULOS=true (see e2e/README.md)',
  );
  test.describe.configure({ retries: 0, timeout: 180000 });

  test.beforeAll(async () => {
    if (!(await speculos.isRunning())) {
      throw new Error(
        `Speculos is not reachable at ${speculos.url}. Run "yarn speculos:build && yarn speculos:start" (see e2e/README.md).`,
      );
    }
  });

  test(
    'As a CORE ext user, I can onboard with a Ledger device using BIP44 derivation paths',
    {
      tag: [TEST_TAGS.SPECULOS],
      annotation: [
        { type: ALLOW_FAILURE_SCREENSHOT_ANNOTATION },
        { type: 'snapshot', description: 'none' },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ONB-LEDGER-001',
        },
      ],
    },
    async ({ context, extensionId, extensionPage }) => {
      const onboardingPage = new OnboardingPage(extensionPage);

      await seedLedgerSpeculosUrl(context, speculos.url);

      await onboardingPage.navigateToLedgerConnectScreen();
      await onboardingPage.connectLedgerWithBip44();

      const firstAddress = onboardingPage.derivedAccountAddresses.first();
      await expect(firstAddress).toHaveAttribute(
        'aria-label',
        EXPECTED_FIRST_ADDRESS,
      );

      await onboardingPage.continueToWalletDetails();
      await onboardingPage.fillWalletDetails(
        TEST_WALLET_NAMES.DEFAULT,
        WALLET_PASSWORD,
      );
      await onboardingPage.nextButton.click();
      await onboardingPage.customizeCoreStep();
      await onboardingPage.selectAvatarStep();

      await onboardingPage.waitForEnjoyWalletAndComplete(60000, 1);

      const page = await context.newPage();
      await page.goto(`chrome-extension://${extensionId}/popup.html`, {
        waitUntil: 'domcontentloaded',
      });

      await expect
        .poll(
          async () =>
            (
              await requestFromServiceWorker<WalletDetails[]>(
                page,
                WALLET_GET_DETAILS,
              )
            ).map(({ type, derivationPath }) => ({ type, derivationPath })),
          { timeout: 30000 },
        )
        .toEqual([
          { type: SECRET_TYPE_LEDGER, derivationPath: DERIVATION_PATH_BIP44 },
        ]);

      await expect
        .poll(
          async () =>
            (
              await requestFromServiceWorker<Accounts>(
                page,
                ACCOUNT_GET_ACCOUNTS,
              )
            ).active?.addressC?.toLowerCase(),
          { timeout: 30000 },
        )
        .toBe(EXPECTED_FIRST_ADDRESS.toLowerCase());
    },
  );
});
