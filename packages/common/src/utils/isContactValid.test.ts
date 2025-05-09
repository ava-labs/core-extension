import { Contact } from '@avalabs/types';
import { isContactValid } from './isContactValid';
import { isAddress } from 'ethers';
import { isBech32Address } from '@avalabs/core-bridge-sdk';
import { isValidXPAddress } from './isAddressValid';

jest.mock('ethers', () => ({
  isAddress: jest.fn(),
}));

jest.mock('@avalabs/core-bridge-sdk', () => ({
  isBech32Address: jest.fn(),
}));
jest.mock('./isAddressValid', () => ({
  isValidXPAddress: jest.fn(),
}));
describe('src/utils/isContactValid.ts', () => {
  const basicContact: Contact = {
    id: '1',
    name: 'contactC',
    address: 'address',
  };

  const contactBTC: Contact = {
    ...basicContact,
    addressBTC: 'addressBTC',
  };
  const contactXP: Contact = {
    ...basicContact,
    addressXP: 'addressXP',
  };
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(isAddress).mockImplementation(() => true);
    jest.mocked(isBech32Address).mockImplementation(() => true);
    jest.mocked(isValidXPAddress).mockImplementation(() => true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be valid when address is valid', async () => {
    const result = isContactValid(basicContact);
    expect(result).toEqual({ reason: '', valid: true });
  });
  it('should be valid when address is not valid', async () => {
    jest.mocked(isAddress).mockImplementation(() => false);

    const result = isContactValid(basicContact);
    expect(result).toEqual({ reason: 'address is invalid', valid: false });
  });

  it('should be valid when addressBTC is valid', async () => {
    const result = isContactValid(contactBTC);
    expect(result).toEqual({ reason: '', valid: true });
  });
  it('should be valid when addressBTC is not valid', async () => {
    jest.mocked(isBech32Address).mockImplementation(() => false);

    const result = isContactValid(contactBTC);
    expect(result).toEqual({ reason: 'address is invalid', valid: false });
  });
  it('should be valid when addressBTC is valid', async () => {
    const result = isContactValid(contactXP);
    expect(result).toEqual({ reason: '', valid: true });
  });
  it('should be valid when addressBTC is not valid', async () => {
    jest.mocked(isValidXPAddress).mockImplementation(() => false);

    const result = isContactValid(contactXP);
    expect(result).toEqual({ reason: 'address is invalid', valid: false });
  });
});
