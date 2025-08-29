import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';

import { Network } from '@core/types';
import { NetworkAvatar } from '../BadgedAvatar/NetworkAvatar';
import { NetworkNameField } from './NetworkNameField';
import { useState } from 'react';
import {
  EditNetworkFormTab,
  NetworkFormFieldInfo,
  NetworkFormFields,
} from './types';
import { NetworkForm } from './NetworkForm';
import { PageTopBar } from '@/components/PageTopBar';
import { MdInfoOutline } from 'react-icons/md';

type NetworkEditorProps = {
  setTab: (tab: EditNetworkFormTab) => void;
  setNetwork: (network: Network) => void;
  network: Network;
  isValid: boolean;
  fieldInfo: NetworkFormFieldInfo;
  submit: () => void;
  cancel: () => void;
  canResetRpcUrl: boolean;
  autoFocus: boolean;
};

export const NetworkEditor = ({
  setTab,
  setNetwork,
  network,
  isValid,
  fieldInfo,
  submit,
  cancel,
  canResetRpcUrl,
  autoFocus,
}: NetworkEditorProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isNaming, setIsNaming] = useState(false);

  const fieldsWithErrors = Object.keys(fieldInfo).filter((key) => {
    const field = fieldInfo[key as NetworkFormFields];
    if (!field) return false;
    return field.error !== undefined;
  });

  const showMissingNetworkNameWarning =
    !network.chainName &&
    fieldsWithErrors.length == 1 &&
    fieldsWithErrors.includes('chainName');

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
    >
      <PageTopBar showBack={true} />

      {/* Header - Avatar and Name */}
      <Stack width="100%" alignItems="center" sx={{ px: 1.5, pb: 2 }}>
        <NetworkAvatar
          network={network}
          sx={{ width: '80px', height: '80px', mb: 2.75 }}
        />
        <NetworkNameField
          name={network.chainName}
          setName={(name) => setNetwork({ ...network, chainName: name })}
          isNaming={isNaming}
          setIsNaming={setIsNaming}
          autoFocus={autoFocus}
          error={fieldInfo.chainName?.error}
          required={!!fieldInfo.chainName?.required}
        />
      </Stack>

      {/* Scrollable Details */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 12px',
        }}
      >
        <NetworkForm
          network={network}
          setNetwork={setNetwork}
          setTab={setTab}
          fieldInfo={fieldInfo}
          canResetRpcUrl={canResetRpcUrl}
        />
      </div>

      {/* Bottom Buttons */}
      <Stack
        width="100%"
        gap={1}
        sx={{
          pt: 2,
          px: 1.5,
          pb: 2,
        }}
      >
        {showMissingNetworkNameWarning && (
          <Stack direction="row" alignItems="center" gap={1}>
            <MdInfoOutline color={theme.palette.error.main} />
            <Typography variant="body2" color="error">
              {t('Network name is required')}
            </Typography>
          </Stack>
        )}
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          disabled={!isValid}
          onClick={submit}
        >
          {t('Save')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={cancel}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};
