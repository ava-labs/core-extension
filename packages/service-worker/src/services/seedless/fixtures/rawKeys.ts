export const validMnemonic = {
  key_type: 'Mnemonic',
  key_id: 'Key#Mnemonic_ValidMnemonicId',
  material_id: 'ValidMnemonicId',
  purpose: 'MnemonicPurpose',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'ValidMnemonicId',
  policy: [],
  id: 'Key#Mnemonic_ValidMnemonicId',
  type: 'Mnemonic',
  publicKey: 'ValidMnemonicId',
  materialId: 'ValidMnemonicId',
};

export const btcTestKey = {
  key_type: 'SecpBtcTest',
  key_id: 'Key#BtcTest_tb1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzg26862x',
  material_id: 'tb1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzg26862x',
  purpose: 'Btc',
  enabled: true,
  owner: 'User#fae454ca-d55d-4ce8-9afe-418907d50069',
  public_key:
    '0x04a6534b16494d485de19de1fa3fb240329405ec0c225a545fbd9182b901bc0a32eb64766eb3db48b9f76366537e26f175e2497ae520d0856d49dd2911489d83dd',
  policy: [],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/0",
  },
  id: 'Key#BtcTest_tb1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzg26862x',
  type: 'SecpBtcTest',
  publicKey:
    '0x04a6534b16494d485de19de1fa3fb240329405ec0c225a545fbd9182b901bc0a32eb64766eb3db48b9f76366537e26f175e2497ae520d0856d49dd2911489d83dd',
  materialId: 'tb1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzg26862x',
};

export const evmKey = {
  key_type: 'SecpEthAddr',
  key_id: 'Key#0x8152d4841e61f8b3803ef47626707cf6be56d520',
  material_id: '0x8152d4841e61f8b3803ef47626707cf6be56d520',
  purpose: 'Evm',
  enabled: true,
  owner: 'User#users-uuid',
  public_key:
    '0x04a6534b16494d485de19de1fa3fb240329405ec0c225a545fbd9182b901bc0a32eb64766eb3db48b9f76366537e26f175e2497ae520d0856d49dd2911489d83dd',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/0",
  },
  id: 'Key#0x8152d4841e61f8b3803ef47626707cf6be56d520',
  type: 'SecpEthAddr',
  publicKey:
    '0x04a6534b16494d485de19de1fa3fb240329405ec0c225a545fbd9182b901bc0a32eb64766eb3db48b9f76366537e26f175e2497ae520d0856d49dd2911489d83dd',
  materialId: '0x8152d4841e61f8b3803ef47626707cf6be56d520',
};

export const avaKey = {
  key_type: 'SecpAvaAddr',
  key_id: 'Key#Ava_avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf0',
  material_id: 'avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf0',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'ValidTestAvaPublicKey',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/9000'/0'/0/0",
  },
  id: 'Key#Ava_avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf0',
  type: 'SecpAvaAddr',
  publicKey: 'ValidTestAvaPublicKey',
  materialId: 'avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf0',
};

export const avaKeyRemodelled = {
  key_type: 'SecpAvaAddr',
  key_id: 'Key#Ava_avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
  material_id: 'avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'ValidTestAvaPublicKeyRemodelled',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/9000'/1'/0/0",
  },
  id: 'Key#Ava_avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
  type: 'SecpAvaAddr',
  publicKey: 'ValidTestAvaPublicKeyRemodelled',
  materialId: 'avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
};

export const evmKey2 = {
  key_type: 'SecpEthAddr',
  key_id: 'Key#0x8152d4841e61f8b3803ef47626707cf6be56d521',
  material_id: '0x8152d4841e61f8b3803ef47626707cf6be56d521',
  purpose: 'Evm',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'ValidTestPublicKey2',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/1",
  },
  id: 'Key#0x8152d4841e61f8b3803ef47626707cf6be56d521',
  type: 'SecpEthAddr',
  publicKey: 'ValidTestPublicKey2',
  materialId: '0x8152d4841e61f8b3803ef47626707cf6be56d521',
};

