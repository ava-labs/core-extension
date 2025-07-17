import { Button, Card, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import {
  ChangeEventHandler,
  DragEventHandler,
  RefObject,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

type KeystoreFileUploadProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  onDrop: DragEventHandler<HTMLDivElement>;
  onFileSelected: ChangeEventHandler<HTMLInputElement>;
};

export const KeystoreFileUpload = ({
  inputRef,
  onDrop,
  onFileSelected,
}: KeystoreFileUploadProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <Stack sx={{ px: 2, pt: 1, flexGrow: 1, gap: 1 }}>
      <Card
        sx={{
          p: 4,
          transition: theme.transitions.create(['border', 'color']),
          color: isDraggingOver ? theme.palette.info.light : 'initial',
          border: `2px dashed ${
            isDraggingOver
              ? theme.palette.info.light
              : theme.palette.neutral['850_30']
          }`,
        }}
        onDrop={(ev) => {
          ev.preventDefault();

          setIsDraggingOver(false);
          onDrop(ev);
        }}
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
            gap: 1,
            textAlign: 'center',
          }}
        >
          {/* <UploadIcon size={64} /> TODO: Replace with new alpine icon*/}
          <Typography variant="h6" color="text.primary">
            {t('Drop your file here to upload')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              'Only keystore files exported from the Avalanche Wallet are supported.',
            )}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ my: 2 }}>
            {t('Or')}
          </Typography>
          <Button
            size="medium"
            fullWidth
            component="label"
            htmlFor="browse-files"
            data-testid="browse-files"
          >
            {t('Browse Files')}
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            id="browse-files"
            onChange={onFileSelected}
          />
        </Stack>
      </Card>
    </Stack>
  );
};
