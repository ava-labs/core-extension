import { NetworkVMType } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { Contact } from '@avalabs/types';
import { getContactAddressForChain } from './getContactAddressForChain';

describe('utils/getContactAddressForChain', () => {
  const mockNetwork: NetworkWithCaipId = {
    chainId: 43114,
    caipId: 'eip155:43114',
    chainName: 'Avalanche C-Chain',
    vmName: NetworkVMType.EVM,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    logoUri: '',
    primaryColor: '',
    explorerUrl: 'https://snowtrace.io',
    isTestnet: false,
    networkToken: {
      name: 'Avalanche',
      symbol: 'AVAX',
      description: 'Avalanche',
      decimals: 18,
      logoUri: '',
    },
  };

  const fullContact: Contact = {
    id: 'contact-1',
    name: 'Test Contact',
    address: '0x1234567890123456789012345678901234567890',
    addressBTC: 'bc1q1234567890123456789012345678901234567890',
    addressXP: 'avax1234567890123456789012345678901234567890',
    addressSVM: '11111111111111111111111111111111',
    isKnown: true,
  };

  describe('when network or contact is missing', () => {
    it('should return empty string when network is undefined', () => {
      const result = getContactAddressForChain(undefined, fullContact);
      expect(result).toBe('');
    });

    it('should return empty string when contact is undefined', () => {
      const result = getContactAddressForChain(mockNetwork, undefined);
      expect(result).toBe('');
    });

    it('should return empty string when both are undefined', () => {
      const result = getContactAddressForChain(undefined, undefined);
      expect(result).toBe('');
    });

    it('should return empty string when contact is null', () => {
      const result = getContactAddressForChain(mockNetwork, null as any);
      expect(result).toBe('');
    });
  });

  describe('EVM networks', () => {
    const evmNetwork: NetworkWithCaipId = {
      ...mockNetwork,
      vmName: NetworkVMType.EVM,
    };

    it('should return the EVM address for EVM network', () => {
      const result = getContactAddressForChain(evmNetwork, fullContact);
      expect(result).toBe(fullContact.address);
    });

    it('should return empty string when contact has no EVM address', () => {
      const contactWithoutEvm: Partial<Contact> = {
        id: 'contact-2',
        name: 'No EVM Contact',
        addressBTC: 'bc1q1234567890123456789012345678901234567890',
      };
      const result = getContactAddressForChain(evmNetwork, contactWithoutEvm);
      expect(result).toBe('');
    });
  });

  describe('Bitcoin networks', () => {
    const bitcoinNetwork: NetworkWithCaipId = {
      ...mockNetwork,
      vmName: NetworkVMType.BITCOIN,
    };

    it('should return the BTC address for Bitcoin network', () => {
      const result = getContactAddressForChain(bitcoinNetwork, fullContact);
      expect(result).toBe(fullContact.addressBTC);
    });

    it('should return empty string when contact has no BTC address', () => {
      const contactWithoutBtc: Partial<Contact> = {
        id: 'contact-3',
        name: 'No BTC Contact',
        address: '0x1234567890123456789012345678901234567890',
      };
      const result = getContactAddressForChain(
        bitcoinNetwork,
        contactWithoutBtc,
      );
      expect(result).toBe('');
    });
  });

  describe('AVM networks', () => {
    const avmNetwork: NetworkWithCaipId = {
      ...mockNetwork,
      vmName: NetworkVMType.AVM,
    };

    it('should return the XP address for AVM network', () => {
      const result = getContactAddressForChain(avmNetwork, fullContact);
      expect(result).toBe(fullContact.addressXP);
    });

    it('should return empty string when contact has no XP address', () => {
      const contactWithoutXp: Partial<Contact> = {
        id: 'contact-4',
        name: 'No XP Contact',
        address: '0x1234567890123456789012345678901234567890',
      };
      const result = getContactAddressForChain(avmNetwork, contactWithoutXp);
      expect(result).toBe('');
    });
  });

  describe('PVM networks', () => {
    const pvmNetwork: NetworkWithCaipId = {
      ...mockNetwork,
      vmName: NetworkVMType.PVM,
    };

    it('should return the XP address for PVM network', () => {
      const result = getContactAddressForChain(pvmNetwork, fullContact);
      expect(result).toBe(fullContact.addressXP);
    });

    it('should return empty string when contact has no XP address', () => {
      const contactWithoutXp: Partial<Contact> = {
        id: 'contact-5',
        name: 'No XP Contact',
        address: '0x1234567890123456789012345678901234567890',
      };
      const result = getContactAddressForChain(pvmNetwork, contactWithoutXp);
      expect(result).toBe('');
    });
  });

  describe('SVM networks', () => {
    const svmNetwork: NetworkWithCaipId = {
      ...mockNetwork,
      vmName: NetworkVMType.SVM,
    };

    it('should return the SVM address for SVM network', () => {
      const result = getContactAddressForChain(svmNetwork, fullContact);
      expect(result).toBe(fullContact.addressSVM);
    });

    it('should return empty string when contact has no SVM address', () => {
      const contactWithoutSvm: Partial<Contact> = {
        id: 'contact-6',
        name: 'No SVM Contact',
        address: '0x1234567890123456789012345678901234567890',
      };
      const result = getContactAddressForChain(svmNetwork, contactWithoutSvm);
      expect(result).toBe('');
    });
  });
});
