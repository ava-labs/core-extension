import { Account, AccountType } from '@core/types';
import { PersonalAvatarName } from '@/components/PersonalAvatar';
import { ACCOUNT_AVATAR_OPTIONS, getAccountAvatars } from './accountAvatars';

describe('getAccountAvatars', () => {
  const mockAccount1: Account = {
    index: 0,
    id: 'account-1',
    name: 'Account 1',
    addressBTC: 'bc1qaddress1',
    addressC: '0xAddress1',
    addressAVM: 'X-avax1address1',
    addressPVM: 'P-avax1address1',
    addressCoreEth: '',
    type: AccountType.PRIMARY,
    walletId: 'wallet-1',
  };

  const mockAccount2: Account = {
    index: 1,
    id: 'account-2',
    name: 'Account 2',
    addressBTC: 'bc1qaddress2',
    addressC: '0xAddress2',
    addressAVM: 'X-avax1address2',
    addressPVM: 'P-avax1address2',
    addressCoreEth: '',
    type: AccountType.PRIMARY,
    walletId: 'wallet-1',
  };

  const mockAccount3: Account = {
    index: 2,
    id: 'account-3',
    name: 'Account 3',
    addressBTC: 'bc1qaddress3',
    addressC: '0xAddress3',
    addressAVM: 'X-avax1address3',
    addressPVM: 'P-avax1address3',
    addressCoreEth: '',
    type: AccountType.PRIMARY,
    walletId: 'wallet-1',
  };

  it('returns empty map for empty accounts array', () => {
    const result = getAccountAvatars({
      userAvatarName: 'abstract-1.svg',
      accountsInWallet: [],
    });
    expect(result.size).toBe(0);
  });

  it('assigns avatar to single account', () => {
    const userAvatar = 'test.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: [mockAccount1],
    });

    expect(result.size).toBe(1);
    expect(result.get('account-1')).toBe('abstract-1.svg');
  });

  it('assigns different avatars to multiple accounts', () => {
    const userAvatar = 'test.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: [mockAccount1, mockAccount2, mockAccount3],
    });

    expect(result.size).toBe(3);
    expect(result.get('account-1')).toBe('abstract-1.svg');
    expect(result.get('account-2')).toBe('abstract-2.svg');
    expect(result.get('account-3')).toBe('abstract-3.svg');
  });

  it('excludes user avatar from available options', () => {
    const userAvatar = 'abstract-1.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: [mockAccount1, mockAccount2],
    });

    const avatar1 = result.get('account-1');
    const avatar2 = result.get('account-2');
    expect(avatar1).toBe('abstract-2.svg');
    expect(avatar2).toBe('abstract-3.svg');
  });

  it('cycles through avatars for many accounts', () => {
    // Create 20 accounts (more than available avatars)
    const manyAccounts: Account[] = Array.from({ length: 20 }, (_, i) => ({
      ...mockAccount1,
      id: `account-${i}`,
      index: i,
    }));

    const userAvatar = 'test.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: manyAccounts,
    });

    expect(result.size).toBe(20);

    // All accounts should have avatars assigned
    manyAccounts.forEach((account, index) => {
      const expectedAvatar =
        ACCOUNT_AVATAR_OPTIONS[index % ACCOUNT_AVATAR_OPTIONS.length];
      expect(result.get(account.id)).toBe(expectedAvatar);
    });
  });

  it('handles user avatar not affecting assignment when not in filtered list', () => {
    // Using an avatar from the list
    const userAvatar = 'test-avatar.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: [mockAccount1, mockAccount2],
    });

    expect(result.size).toBe(2);
    expect(result.get('account-1')).toBe('abstract-1.svg');
    expect(result.get('account-2')).toBe('abstract-2.svg');
  });

  it('handles all accounts with same properties but different IDs', () => {
    const accounts: Account[] = [
      { ...mockAccount1, id: 'id-1' },
      { ...mockAccount1, id: 'id-2' },
      { ...mockAccount1, id: 'id-3' },
    ];

    const userAvatar: PersonalAvatarName = 'abstract-1.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: accounts,
    });

    expect(result.size).toBe(3);
    expect(result.get('id-1')).toBe('abstract-2.svg');
    expect(result.get('id-2')).toBe('abstract-3.svg');
    expect(result.get('id-3')).toBe('abstract-4.svg');
  });

  it('handles all accounts with same ids', () => {
    const accounts: Account[] = [mockAccount1, mockAccount1];

    const userAvatar: PersonalAvatarName = 'abstract-1.svg';
    const result = getAccountAvatars({
      userAvatarName: userAvatar,
      accountsInWallet: accounts,
    });

    expect(result.size).toBe(1);
    expect(result.get('account-1')).toBe('abstract-2.svg');
  });
});
