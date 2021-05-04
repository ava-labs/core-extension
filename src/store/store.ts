import { createContext, useContext } from 'react';
import AssetsStore from '@src/store/assets/assetsStore';
import ThemeStore from '@src/store/theme/themeStore';
import ExtensionStore from '@src/store/extension/extensionStore';
import OnboardStore from '@src/store/onboard/onboardStore';

export interface CombinedStores {
  asssetsStore: AssetsStore;
  themeStore: ThemeStore;
  extensionStore: ExtensionStore;
  onboardStore: OnboardStore;
}

export const store: CombinedStores = {
  asssetsStore: new AssetsStore(),
  themeStore: new ThemeStore(),
  extensionStore: new ExtensionStore(),
  onboardStore: new OnboardStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext(StoreContext);
};
