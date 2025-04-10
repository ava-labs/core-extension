import { omit } from 'lodash';
import { Dispatch, SetStateAction, useCallback } from 'react';
import {
  Grow,
  IconButton,
  Stack,
  TextField,
  TrashIcon,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import {
  CustomRpcHeaders,
  PLACEHOLDER_RPC_HEADERS,
} from 'packages/service-worker/src/services/network/models';
import { isValidHttpHeader } from 'packages/service-worker/src/services/network/utils/isValidHttpHeader';

type Props = {
  isReadOnly: boolean;
  rpcHeaders: CustomRpcHeaders;
  setRpcHeaders?: Dispatch<SetStateAction<CustomRpcHeaders>>;
};

export const NetworkRpcHeaders = ({
  isReadOnly,
  rpcHeaders,
  setRpcHeaders,
}: Props) => {
  const { t } = useTranslation();

  const updateHeader = useCallback(
    (
      keyIndex: number,
      { newName, newValue }: { newName?: string; newValue?: string },
    ) => {
      setRpcHeaders?.((previous) =>
        Object.fromEntries(
          Object.entries(previous).map(([name, value], index) => {
            if (index === keyIndex) {
              return [newName ?? name, newValue ?? value];
            }

            return [name, value];
          }),
        ),
      );
    },
    [setRpcHeaders],
  );

  return (
    <Stack sx={{ width: 1 }}>
      {Object.entries(rpcHeaders).map(([headerName, headerValue], index) => (
        <Grow in key={`rpc-header-${index}`}>
          <Stack direction="row" sx={{ gap: 0.5, mb: 1 }}>
            <TextField
              size="small"
              value={headerName}
              InputProps={{
                readOnly: isReadOnly,
              }}
              placeholder={t('Header Name')}
              onChange={(ev) => {
                if (
                  !ev.target.value ||
                  isValidHttpHeader(ev.target.value, headerValue)
                ) {
                  updateHeader(index, { newName: ev.target.value });
                }
              }}
            />
            <TextField
              size="small"
              value={headerValue}
              InputProps={{
                readOnly: isReadOnly,
              }}
              placeholder={t('Value')}
              onChange={(ev) => {
                if (isValidHttpHeader(headerName, ev.target.value)) {
                  updateHeader(index, { newValue: ev.target.value });
                }
              }}
            />
            {!isReadOnly && (
              <IconButton
                disabled={headerName === ''}
                onClick={() =>
                  setRpcHeaders?.((existing) => {
                    if (Object.keys(existing).length === 1) {
                      return PLACEHOLDER_RPC_HEADERS;
                    }

                    return omit(existing, headerName);
                  })
                }
              >
                <TrashIcon />
              </IconButton>
            )}
          </Stack>
        </Grow>
      ))}
    </Stack>
  );
};
