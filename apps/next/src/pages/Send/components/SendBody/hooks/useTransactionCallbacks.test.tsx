import { renderHook } from '@testing-library/react';

import { NetworkWithCaipId } from '@core/types';

import { useTransactionCallbacks } from './useTransactionCallbacks';

const mockReplace = jest.fn();
const mockHistory: {
  replace: jest.Mock;
  location: { pathname: string; search: string };
} = {
  replace: mockReplace,
  location: { pathname: '/send', search: '' },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => mockHistory,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

jest.mock('@core/ui', () => ({
  toast: { error: jest.fn() },
  useAnalyticsContext: () => ({ capture: jest.fn() }),
}));

const network = { chainId: 43114 } as NetworkWithCaipId;

describe('useTransactionCallbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHistory.location = { pathname: '/send', search: '' };
  });

  describe('onSendSuccess', () => {
    const submit = (search: string) => {
      mockHistory.location.search = search;
      const { result } = renderHook(() =>
        useTransactionCallbacks(network, '0xfrom'),
      );
      result.current.onSendApproved();
      return result.current;
    };

    it('clears amount, recipient and max mode but keeps the selected token', () => {
      const callbacks = submit(
        'fromQ=acc&token=AVAX&tokenQ=av&amount=1.5&to=0xabc&toQ=0xabc&isMax=true',
      );
      callbacks.onSendSuccess('0xhash');

      expect(mockReplace).toHaveBeenCalledTimes(1);
      const { pathname, search } = mockReplace.mock.calls[0]![0];
      expect(pathname).toBe('/send');

      const params = new URLSearchParams(search);
      expect(params.get('token')).toBe('AVAX');
      expect(params.get('fromQ')).toBe('acc');
      expect(params.get('tokenQ')).toBe('av');
      expect(params.has('amount')).toBe(false);
      expect(params.has('to')).toBe(false);
      expect(params.has('toQ')).toBe(false);
      expect(params.has('isMax')).toBe(false);
    });

    it('does not touch navigation when the user already left the send page', () => {
      const callbacks = submit('token=AVAX&amount=1&to=0xabc');
      mockHistory.location = { pathname: '/', search: '' };

      callbacks.onSendSuccess('0xhash');

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('still clears the form when max mode re-synced the amount during approval', () => {
      const callbacks = submit('token=AVAX&amount=1.5&to=0xabc&isMax=1');
      mockHistory.location = {
        pathname: '/send',
        search: 'token=AVAX&amount=1.49&to=0xabc&isMax=1',
      };

      callbacks.onSendSuccess('0xhash');

      expect(mockReplace).toHaveBeenCalledTimes(1);
      const params = new URLSearchParams(mockReplace.mock.calls[0]![0].search);
      expect(params.get('token')).toBe('AVAX');
      expect(params.has('amount')).toBe(false);
      expect(params.has('isMax')).toBe(false);
    });

    it('does not clear when a manual edit replaced max mode', () => {
      const callbacks = submit('token=AVAX&amount=1.5&to=0xabc&isMax=1');
      mockHistory.location = {
        pathname: '/send',
        search: 'token=AVAX&amount=3&to=0xabc',
      };

      callbacks.onSendSuccess('0xhash');

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('does not clear a newer draft started after the user left and came back', () => {
      const callbacks = submit('token=AVAX&amount=1&to=0xabc');
      mockHistory.location = {
        pathname: '/send',
        search: 'token=AVAX&amount=9&to=0xdef',
      };

      callbacks.onSendSuccess('0xhash');

      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
