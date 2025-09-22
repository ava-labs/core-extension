import { useTranslation } from 'react-i18next';
import {
  Button,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { Network } from '@core/types';
import { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { NetworkAvatar } from './NetworkAvatar/NetworkAvatar';
import { NetworkNameField } from './NetworkForm/NetworkNameField';
import { NetworkForm } from './NetworkForm/NetworkForm';
import {
  EditNetworkFormView,
  NetworkFormFieldInfo,
  NetworkFormFields,
} from './NetworkForm/types';
import { Page } from '@/components/Page';

type NetworkDetailsProps = {
  setView: (view: EditNetworkFormView) => void;
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
  setView,
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
    <Page
      contentProps={{
        px: 0,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
      containerProps={{ pb: 0 }}
    >
      {/* Header - Avatar and Name */}
      <Stack width="100%" alignItems="center" sx={{ pb: 4.5 }}>
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

      <NetworkForm
        network={network}
        setNetwork={setNetwork}
        setView={setView}
        fieldInfo={fieldInfo}
        canResetRpcUrl={canResetRpcUrl}
        readOnly={!isEditing}
        pageType={pageType}
      />

      {/* Bottom Buttons */}
      <Stack
        width="100%" // Compensate for container padding which we don't want applied here.
        gap={1}
        position="sticky"
        bottom={0}
        pt={3}
        pb={2}
        sx={{
          background: `linear-gradient(180deg, ${getHexAlpha(theme.palette.alphaMatch.backdropSolid, 0)} 0%, ${theme.palette.alphaMatch.backdropSolid} 32.5%)`,
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
    </Page>
  );
};
