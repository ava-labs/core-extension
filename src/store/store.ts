import { createContext, useContext } from 'react';
import AssetsStore from '@src/store/assets/assetsStore';
import ThemeStore from '@src/store/theme/themeStore';
import ExtensionStore from '@src/store/extension/extensionStore';
// import OnboardStore from '@src/store/onboard/onboardStore';
// import WalletStore from '@src/store/wallet/walletStore';
// import TransactionStore from '@src/store/transaction/transactionStore';
import PermissionsStore from './permissions/permissionsStore';

export interface CombinedStores {
  asssetsStore: AssetsStore;
  themeStore: ThemeStore;
  extensionStore: ExtensionStore;
  // onboardStore: OnboardStore;
  // walletStore: WalletStore;
  // transactionStore: TransactionStore;
  permissionsStore: PermissionsStore;
}

export const store: CombinedStores = {
  asssetsStore: new AssetsStore(),
  themeStore: new ThemeStore(),
  extensionStore: new ExtensionStore(),
  // onboardStore: new OnboardStore(),
  // walletStore: new WalletStore(),
  // transactionStore: new TransactionStore(),
  permissionsStore: new PermissionsStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