export const solanaKey = {
  key_type: 'Ed25519SolanaAddr',
  key_id: 'Key#Solana_9pkoDvM1LG6VdeyRn6C8f9jMCCxFUBw96nnqHMRq3miu',
  material_id: '9pkoDvM1LG6VdeyRn6C8f9jMCCxFUBw96nnqHMRq3miu',
  materialId: '9pkoDvM1LG6VdeyRn6C8f9jMCCxFUBw96nnqHMRq3miu',
  enabled: true,
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/501'/0'/0'",
  },
  id: 'Key#0x8152d4841e61f8b3803ef47626707cf6be56d522',
  type: 'Ed25519SolanaAddr',
  owner: 'User#users-uuid',
  public_key: '0x1234567890abcdef',
  publicKey: '0x1234567890abcdef',
};

export const solanaKey2 = {
  key_type: 'Ed25519SolanaAddr',
  key_id: 'Key#Solana_9pkoDvM1LG6VdeyRn6C8f9jMCCxFUBw96nnqHMRq3miy',
  material_id: '9pkoDvM1LG6VdeyRn6C8f9jMCCxFUBw96nnqHMRq3miy',
  materialId: '9pkoDvM1LG6VdeyRn6C8f9jMCCxFUBw96nnqHMRq3miy',
  enabled: true,
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/501'/1'/0'",
  },
  id: 'Key#0x8152d4841e61f8b3803ef47626707cf6be56d522',
  type: 'Ed25519SolanaAddr',
  owner: 'User#users-uuid',
  public_key: '0x1234567890abcdff',
  publicKey: '0x1234567890abcdff',
};

export const avaKey2 = {
  key_type: 'SecpAvaAddr',
  key_id: 'Key#Ava_avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
  material_id: 'avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'ValidTestAvaPublicKey2',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/9000'/0'/0/1",
  },
  id: 'Key#Ava_avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
  type: 'SecpAvaAddr',
  publicKey: 'ValidTestAvaPublicKey2',
  materialId: 'avax1mrtwgj4qgexgde60vsn53gk83mghfmrpvqdtf1',
};

export const btcKey = {
  key_type: 'SecpBtc',
  key_id: 'Key#Btc_bc1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzgquuf34',
  material_id: 'bc1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzgquuf34',
  purpose: 'Btc',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'ValidTestPublicKey',
  policy: [],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/0",
  },
  id: 'Key#Btc_bc1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzgquuf34',
  type: 'SecpBtc',
  publicKey: 'ValidTestPublicKey',
  materialId: 'bc1qtq748ycqcns3t7gt7lyfxjrt5lrzxlzgquuf34',
};

export const avaTestKey = {
  key_type: 'SecpAvaTestAddr',
  key_id: 'Key#Ava_fuji1mrtwgj4qgexgde60vsn53gk83mghfmrpqjf59s',
  material_id: 'fuji1mrtwgj4qgexgde60vsn53gk83mghfmrpqjf59s',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#fae454ca-d55d-4ce8-9afe-418907d50069',
  public_key: 'ValidTestAvaPublicKey',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/9000'/0'/0/0",
  },
  id: 'Key#Ava_fuji1mrtwgj4qgexgde60vsn53gk83mghfmrpqjf59s',
  type: 'SecpAvaTestAddr',
  publicKey: 'ValidTestAvaPublicKey',
  materialId: 'fuji1mrtwgj4qgexgde60vsn53gk83mghfmrpqjf59s',
};

export const anotherValidMnemonic = {
  key_type: 'Mnemonic',
  key_id: 'Key#Mnemonic_AnotherValidMnemonicId',
  material_id: 'AnotherValidMnemonicId',
  purpose: 'MnemonicPurpose',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'AnotherValidMnemonicId',
  policy: [],
  id: 'Key#Mnemonic_AnotherValidMnemonicId',
  type: 'Mnemonic',
  publicKey: 'AnotherValidMnemonicId',
  materialId: 'AnotherValidMnemonicId',
};

export const anotherValidEvmKey = {
  key_type: 'SecpEthAddr',
  key_id: 'Key#AnotherValidEvmAddress',
  material_id: '0xAnotherValidEvmAddress',
  purpose: 'Evm',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'AnotherValidTestPublicKey',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: anotherValidMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/0",
  },
  id: 'Key#0xAnotherValidEvmAddress',
  type: 'SecpEthAddr',
  publicKey: 'AnotherValidTestPublicKey',
  materialId: '0xAnotherValidEvmAddress',
};

