import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import {
  ChangeEvent,
  useState,
  DragEvent,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';

import { FileImage } from './FileImage';
import { useKeystoreFileImport } from '@core/ui/src/hooks/useKeystoreFileImport';
import { KeystoreError } from '@core/types';
import { MdFileUpload } from 'react-icons/md';

type KeystoreFileUploadProps = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  onSubmit: (file: File | null) => void;
  onError: (error: KeystoreError) => void;
};

export const KeystoreFileUpload = ({
  file,
  setFile,
  onSubmit,
  onError,
}: KeystoreFileUploadProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const { isValidKeystoreFile } = useKeystoreFileImport();

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileUploaded = async (ev: ChangeEvent<HTMLInputElement>) => {
    const newFile = ev.target.files?.[0];

    if (!newFile) {
      onError(KeystoreError.InvalidVersion);
      return;
    }

    if (await isValidKeystoreFile(newFile)) {
      setFile(newFile ?? null);
    } else {
      onError(KeystoreError.InvalidVersion);
    }
  };

  const handleFileDropped = async (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setIsDraggingOver(false);
    const item = ev.dataTransfer.items[0];
    if (!item) {
      setFile(null);
      return;
    }
    const rawFile = item.getAsFile();
    if (rawFile && (await isValidKeystoreFile(rawFile))) {
      setFile(rawFile);
    } else {
      onError(KeystoreError.InvalidVersion);
      setFile(null);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, gap: '14px' }}>
      <Stack
        sx={{
          p: 4,
          transition: theme.transitions.create(['border', 'color']),
          color: isDraggingOver ? theme.palette.info.light : 'initial',
          border: `2px dashed ${theme.palette.background.switchTrackUnchecked}`,
          borderRadius: '12px',
          flexGrow: 1,
        }}
        onDrop={handleFileDropped}
        onDragOver={(ev) => ev.preventDefault()}
        onDragEnter={() => {
          setIsDraggingOver(true);
        }}
        onDragLeave={() => {
          setIsDraggingOver(false);
        }}
      >
        <Stack
          sx={{
            pointerEvents: isDraggingOver ? 'none' : 'all', // prevents dragLeave event from firing when dragging over child elements
            justifyContent: 'center',
            alignItems: 'center',
            gap: '21px',
            textAlign: 'center',
            height: '100%',
          }}
        >
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {file ? (
              <>
                <FileImage />

                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ mb: '47px' }}
                >
                  {file.name}
                </Typography>
              </>
            ) : (
              <>
                <MdFileUpload
                  size={40}
                  style={{
                    color: theme.palette.text.primary,
                    marginBottom: '6px',
                  }}
                />
                {/*TODO: Replace with new alpine icon*/}
                <Typography
                  sx={{
                    '&.MuiTypography-root': {
                      fontSize: '12px',
                      fontWeight: 600,
                      lineHeight: '21px',
                      color: 'text.primary',
                    },
                  }}
                >
                  {t('Drop your file here to upload')}
                </Typography>
                <Typography
                  sx={{
                    '&.MuiTypography-root': {
                      fontSize: '11px',
                      fontWeight: 400,
                      lineHeight: '14px',
                      color: 'text.secondary',
                      whiteSpace: 'balance',
                    },
                  }}
                >
                  {' '}
                  {t(
                    'Only Keystore files from the Avalanche Wallet are supported',
                  )}
                </Typography>
              </>
            )}
          </Stack>

          <Button
            size="small"
            component="label"
            htmlFor="browse-files"
            data-testid="browse-files"
            variant="contained"
            color="secondary"
          >
            {t('Browse Files')}
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            id="browse-files"
            onChange={handleFileUploaded}
          />
        </Stack>
      </Stack>

      <Button
        disabled={!file}
        onClick={() => onSubmit(file)}
        sx={{ marginTop: 'auto' }}
        variant="contained"
        color="primary"
        fullWidth
      >
        {t('Next')}
      </Button>
    </Stack>
  );
};
