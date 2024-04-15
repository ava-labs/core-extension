import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import {
  CustomRpcHeaders,
  Network,
  PLACEHOLDER_RPC_HEADERS,
} from '@src/background/services/network/models';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { NetworkRpcHeaders } from './NetworkRpcHeaders';
import { omit } from 'lodash';

type Props = {
  isReadOnly: boolean;
  network: Network;
  onChange?: (newHeaders: CustomRpcHeaders) => void;
};

export const NetworkRpcHeadersManager = ({
  isReadOnly,
  network,
  onChange,
}: Props) => {
  const { t } = useTranslation();

  const [rpcHeaders, setRpcHeaders] = useState(
    network.customRpcHeaders ?? PLACEHOLDER_RPC_HEADERS
  );
  const [isRpcHeadersManagerVisible, setIsRpcHeadersManagerVisible] =
    useState(false);

  const hasHeadersConfigured =
    Object.keys(network.customRpcHeaders ?? {}).length > 0;
  const hasEmptyHeader = '' in rpcHeaders;
  const hasChanged =
    JSON.stringify(network.customRpcHeaders ?? PLACEHOLDER_RPC_HEADERS) !==
    JSON.stringify(rpcHeaders);

  return (
    <>
      {hasHeadersConfigured && (
        <>
          <NetworkRpcHeaders rpcHeaders={rpcHeaders} isReadOnly />
          {!isReadOnly && (
            <Button
              variant="text"
              onClick={() => setIsRpcHeadersManagerVisible(true)}
            >
              {t('Edit Custom RPC Headers')}
            </Button>
          )}
        </>
      )}
      {!hasHeadersConfigured &&
        (isReadOnly ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex' }}
          >
            {t('No custom headers are configured.')}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex' }}
          >
            <Trans
              i18nKey={
                'No custom headers are configured. <button>Edit</button>'
              }
              components={{
                button: (
                  <Button
                    variant="text"
                    onClick={() => setIsRpcHeadersManagerVisible(true)}
                    sx={{ p: 0 }}
                  />
                ),
              }}
            />
          </Typography>
        ))}

      {!isReadOnly && isRpcHeadersManagerVisible && (
        <Dialog
          open={isRpcHeadersManagerVisible}
          PaperProps={{ sx: { mx: 2 } }}
        >
          <DialogTitle sx={{ px: 2 }}>{t('Custom RPC Headers')}</DialogTitle>
          <DialogContent sx={{ pl: 2, pr: 1 }}>
            <NetworkRpcHeaders
              isReadOnly={false}
              rpcHeaders={rpcHeaders}
              setRpcHeaders={setRpcHeaders}
            />
            <Stack sx={{ pr: 5, width: 1 }}>
              <Button
                variant="text"
                fullWidth
                size="small"
                onClick={() =>
                  setRpcHeaders((existing) => ({
                    ...existing,
                    '': '',
                  }))
                }
                disabled={hasEmptyHeader}
              >
                {t('Add Next')}
              </Button>
            </Stack>
          </DialogContent>
          <Stack
            direction="row"
            sx={{
              flexDirection: 'row',
              gap: 1,
              px: 2,
              pb: 3,
              pt: 4,
              alignItems: 'center',
            }}
          >
            <Button
              key="cancel"
              color="secondary"
              onClick={() => {
                setRpcHeaders(
                  network.customRpcHeaders ?? PLACEHOLDER_RPC_HEADERS
                );
                setIsRpcHeadersManagerVisible(false);
              }}
              fullWidth
            >
              {t('Cancel')}
            </Button>
            <Button
              key="save"
              disabled={!hasChanged}
              onClick={() => {
                onChange?.(omit(rpcHeaders, ''));
                setIsRpcHeadersManagerVisible(false);
              }}
              fullWidth
            >
              {t('Save')}
            </Button>
          </Stack>
        </Dialog>
      )}
    </>
  );
};
