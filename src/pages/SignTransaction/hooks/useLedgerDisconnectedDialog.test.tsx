import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { useDialog } from '@src/contexts/DialogContextProvider';
import {
  LedgerAppType,
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@src/contexts/LedgerProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import useIsUsingLedgerWallet from '@src/hooks/useIsUsingLedgerWallet';
import { LedgerDisconnected } from '@src/pages/Ledger/LedgerDisconnected';
import { LedgerIncorrectApp } from '@src/pages/Ledger/LedgerIncorrectApp';
import { LedgerWrongVersionContent } from '@src/pages/Ledger/LedgerWrongVersion';
import { isLedgerVersionCompatible } from '@src/utils/isLedgerVersionCompatible';
import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';
import { useLedgerDisconnectedDialog } from './useLedgerDisconnectedDialog';
import { SecretType } from '@src/background/services/secrets/models';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('@src/contexts/WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

jest.mock('@src/contexts/LedgerProvider', () => {
  const original = jest.requireActual('@src/contexts/LedgerProvider');
  return {
    useLedgerContext: jest.fn(),
    LedgerAppType: original.LedgerAppType,
  };
});

jest.mock('@src/contexts/DialogContextProvider', () => ({
  useDialog: jest.fn(),
}));

jest.mock('@src/contexts/NetworkProvider', () => ({
  useNetworkContext: jest.fn(),
}));

jest.mock('@src/hooks/useIsUsingLedgerWallet');
jest.mock('@src/utils/isLedgerVersionCompatible');

describe('src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog.tsx', () => {
  const onCancelMock = jest.fn();
  const clearDialogMock = jest.fn();
  const showDialogMock = jest.fn();
  const translationMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({ t: translationMock });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletDetails: {
        type: SecretType.Ledger,
      },
    });
    (useLedgerContext as jest.Mock).mockReturnValue({
      hasLedgerTransport: true,
      wasTransportAttempted: true,
      appType: LedgerAppType.AVALANCHE,
      avaxAppVersion: '1.0',
    });
    (useDialog as jest.Mock).mockReturnValue({
      showDialog: showDialogMock,
      clearDialog: clearDialogMock,
    });
    (useNetworkContext as jest.Mock).mockReturnValue({
      network: {
        chainId: 41334,
      },
    });
    (useIsUsingLedgerWallet as jest.Mock).mockReturnValue(true);
    (isLedgerVersionCompatible as jest.Mock).mockReturnValue(true);
  });

  it("does nothing if it's not a ledger wallet", () => {
    (useIsUsingLedgerWallet as jest.Mock).mockReturnValueOnce(false);

    const { result } = renderHook(() =>
      useLedgerDisconnectedDialog(onCancelMock)
    );

    expect(result.current).toBe(false);
    expect(clearDialogMock).toBeCalledTimes(1);
    expect(showDialogMock).not.toBeCalled();
  });

  it('does nothing if transport init has not been attempted', () => {
    (useLedgerContext as jest.Mock).mockReturnValue({
      wasTransportAttempted: false,
    });

    const { result } = renderHook(() =>
      useLedgerDisconnectedDialog(onCancelMock)
    );

    expect(result.current).toBe(false);
    expect(clearDialogMock).toBeCalledTimes(1);
    expect(showDialogMock).not.toBeCalled();
  });

  it('it does nothing if everything is set correctly', () => {
    const { result } = renderHook(() =>
      useLedgerDisconnectedDialog(onCancelMock)
    );

    expect(result.current).toBe(true);
    expect(clearDialogMock).toBeCalledTimes(1);
    expect(showDialogMock).not.toBeCalled();
  });

  describe('showLedgerDisconnectedDialog', () => {
    it('shows disconnected dialog if transport is missing', () => {
      const translation = 'Ledger Disconnected';
      translationMock.mockReturnValueOnce(translation);
      (useLedgerContext as jest.Mock).mockReturnValue({
        wasTransportAttempted: true,
        hasLedgerTransport: false,
      });

      const { result } = renderHook(() =>
        useLedgerDisconnectedDialog(onCancelMock)
      );

      expect(result.current).toBe(false);
      expect(clearDialogMock).toBeCalledTimes(1);
      expect(translationMock).toBeCalledWith(translation);
      expect(showDialogMock).toBeCalledWith({
        title: translation,
        content: <LedgerDisconnected />,
        open: true,
        onClose: expect.any(Function),
      });
    });
  });

  describe('showIncorrectAppDialog', () => {
    it('shows incorrect app dialog for specific app', () => {
      const translation = 'Wrong App';
      translationMock.mockReturnValueOnce(translation);
      (useLedgerContext as jest.Mock).mockReturnValue({
        wasTransportAttempted: true,
        hasLedgerTransport: true,
      });

      const { result } = renderHook(() =>
        useLedgerDisconnectedDialog(onCancelMock, LedgerAppType.AVALANCHE)
      );

      expect(result.current).toBe(false);
      expect(clearDialogMock).toBeCalledTimes(1);
      expect(translationMock).toBeCalledWith(translation);
      expect(showDialogMock).toBeCalledWith({
        title: translation,
        content: (
          <LedgerIncorrectApp requiredAppType={LedgerAppType.AVALANCHE} />
        ),
        open: true,
        onClose: expect.any(Function),
      });
    });

    it('shows incorrect app dialog for Bitcoin', () => {
      const translation = 'Wrong App';
      translationMock.mockReturnValueOnce(translation);
      (useLedgerContext as jest.Mock).mockReturnValue({
        wasTransportAttempted: true,
        hasLedgerTransport: true,
        appType: LedgerAppType.AVALANCHE,
      });
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: {
          vmName: NetworkVMType.BITCOIN,
        },
      });

      const { result } = renderHook(() =>
        useLedgerDisconnectedDialog(onCancelMock)
      );

      expect(result.current).toBe(false);
      expect(clearDialogMock).toBeCalledTimes(1);
      expect(translationMock).toBeCalledWith(translation);
      expect(showDialogMock).toBeCalledWith({
        title: translation,
        content: <LedgerIncorrectApp requiredAppType={LedgerAppType.BITCOIN} />,
        open: true,
        onClose: expect.any(Function),
      });
    });

    it('shows incorrect app dialog for Ethereum', () => {
      const translation = 'Wrong App';
      translationMock.mockReturnValueOnce(translation);
      (useLedgerContext as jest.Mock).mockReturnValue({
        wasTransportAttempted: true,
        hasLedgerTransport: true,
        appType: LedgerAppType.AVALANCHE,
      });
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: {
          chainId: 1,
        },
      });

      const { result } = renderHook(() =>
        useLedgerDisconnectedDialog(onCancelMock)
      );

      expect(result.current).toBe(false);
      expect(clearDialogMock).toBeCalledTimes(1);
      expect(translationMock).toBeCalledWith(translation);
      expect(showDialogMock).toBeCalledWith({
        title: translation,
        content: (
          <LedgerIncorrectApp requiredAppType={LedgerAppType.ETHEREUM} />
        ),
        open: true,
        onClose: expect.any(Function),
      });
    });

    it('shows incorrect app dialog for Avalanche', () => {
      const translation = 'Wrong App';
      translationMock.mockReturnValueOnce(translation);
      (useLedgerContext as jest.Mock).mockReturnValue({
        wasTransportAttempted: true,
        hasLedgerTransport: true,
        appType: LedgerAppType.BITCOIN,
      });
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: {
          vmName: NetworkVMType.EVM,
        },
      });

      const { result } = renderHook(() =>
        useLedgerDisconnectedDialog(onCancelMock)
      );

      expect(result.current).toBe(false);
      expect(clearDialogMock).toBeCalledTimes(1);
      expect(translationMock).toBeCalledWith(translation);
      expect(showDialogMock).toBeCalledWith({
        title: translation,
        content: (
          <LedgerIncorrectApp requiredAppType={LedgerAppType.AVALANCHE} />
        ),
        open: true,
        onClose: expect.any(Function),
      });
    });
  });

  describe('showIncorrectAvaxVersionDialog', () => {
    it('shows incorrect version dialog', () => {
      const translation = 'Update Required';
      translationMock.mockReturnValueOnce(translation);
      (isLedgerVersionCompatible as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() =>
        useLedgerDisconnectedDialog(onCancelMock)
      );

      expect(result.current).toBe(true);
      expect(clearDialogMock).toBeCalledTimes(1);
      expect(translationMock).toBeCalledWith(translation);
      expect(showDialogMock).toBeCalledWith({
        title: translation,
        content: <LedgerWrongVersionContent />,
        open: true,
        onClose: expect.any(Function),
      });
      expect(isLedgerVersionCompatible).toBeCalledWith(
        '1.0',
        REQUIRED_LEDGER_VERSION
      );
    });
  });
});
