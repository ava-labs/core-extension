import {
  Button,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { TFunction, useTranslation } from 'react-i18next';
import { NetworkVMType } from '@avalabs/vm-module-types';

import { SecretType, WalletDetails } from '@core/types';
import { useWalletContext } from '@core/ui';
import { isChainSupportedByWallet, openFullscreenTab } from '@core/common';

import { MagicSolanaLogo } from '@/components/common/MagicSolanaLogo';

type SetupMayBeRequiredProps = {
  requestedVM: NetworkVMType;
  cancelHandler: () => void;
};

export const SetupMayBeRequired = ({
  cancelHandler,
  requestedVM,
}: SetupMayBeRequiredProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { walletDetails } = useWalletContext();

  const { title, description, primaryButtonProps, secondaryButtonProps } =
    getContents({ t, vm: requestedVM, walletDetails, cancelHandler });
  return (
    <Stack
      textAlign="center"
      width="100%"
      height="100%"
      gap={2}
      px={4}
      pt={6}
      pb={3}
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack flexGrow={1} justifyContent="space-between">
        <Stack gap={3}>
          <Typography variant="h4">{title}</Typography>
          <Stack gap={1.5}>
            <Typography
              variant="body2"
              align="left"
              color={theme.palette.grey[500]}
              lineHeight="20px"
            >
              {description}
            </Typography>
          </Stack>
        </Stack>
        <MagicSolanaLogo outerSize={320} innerSize={187} />
      </Stack>
      {primaryButtonProps && (
        <Button size="large" fullWidth color="primary" {...primaryButtonProps}>
          {primaryButtonProps.text}
        </Button>
      )}
      {secondaryButtonProps && (
        <Button variant="text" size="small" {...secondaryButtonProps}>
          {secondaryButtonProps.text}
        </Button>
      )}
    </Stack>
  );
};

type GetContentsArgs = {
  t: TFunction;
  cancelHandler: () => void;
  vm: NetworkVMType;
  walletDetails?: WalletDetails;
};

const getContents = ({
  t,
  cancelHandler,
  vm,
  walletDetails,
}: GetContentsArgs) => {
  const isNetworkSupported = isChainSupportedByWallet(vm, walletDetails?.type);

  // Solana is supported -- we need to set up the Solana account
  if (isNetworkSupported && vm === NetworkVMType.SVM) {
    // For Ledger wallets, an action is required.
    // For Seedless, we may need to wait a few seconds for the addresses to be derived on rare occasions.
    const isLedgerWallet =
      walletDetails?.type === SecretType.Ledger ||
      walletDetails?.type === SecretType.LedgerLive;

    return {
      title: isLedgerWallet ? t('Set Up Required') : t('Please wait...'),
      description: isLedgerWallet
        ? t('You must first add a Solana account to use the Solana network.')
        : t(
            'We are preparing your Solana accounts. This may take a few seconds.',
          ),
      primaryButtonProps: isLedgerWallet
        ? {
            text: t('Get Started'),
            onClick: () => {
              openFullscreenTab('ledger/derive-solana-addresses');
              cancelHandler();
            },
          }
        : undefined,
      secondaryButtonProps: {
        text: t('Close'),
        onClick: cancelHandler,
      },
    };
  }

  // User tries to connect to Solana, but it's not supported by the current wallet.
  if (!isNetworkSupported && vm === NetworkVMType.SVM) {
    return {
      title: t('Solana Not Supported'),
      description: t('This device does not support the Solana network.'),
      primaryButtonProps: {
        text: t('Close'),
        onClick: cancelHandler,
      },
    };
  }

  // The network VM (other than Solana) is not supported at all by the current wallet.
  if (!isNetworkSupported) {
    return {
      title: t('Network Not Supported'),
      description: t('This device does not support the selected network.'),
      primaryButtonProps: {
        text: t('Close'),
        onClick: cancelHandler,
      },
    };
  }

  // If a network VM (other than Solana) is supported, but we somehow still ended up here,
  // we likely forgot to handle its connection screens somewhere higher up in the component tree.
  // If that happens, this simply prevents us from showing a blank screen to the user.
  return {
    title: t('Something went wrong'),
    description: t('Please contact the support team.'),
    primaryButtonProps: {
      text: t('Close'),
      onClick: cancelHandler,
    },
  };
};
