import { useTranslation } from 'react-i18next';
import { Button, Stack, Tooltip } from '@avalabs/k2-alpine';

type DisabledSendBodyProps = {
  reason: string;
};

export const DisabledSendBody = ({ reason }: DisabledSendBodyProps) => {
  const { t } = useTranslation();

  return (
    <Stack width="100%" flexGrow={1} justifyContent="flex-end">
      <Stack width="100%">
        <Tooltip title={reason}>
          <span>
            <Button
              variant="contained"
              color="primary"
              size="extension"
              fullWidth
              disabled
            >
              {t('Send')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
