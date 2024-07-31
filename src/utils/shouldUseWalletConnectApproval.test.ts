import { NetworkVMType } from '@avalabs/core-chains-sdk';
import shouldUseWalletConnectApproval from './shouldUseWalletConnectApproval';
import {
  AccountType,
  FireblocksAccount,
  ImportedPrivateKeyAccount,
  PrimaryAccount,
  WalletConnectAccount,
} from '@src/background/services/accounts/models';

describe('src/utils/shouldUseWalletConnectApproval.ts', () => {
  const network = {
    chainName: 'network1',
    chainId: 1234,
    vmName: NetworkVMType.EVM,
    rpcUrl: 'network1.rpc.com',
    explorerUrl: 'https://explorer.url',
    networkToken: {
      name: 'network1 token',
      symbol: 'NTW1',
      description: 'network1 token description',
      decimals: 8,
      logoUri: 'network1.token.logo.com',
    },
    logoUri: 'network1.logo.com',
  };
  // PrimaryAccount | ImportedAccount;
  const primaryAccount: PrimaryAccount = {
    index: 0,
    id: crypto.randomUUID(),
    name: 'primaryAccount',
    addressC: crypto.randomUUID(),
    type: AccountType.PRIMARY,
    addressBTC: 'addressBTC',
    walletId: 'wallet-id-1',
  };

  const importedPrivateKeyAccount: ImportedPrivateKeyAccount = {
    id: crypto.randomUUID(),
    name: 'importedPrivateKeyAccount',
    addressC: crypto.randomUUID(),
    type: AccountType.IMPORTED,
    addressBTC: 'addressBTC 2',
  };
  const importedWalletConnectAccount: WalletConnectAccount = {
    id: crypto.randomUUID(),
    name: 'importedWalletConnectAccount',
    addressC: crypto.randomUUID(),
    type: AccountType.WALLET_CONNECT,
  };
  const importedFireblocksAccount: FireblocksAccount = {
    id: crypto.randomUUID(),
    name: 'importedFireblocksAccount',
    addressC: crypto.randomUUID(),
    type: AccountType.FIREBLOCKS,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Primary Account', () => {
    it('should return false if network is EVM ', () => {
      const result = shouldUseWalletConnectApproval(network, primaryAccount);
      expect(result).toEqual(false);
    });
    it('should return false if network is AVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.AVM,
        },
        primaryAccount
      );
      expect(result).toEqual(false);
    });
    it('should return false if network is PVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.PVM,
        },
        primaryAccount
      );
      expect(result).toEqual(false);
    });

    it('should return false if network is CoreEth ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.CoreEth,
        },
        primaryAccount
      );
      expect(result).toEqual(false);
    });

    it('should return false if network is BITCOIN ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.BITCOIN,
        },
        primaryAccount
      );
      expect(result).toEqual(false);
    });
  });
  describe('Imported Private Key Account', () => {
    it('should return false if network is EVM ', () => {
      const result = shouldUseWalletConnectApproval(
        network,
        importedPrivateKeyAccount
      );
      expect(result).toEqual(false);
    });
    it('should return false if network is AVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.AVM,
        },
        importedPrivateKeyAccount
      );
      expect(result).toEqual(false);
    });
    it('should return false if network is PVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.PVM,
        },
        importedPrivateKeyAccount
      );
      expect(result).toEqual(false);
    });

    it('should return false if network is CoreEth ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.CoreEth,
        },
        importedPrivateKeyAccount
      );
      expect(result).toEqual(false);
    });

    it('should return false if network is BITCOIN ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.BITCOIN,
        },
        importedPrivateKeyAccount
      );
      expect(result).toEqual(false);
    });
  });

  describe('Imported Wallet Connect Account', () => {
    it('should return true if network is EVM ', () => {
      const result = shouldUseWalletConnectApproval(
        network,
        importedWalletConnectAccount
      );
      expect(result).toEqual(true);
    });
    it('should return true if network is AVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.AVM,
        },
        importedWalletConnectAccount
      );
      expect(result).toEqual(true);
    });
    it('should return true if network is PVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.PVM,
        },
        importedWalletConnectAccount
      );
      expect(result).toEqual(true);
    });

    it('should return false if network is CoreEth ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.CoreEth,
        },
        importedWalletConnectAccount
      );
      expect(result).toEqual(false);
    });

    it('should return false if network is BITCOIN ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.BITCOIN,
        },
        importedWalletConnectAccount
      );
      expect(result).toEqual(false);
    });
  });

  describe('Imported Fireblocks Account', () => {
    it('should return true if network is EVM ', () => {
      const result = shouldUseWalletConnectApproval(
        network,
        importedFireblocksAccount
      );
      expect(result).toEqual(true);
    });
    it('should return true if network is AVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.AVM,
        },
        importedFireblocksAccount
      );
      expect(result).toEqual(true);
    });
    it('should return true if network is PVM ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.PVM,
        },
        importedFireblocksAccount
      );
      expect(result).toEqual(true);
    });

    it('should return false if network is CoreEth ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.CoreEth,
        },
        importedFireblocksAccount
      );
      expect(result).toEqual(false);
    });

    it('should return false if network is BITCOIN ', () => {
      const result = shouldUseWalletConnectApproval(
        {
          ...network,
          vmName: NetworkVMType.BITCOIN,
        },
        importedFireblocksAccount
      );
      expect(result).toEqual(false);
    });
  });
});
