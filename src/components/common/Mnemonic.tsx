import { useTranslation } from 'react-i18next';
import { Mnemonic as Original, MnemonicProps } from '@avalabs/react-components';

export function Mnemonic(props: MnemonicProps) {
  const { t } = useTranslation();

  return (
    <Original
      texts={{
        confirmFirstWord: t('Select the first word'),
        confirmNextWord: t('Select the word that comes after:'),
        showCopyComplete: t('Copied!'),
        showCopyButton: t('Copy Phrase'),
      }}
      {...props}
    />
  );
}
