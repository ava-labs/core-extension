import { useTranslation } from 'react-i18next';
import { Button, Stack } from '@avalabs/k2-alpine';

import { Network, NetworkFormErrors } from '@core/types';
import { NetworkAvatar } from '../BadgedAvatar/NetworkAvatar';
import { NetworkNameField } from './NetworkNameField';
import { useState } from 'react';
import { NetworkFormTab } from './types';
import { NetworkForm } from './NetworkForm';
import { PageTopBar } from '@/components/PageTopBar';

type AddNetworkProps = {
  setTab: (tab: NetworkFormTab) => void;
  setNetwork: (network: Network) => void;
  network: Network;
  isValid: boolean;
  errors: NetworkFormErrors;
  submit: () => void;
  cancel: () => void;
};

export const NetworkEditor = ({
  setTab,
  setNetwork,
  network,
  isValid,
  errors,
  submit,
  cancel,
}: AddNetworkProps) => {
  const { t } = useTranslation();
  const [isNaming, setIsNaming] = useState(false);

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
          autoFocus={false}
          error={errors.chainName}
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
          errors={errors}
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
