import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import {
  ChangeEvent,
  useState,
  DragEvent,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';

import { FileImage } from './FileImage';
import { useKeystoreFileImport } from '@core/ui/src/hooks/useKeystoreFileImport';
import { KeystoreError } from '@core/types';
import { KeystoreFileUploadEmpty } from './KeystoreFileUploadEmpty';
import { useAnalyticsContext } from '@core/ui/src/contexts/AnalyticsProvider';

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
  const { capture } = useAnalyticsContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const { isValidKeystoreFile } = useKeystoreFileImport({});

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const checkFileAndSet = useCallback(
    async (newFile?: File | null) => {
      if (newFile && (await isValidKeystoreFile(newFile))) {
        setFile(newFile);
      } else {
        setFile(null);
        onError(KeystoreError.InvalidVersion);
        capture('KeystoreFileUnsupported');
      }
    },
    [capture, isValidKeystoreFile, onError, setFile],
  );

  const handleFileUploaded = async (ev: ChangeEvent<HTMLInputElement>) => {
    const newFile = ev.target.files?.[0];
    checkFileAndSet(newFile);
  };

  const handleFileDropped = async (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setIsDraggingOver(false);
    const item = ev.dataTransfer.items[0];
    const rawFile = item?.getAsFile();
    checkFileAndSet(rawFile);
  };

  return (
    <Stack sx={{ flexGrow: 1, gap: '14px' }}>
      <Stack
        sx={{
          p: 4,
          transition: theme.transitions.create(['border', 'color']),
          border: `2px dashed ${
            isDraggingOver
              ? theme.palette.info.light
              : theme.palette.background.switchTrackUnchecked
          }`,
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
                  sx={{ mb: '30px' }}
                >
                  {file.name}
                </Typography>
              </>
            ) : (
              <KeystoreFileUploadEmpty />
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
        size="small"
      >
        {t('Next')}
      </Button>
    </Stack>
  );
};
