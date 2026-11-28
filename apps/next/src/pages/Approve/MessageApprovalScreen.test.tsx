import { ThemeProvider } from '@avalabs/k2-alpine';
import { RpcMethod } from '@avalabs/vm-module-types';
import { ActionStatus, NetworkWithCaipId } from '@core/types';
import { act, fireEvent, render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { MessageApprovalScreen } from './MessageApprovalScreen';
import { MessageSigningRequest } from './types';

jest.mock('webextension-polyfill', () => ({
  runtime: { getURL: (path: string) => `chrome-extension://core/${path}` },
}));

jest.mock('@core/ui', () => ({
  useAccountsContext: () => ({
    getAccountByIndex: jest.fn(),
    accounts: { active: undefined },
  }),
}));

jest.mock('@core/common', () => ({
  getAddressByVMType: jest.fn(),
  trimEndingSlash: (url: string) => url.replace(/\/$/, ''),
}));

jest.mock('@/hooks/useIsUsingHardwareWallet', () => ({
  useIsUsingHardwareWallet: () => ({
    isUsingHardwareWallet: false,
    deviceType: undefined,
  }),
}));

// Plain scrollable boxes stand in for react-custom-scrollbars, which needs
// real layout. The outer one wraps the page; ActionDetails renders the inner
// message scroller.
jest.mock('@/components/NoScrollStack', () => ({
  NoScrollStack: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="outer" style={{ overflowY: 'scroll' }}>
      {children}
    </div>
  ),
}));

jest.mock('./components', () => ({
  ...jest.requireActual('./components/ActionDrawer'),
  Styled: {
    ApprovalScreenPage: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  },
  ActionDetails: () => (
    <div data-testid="inner" style={{ overflowY: 'auto' }}>
      long message
    </div>
  ),
  ApprovalScreenTitle: ({ title }: { title: string }) => <h1>{title}</h1>,
  NoteWarning: () => null,
  MaliciousTxOverlay: () => null,
  HardwareApprovalOverlay: () => null,
}));

jest.mock('./components/ActionDetails/generic/DetailsSection', () => ({
  DetailsSection: () => null,
}));
jest.mock(
  './components/ActionDetails/generic/DetailsItem/items/NetworkDetail',
  () => ({ NetworkDetail: () => null }),
);
jest.mock(
  './components/ActionDetails/generic/DetailsItem/items/AddressDetail',
  () => ({ AddressDetail: () => null }),
);

type Metrics = {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
};
const metrics = new Map<string, Metrics>();
const metricsOf = (el: HTMLElement) =>
  metrics.get(el.dataset?.testid ?? '') ?? {
    scrollHeight: 0,
    clientHeight: 0,
    scrollTop: 0,
  };

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return metricsOf(this).scrollHeight;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return metricsOf(this).clientHeight;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get(this: HTMLElement) {
      return metricsOf(this).scrollTop;
    },
    set(this: HTMLElement, value: number) {
      const m = metrics.get(this.dataset?.testid ?? '');
      if (m) m.scrollTop = value;
    },
  });
});

afterAll(() => {
  for (const key of ['scrollHeight', 'clientHeight', 'scrollTop']) {
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key];
  }
});

const network = { vmName: 'EVM' } as unknown as NetworkWithCaipId;

const buildAction = (type: RpcMethod) =>
  ({
    actionId: 'action-id',
    status: ActionStatus.PENDING,
    signingData: { type, data: '0x' },
    displayData: { title: 'Sign message', details: [] },
  }) as unknown as MessageSigningRequest;

describe('MessageApprovalScreen - mandatory message review', () => {
  let i18n: ReturnType<typeof createInstance>;
  const updateAction = jest.fn();
  const cancelHandler = jest.fn();

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  beforeEach(() => {
    metrics.clear();
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderScreen = async (type: RpcMethod) => {
    let result!: ReturnType<typeof render>;
    await act(async () => {
      result = render(
        <ThemeProvider theme="light" toastVariant="extension">
          <I18nextProvider i18n={i18n}>
            <MessageApprovalScreen
              action={buildAction(type)}
              network={network}
              updateAction={updateAction}
              cancelHandler={cancelHandler}
              error={undefined as never}
            />
          </I18nextProvider>
        </ThemeProvider>,
      );
    });
    return result;
  };

  const scrollTo = async (testId: string, scrollTop: number) => {
    const el = screen.getByTestId(testId);
    await act(async () => {
      el.scrollTop = scrollTop;
      fireEvent.scroll(el);
    });
  };

  const approveButton = () =>
    screen.getByTestId('approve-action-button') as HTMLButtonElement;

  it.each([
    RpcMethod.PERSONAL_SIGN,
    RpcMethod.ETH_SIGN,
    RpcMethod.SIGN_TYPED_DATA,
    RpcMethod.SIGN_TYPED_DATA_V1,
    RpcMethod.SIGN_TYPED_DATA_V3,
    RpcMethod.SIGN_TYPED_DATA_V4,
  ])(
    'keeps Sign disabled for %s until the full message is scrolled',
    async (method) => {
      metrics.set('outer', {
        scrollHeight: 1200,
        clientHeight: 600,
        scrollTop: 0,
      });
      metrics.set('inner', {
        scrollHeight: 2000,
        clientHeight: 200,
        scrollTop: 0,
      });

      await renderScreen(method);

      expect(approveButton().disabled).toBe(true);
      expect(screen.getByTestId('approve-action-hint').textContent).toBe(
        'Scroll to review the full message',
      );
      expect(
        (screen.getByTestId('reject-action-button') as HTMLButtonElement)
          .disabled,
      ).toBe(false);

      await scrollTo('outer', 600);
      expect(approveButton().disabled).toBe(true);

      await scrollTo('inner', 1800);
      expect(approveButton().disabled).toBe(false);
      expect(screen.queryByTestId('approve-action-hint')).toBeNull();
    },
  );

  it('enables Sign immediately when the message fits on screen', async () => {
    metrics.set('outer', {
      scrollHeight: 500,
      clientHeight: 600,
      scrollTop: 0,
    });
    metrics.set('inner', {
      scrollHeight: 100,
      clientHeight: 100,
      scrollTop: 0,
    });

    await renderScreen(RpcMethod.PERSONAL_SIGN);

    expect(approveButton().disabled).toBe(false);
  });

  it('lets the user reject without scrolling', async () => {
    metrics.set('outer', {
      scrollHeight: 5000,
      clientHeight: 600,
      scrollTop: 0,
    });

    await renderScreen(RpcMethod.SIGN_TYPED_DATA_V4);
    await act(async () => {
      fireEvent.click(screen.getByTestId('reject-action-button'));
    });

    expect(cancelHandler).toHaveBeenCalled();
  });
});
