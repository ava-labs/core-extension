import { useImportMissingKeysFromKeystone } from '@core/ui';

// Container for hooks that need to be run inside some of the context providers,
// making it impossible to place them directly inside App.tsx.
export const GlobalHooks = () => {
  useImportMissingKeysFromKeystone();

  return null;
};
