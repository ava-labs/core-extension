import {
  Box,
  Button,
  ButtonProps,
  ChevronDownIcon,
  MenuItem,
  OutboundIcon,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Trans, useTranslation } from 'react-i18next';
import { DerivationPath } from '@avalabs/core-wallets-sdk';

import { InTextLink } from '@/components/InTextLink';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { Section, SectionRow } from '@/pages/Onboarding/components/Section';

import { ErrorType } from './LedgerConnector/types';

type DerivationPathSelectorProps = {
  derivationPathSpec: DerivationPath;
  onSelect: (derivationPathSpec: DerivationPath) => void;
};
export const DerivationPathSelector = ({
  onSelect,
  derivationPathSpec,
}: DerivationPathSelectorProps) => (
  <Section width="100%">
    <Select
      size="medium"
      variant="outlined"
      label=""
      IconComponent={() => <ChevronDownIcon size={20} />}
      value={derivationPathSpec}
      onChange={(e) => {
        onSelect(e.target.value as DerivationPath);
      }}
      sx={{ py: 0.75 }}
    >
      <MenuItem value={DerivationPath.BIP44}>BIP 44 (Default)</MenuItem>
      <MenuItem value={DerivationPath.LedgerLive}>Ledger Live</MenuItem>
    </Select>
  </Section>
);

type LedgerConnectionErrorProps = {
  errorType: ErrorType;
  onTroubleshoot: () => void;
  onRetry: () => void;
};

export const LedgerConnectionError = ({
  errorType,
  onRetry,
  onTroubleshoot,
}: LedgerConnectionErrorProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      width="100%"
      gap={3}
      textAlign="center"
      flexGrow={1}
      justifyContent="center"
      maxWidth="340px"
    >
      <Stack gap={1.5} alignItems="center" color="error.main">
        <FiAlertCircle size={32} color="currentColor" />
        {errorType === 'unable-to-connect' && (
          <UnableToConnectMessage onTroubleshoot={onTroubleshoot} />
        )}
        {errorType === 'unsupported-version' && <UnsupportedVersionMessage />}
      </Stack>
      <Stack direction="row" justifyContent="center">
        <NavButton size="medium" color="primary" onClick={onRetry}>
          {t('Retry')}
        </NavButton>
      </Stack>
    </Stack>
  );
};

const UnsupportedVersionMessage = () => {
  const { t } = useTranslation();

  return (
    <Typography variant="body2">
      {t(
        'Please update the Avalanche Application on your Ledger device to continue.',
      )}
    </Typography>
  );
};
const UnableToConnectMessage = ({
  onTroubleshoot,
}: {
  onTroubleshoot: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Stack gap={0.5} color="error.main">
      <Typography variant="body2">{t('Unable to connect.')}</Typography>
      <Typography variant="body2">
        <Trans
          i18nKey="View the troubleshooting guide <troubleshootButton>here</troubleshootButton>"
          components={{
            troubleshootButton: <InTextLink onClick={onTroubleshoot} />,
          }}
        />
      </Typography>
    </Stack>
  );
};

export const DerivationPathSelectorSkeleton = () => (
  <Skeleton variant="rounded" width="100%" height={44} />
);
export const ObtainedAddressesSkeleton = ({ count }: { count: number }) => {
  return (
    <Section>
      {Array.from({ length: count }).map((_, index) => (
        <SectionRow
          key={index}
          sx={{
            gap: 'unset',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.25,
          }}
        >
          <Stack direction="row" gap={1.5} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {index + 1}
            </Typography>
            <Skeleton variant="text" width="150px" animation="wave" />
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center">
            <Skeleton variant="text" width="100px" animation="wave" />
            <Box width={32}>
              <Skeleton variant="circular" width="24px" height="24px" />
            </Box>
          </Stack>
        </SectionRow>
      ))}
    </Section>
  );
};

export const LedgerLiveButton: FC<ButtonProps> = (props) => (
  <Button
    size="medium"
    variant="text"
    endIcon={<OutboundIcon size={24} />}
    component="a"
    href="https://www.ledger.com/ledger-live"
    target="_blank"
    rel="noreferrer"
    {...props}
  />
);
