import { isValidAddress, isValidBtcAddress } from './isAddressValid';

describe('utils/isAddressValid.ts', () => {
  describe('isValidAddress tests', () => {
    const addressEntries = [
      { address: '', expected: false },
      { address: '123456789', expected: false },
      { address: 'oooo00000000x000', expected: false },
      {
        address: 'bc1qnat454n4sf7vshtqvz6wtx2pccfct70dpm2sp5',
        expected: false,
      },
      { address: '0x8723e5773847A4Eb5FeEDabD9320802c5c812F46', expected: true },
    ];
    it.each(addressEntries)(
      'returns $expected for $address',
      ({ address, expected }) => {
        expect(isValidAddress(address)).toBe(expected);
      },
    );
  });
  describe('isValidBtcAddress tests', () => {
    const addressEntries = [
      { address: '', expected: false },
      { address: '123456789', expected: false },
      { address: 'oooo00000000x000', expected: false },
      {
        address: '0x8723e5773847A4Eb5FeEDabD9320802c5c812F46',
        expected: false,
      },
      { address: 'bc1qnat454n4sf7vshtqvz6wtx2pccfct70dpm2sp5', expected: true },
    ];
    it.each(addressEntries)(
      'returns $expected for $address',
      ({ address, expected }) => {
        expect(isValidBtcAddress(address)).toBe(expected);
      },
    );
  });
});
