import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';

import { Network } from '@core/types';

import { useState } from 'react';

import { PageTopBar } from '@/components/PageTopBar';
import { MdInfoOutline } from 'react-icons/md';

import { NetworkAvatar } from './BadgedAvatar/NetworkAvatar';
import { NetworkNameField } from './NetworkForm/NetworkNameField';
import { NetworkForm } from './NetworkForm/NetworkForm';
import {
  EditNetworkFormTab,
  NetworkFormFieldInfo,
  NetworkFormFields,
} from './NetworkForm/types';

type NetworkDetailsProps = {
  setTab: (tab: EditNetworkFormTab) => void;
  setNetwork: (network: Network) => void;
  network: Network;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isValid: boolean;
  fieldInfo: NetworkFormFieldInfo;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  canResetRpcUrl: boolean;
  autoFocus: boolean;
  isCustom: boolean;
  pageType: 'add' | 'edit';
};

export const NetworkDetails = ({
  setTab,
  setNetwork,
  network,
  isEditing,
  setIsEditing,
  isValid,
  fieldInfo,
  onSubmit,
  onCancel,
  onDelete,
  canResetRpcUrl,
  autoFocus,
  isCustom,
  pageType,
}: NetworkDetailsProps) => {
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
          readOnly={!isEditing}
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
          readOnly={!isEditing}
          pageType={pageType}
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

        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              disabled={!isValid}
              onClick={onSubmit}
            >
              {t('Save')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              onClick={() => {
                setIsEditing(false);
                onCancel();
              }}
            >
              {t('Cancel')}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              onClick={() => setIsEditing(true)}
            >
              {t('Edit')}
            </Button>
            {isCustom && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                onClick={onDelete}
              >
                {t('Delete')}
              </Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};