export const anotherValidAvaKey = {
  key_type: 'SecpAvaAddr',
  key_id: 'Key#Ava_AnotherValidAvaAddress',
  material_id: 'AnotherValidAvaAddress',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'AnotherValidTestAvaPublicKey',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: anotherValidMnemonic.materialId,
    derivation_path: "m/44'/9000'/0'/0/0",
  },
  id: 'Key#Ava_AnotherValidAvaAddress',
  type: 'SecpAvaAddr',
  publicKey: 'AnotherValidTestAvaPublicKey',
  materialId: 'AnotherValidAvaAddress',
};

export const anotherValidSolanaKey = {
  key_type: 'Ed25519SolanaAddr',
  key_id: 'Key#Ava_AnotherValidSolanaAddress',
  material_id: 'AnotherValidSolanaAddress',
  materialId: 'AnotherValidSolanaAddress',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'AnotherValidSolanaPublicKey',
  derivation_info: {
    mnemonic_id: anotherValidMnemonic.materialId,
    derivation_path: "m/44'/501'/0'/0",
  },
  id: 'Key#Ava_AnotherValidSolanaAddress',
  type: 'Ed25519SolanaAddr',
  publicKey: 'AnotherValidSolanaPublicKey',
};

export const anotherValidBtcKey = {
  key_type: 'SecpBtc',
  key_id: 'Key#Btc_AnotherValidBtcAddress',
  material_id: 'AnotherValidBtcAddress',
  purpose: 'Btc',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'AnotherValidTestPublicKey',
  policy: [],
  derivation_info: {
    mnemonic_id: validMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/0",
  },
  id: 'Key#Btc_AnotherValidBtcAddress',
  type: 'SecpBtc',
  publicKey: 'AnotherValidTestPublicKey',
  materialId: 'AnotherValidBtcAddress',
};

export const randomMnemonic = {
  key_type: 'Mnemonic',
  key_id: 'Key#Mnemonic_RandomMnemonicForTestingPurposes',
  material_id: 'RandomMnemonicForTestingPurposes',
  purpose: 'MnemonicPurpose',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'RandomMnemonicForTestingPurposes',
  policy: [],
  id: 'Key#Mnemonic_RandomMnemonicForTestingPurposes',
  type: 'Mnemonic',
  publicKey: 'RandomMnemonicForTestingPurposes',
  materialId: 'RandomMnemonicForTestingPurposes',
};

export const randomEvmKey = {
  key_type: 'SecpEthAddr',
  key_id: 'Key#RandomEvmKey',
  material_id: 'RandomEvmKey',
  purpose: 'Evm',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'RandomValidTestPublicKey',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: randomMnemonic.materialId,
    derivation_path: "m/44'/60'/0'/0/0",
  },
  id: 'Key#RandomEvmKey',
  type: 'SecpEthAddr',
  publicKey: 'RandomValidTestPublicKey',
  materialId: 'RandomEvmKey',
};

export const randomAvaKey = {
  key_type: 'SecpAvaAddr',
  key_id: 'Key#Ava_avaabcd1234efgh5678',
  material_id: 'avaabcd1234efgh5678',
  purpose: 'Ava',
  enabled: true,
  owner: 'User#users-uuid',
  public_key: 'RandomTestAvaPublicKey',
  policy: ['AllowRawBlobSigning'],
  derivation_info: {
    mnemonic_id: randomMnemonic.materialId,
    derivation_path: "m/44'/9000'/0'/0/0",
  },
  id: 'Key#Ava_avaabcd1234efgh5678',
  type: 'SecpAvaAddr',
  publicKey: 'RandomTestAvaPublicKey',
  materialId: 'avaabcd1234efgh5678',
};

export const validKeySet = [
  evmKey,
  avaKey,
  btcKey,
  validMnemonic,
  btcTestKey,
  avaTestKey,
  solanaKey,
];

export const validKeySetWithNewAvalancheKeys = [
  ...validKeySet,
  avaKeyRemodelled,
];

export const validKeySetWithTwoAccounts = [
  evmKey2,
  avaKey2,
  solanaKey2,
  ...validKeySet,
];

export const anotherValidKeySet = [
  anotherValidMnemonic,
  anotherValidEvmKey,
  anotherValidBtcKey,
  anotherValidAvaKey,
  anotherValidSolanaKey,
];

export const invalidKeySet = [randomAvaKey, randomMnemonic];
