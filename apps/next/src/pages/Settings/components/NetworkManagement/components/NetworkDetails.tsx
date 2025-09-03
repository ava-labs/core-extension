import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';

import { Network } from '@core/types';

import { useEffect, useState } from 'react';

import { PageTopBar } from '@/components/PageTopBar';
import { MdInfoOutline } from 'react-icons/md';

import { NetworkAvatar } from './NetworkAvatar/NetworkAvatar';
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

  useEffect(() => {
    console.log({ fieldsWithErrors });
  }, [fieldsWithErrors]);

  const showMissingNetworkNameWarning =
    !network.chainName &&
    fieldsWithErrors.length == 1 &&
    fieldsWithErrors.includes('chainName');

  const hasMultipleButtons = isEditing || (isCustom && !isEditing);

  return (
    <Stack
      height="100cqh"
      width={1}
      bgcolor="background.backdrop"
      overflow="hidden"
      sx={{ position: 'relative' }}
    >
      <PageTopBar showBack={true} />

      {/* Header - Avatar and Name */}
      <Stack width="100%" alignItems="center" sx={{ px: 1.5, pb: 2 }}>
        <NetworkAvatar
          network={network}
          sx={{ width: '80px', height: '80px', mb: 2 }}
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
          marginTop: '36px',
          maxHeight: hasMultipleButtons ? '285px' : '350px',
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
        {/* This empty div lets the user to scroll enough to interact with the fields at the
        bottom of the form when editing */}
        <div style={{ height: hasMultipleButtons ? '24px' : '48px' }} />
      </div>

      {/* Gradient overlay behind buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: hasMultipleButtons ? '56px' : '10px', // To make the gradient start from the top of the buttons
          left: 0,
          right: 0,
          height:
            showMissingNetworkNameWarning && hasMultipleButtons
              ? '72px'
              : '48px', // To make the gradient end before the bottom of the top button ,${gradientColor}
          background: `linear-gradient(180deg,	rgba(0,0,0,0) 0%,${theme.palette.background.backdrop} 100%,${theme.palette.background.backdrop} 100%)`,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* Bottom Buttons */}
      <Stack
        width="100%"
        gap={1}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          pt: 0,
          px: 2.5,
          pb: 2,
          backgroundColor: 'transparent',
          background: 'none',
          zIndex: 10,
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
