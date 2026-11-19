import { ThemeProvider } from '@avalabs/k2-alpine';
import { openNewTab } from '@core/common';
import { useAnalyticsContext } from '@core/ui';
import { fireEvent, render, screen } from '@shared/tests/test-utils';
import { createInstance } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import translationEn from '@/localization/locales/en/translation.json';
import { TokenApprovalsNavItem } from './TokenApprovalsNavItem';

jest.mock('@core/common', () => ({
  openNewTab: jest.fn(),
}));

jest.mock('@core/ui', () => ({
  useAnalyticsContext: jest.fn(),
}));

jest.mock('@/config', () => ({
  CORE_WEB_BASE_URL: 'https://core.app',
}));

describe('TokenApprovalsNavItem', () => {
  let i18n: ReturnType<typeof createInstance>;
  const capture = jest.fn();

  beforeAll(async () => {
    i18n = createInstance();
    await i18n.use(initReactI18next).init({
      lng: 'en',
      interpolation: { escapeValue: false },
      resources: { en: { translation: translationEn } },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useAnalyticsContext).mockReturnValue({
      capture,
    } as unknown as ReturnType<typeof useAnalyticsContext>);
  });

  const renderItem = () =>
    render(
      <ThemeProvider theme="light" toastVariant="extension">
        <I18nextProvider i18n={i18n}>
          <TokenApprovalsNavItem />
        </I18nextProvider>
      </ThemeProvider>,
    );

  it('renders the item with its description', () => {
    renderItem();

    expect(screen.getByText('Token approvals')).toBeTruthy();
    expect(
      screen.getByText('Review and revoke token approvals on core.app.'),
    ).toBeTruthy();
  });

  it("opens Core's revoke access tool in a new tab", () => {
    renderItem();
    fireEvent.click(screen.getByText('Token approvals'));

    expect(openNewTab).toHaveBeenCalledTimes(1);
    expect(openNewTab).toHaveBeenCalledWith({
      url: 'https://core.app/tools/revoke-access',
    });
    expect(capture).toHaveBeenCalledWith('TokenApprovalsClicked');
  });
});
