import { Typography, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MdFileUpload } from 'react-icons/md';

export const KeystoreFileUploadEmpty = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <MdFileUpload
        size={40}
        style={{
          color: theme.palette.text.primary,
          marginBottom: '6px',
        }}
      />
      {/*TODO: Replace with new alpine icon*/}
      <Typography variant="body3" fontWeight={600} color="text.primary">
        {t('Drop your file here to upload')}
      </Typography>
      <Typography variant="caption" color="text.secondary" whiteSpace="balance">
        {t('Only Keystore files from the Avalanche Wallet are supported')}
      </Typography>
    </>
  );
};
