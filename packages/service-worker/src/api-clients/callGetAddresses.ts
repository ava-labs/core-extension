import { ExtendedPublicKey, AVALANCHE_BASE_DERIVATION_PATH } from '@core/types';

import { NetworkType, postV1GetAddresses } from '~/api-clients/profile-api';
import { profileApiClient } from '~/api-clients';

export const callGetAddresses = (extendedPublicKeys: ExtendedPublicKey[]) => {
  const avalancheExtendedPublicKeys = extendedPublicKeys.filter(
    ({ curve, derivationPath }) =>
      derivationPath.startsWith(AVALANCHE_BASE_DERIVATION_PATH) &&
      curve === 'secp256k1',
  );
  if (avalancheExtendedPublicKeys.length === 0) {
    return;
  }

  const networkTypes: NetworkType[] = ['AVM', 'PVM'];
  const isTestnetChoice = [true, false];

  networkTypes.map((networkType) => {
    isTestnetChoice.map((isTestnet) => {
      avalancheExtendedPublicKeys.map((xpubKey) => {
        postV1GetAddresses({
          client: profileApiClient,
          body: {
            extendedPublicKey: xpubKey.key,
            isTestnet,
            networkType,
            withExtraAddresses: false,
          },
        }).catch();
      });
    });
  });
};
