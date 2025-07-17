import { Button, Card, Stack, Tooltip, Typography } from '@avalabs/k2-alpine';
import { KeystoreFileContentInfo } from '@core/types';
import { useTranslation } from 'react-i18next';

type KeystoreFileConfirmationProps = {
  fileName: string;
  fileInfo: KeystoreFileContentInfo;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const KeystoreFileConfirmation = ({
  fileName,
  fileInfo,
  isLoading,
  onConfirm,
  onCancel,
}: KeystoreFileConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <Stack sx={{ px: 2, pt: 1, flexGrow: 1, gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
        {t('Import Details')}
      </Typography>
      <Card
        sx={{
          backgroundColor: 'grey.800',
          p: 2,
          flexGrow: 1,
        }}
      >
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            sx={{
              width: 1,
              mb: 2,
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="caption"
              fontWeight="semibold"
              whiteSpace="nowrap"
              sx={{ flexShrink: 0 }}
            >
              {t('File Name')}
            </Typography>
            <Tooltip title={fileName}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {fileName}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack
            sx={{
              width: 1,
              px: 2,
              py: 1,
              backgroundColor: 'grey.850',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">{t('Recovery Phrases')}</Typography>
            <Typography variant="h5" data-testid="seed-phrase-count">
              {fileInfo.seedPhrasesCount}
            </Typography>
          </Stack>

          <Stack
            sx={{
              width: 1,
              px: 2,
              py: 1,
              backgroundColor: 'grey.850',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">{t('Private Keys')}</Typography>
            <Typography variant="h5" data-testid="private-key-count">
              {fileInfo.privateKeysCount}
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <Stack sx={{ my: 3, gap: 1, width: 1 }}>
        <Button
          size="large"
          fullWidth
          onClick={onConfirm}
          disabled={isLoading}
          loading={isLoading}
          data-testid="import-keystore-file"
        >
          {t('Import Keystore File')}
        </Button>
        <Button
          size="large"
          color="secondary"
          fullWidth
          disabled={isLoading}
          onClick={onCancel}
          data-testid="cancel-button"
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
