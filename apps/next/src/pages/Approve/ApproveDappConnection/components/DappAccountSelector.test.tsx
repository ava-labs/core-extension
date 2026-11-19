import { ThemeProvider } from '@avalabs/k2-alpine';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { Account, Action, ActionStatus } from '@core/types';
import { render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';

import { ConnectDappDisplayData } from '../types';
import { DappAccountSelector } from './DappAccountSelector';

jest.mock('@/hooks/useDappScansCache', () => ({
  useDappScansCache: () => ({ storeMaliciousDappDomain: jest.fn() }),
}));

jest.mock('../hooks', () => ({
  useDappPermissionsState: () => ({
    wallets: [],
    isLoading: false,
    selectedAccountId: 'account-1',
    selectAccount: jest.fn(),
    numberOfSelectedAccounts: 1,
  }),
}));

jest.mock('../components', () => ({
  ConnectWalletCard: () => null,
  SizedAvatar: () => null,
}));

jest.mock('../../components', () => ({
  ActionDrawer: () => null,
  LoadingScreen: () => <div data-testid="loading-screen" />,
  NoteWarning: () => null,
}));

describe('DappAccountSelector', () => {
  let i18n: ReturnType<typeof createInstance>;

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  const buildAction = (
    overrides: Partial<ConnectDappDisplayData> = {},
  ): Action<ConnectDappDisplayData> =>
    ({
      actionId: 'action-id',
      status: ActionStatus.PENDING,
      displayData: {
        canSkipApproval: false,
        addressVM: NetworkVMType.EVM,
        isMalicious: false,
        dappUrl: 'https://app.example.com',
        dappIcon: '',
        dappDomain: 'app.example.com',
        ...overrides,
      },
    }) as unknown as Action<ConnectDappDisplayData>;

  const renderSelector = (action = buildAction()) =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <DappAccountSelector
            action={action}
            activeAccount={{ id: 'account-1' } as Account}
            updateAction={jest.fn()}
            cancelHandler={jest.fn()}
            error=""
          />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it('names the requesting dApp', () => {
    renderSelector();

    expect(screen.getByTestId('dapp-connect-title').textContent).toBe(
      'https://app.example.com wants to connect to your wallet.',
    );
  });

  it('discloses read access and the ability to request approvals before connecting', () => {
    renderSelector();

    const disclosure = screen.getByTestId('dapp-connect-disclosure');
    const text = disclosure.textContent ?? '';

    expect(text).toBe(
      'Connecting lets this site view your wallet addresses, balances and transaction history, and request transactions and message signatures. Each request still requires your approval.',
    );
    // WSR-THRE-004: read access to the account...
    expect(text).toMatch(/addresses/);
    expect(text).toMatch(/balances/);
    expect(text).toMatch(/transaction history/);
    // ...and the ability to request transaction/signature approvals.
    expect(text).toMatch(/request transactions and message signatures/);
    expect(text).toMatch(/requires your approval/);
  });

  it('shows the disclosure for dApps flagged as malicious too', () => {
    renderSelector(buildAction({ isMalicious: true }));

    expect(screen.getByTestId('dapp-connect-disclosure')).toBeTruthy();
  });

  it('does not render the prompt when approval can be skipped', () => {
    renderSelector(buildAction({ canSkipApproval: true }));

    expect(screen.getByTestId('loading-screen')).toBeTruthy();
    expect(screen.queryByTestId('dapp-connect-disclosure')).toBeNull();
  });
});
