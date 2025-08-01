import { useWalletContext } from '@core/ui';
import { useState } from 'react';

type PasswordError = 'Password invalid' | 'Unknown';

export function useRevealPhrase(password: string) {
  const { getUnencryptedMnemonic } = useWalletContext();
  const [isFetching, setIsFetching] = useState(false);
  const [passwordError, setPasswordError] = useState<PasswordError | undefined>(
    undefined,
  );
  const [unencryptedPhrase, setUnencryptedPhrase] = useState<
    string | undefined
  >(undefined);
  const isAuthorized = !isFetching && unencryptedPhrase !== undefined;

  const onPhraseReveal = async () => {
    setIsFetching(true);
    setPasswordError(undefined);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const phrase = await getUnencryptedMnemonic(password);
      setUnencryptedPhrase(phrase);
    } catch (error: unknown) {
      if (error === 'Password invalid') {
        setPasswordError(error);
      } else {
        setPasswordError('Unknown');
      }
    } finally {
      setIsFetching(false);
    }
  };

  return {
    onPhraseReveal,
    recoveryPhrase: unencryptedPhrase,
    isAuthorized,
    isFetching,
    error: passwordError,
  };
}
