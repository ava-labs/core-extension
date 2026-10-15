import { Box, Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { useOutdatedLedgerAvalancheAppVersions } from '@core/ui';
import { FC } from 'react';
import { Trans } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

type Props = StackProps & {
  showIcon?: boolean;
};

export const LedgerAppOutdatedHint: FC<Props> = ({
  showIcon = true,
  ...props
}) => {
  const outdatedVersions = useOutdatedLedgerAvalancheAppVersions();

  if (!outdatedVersions) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      color="warning.main"
      data-testid="ledger-app-outdated-hint"
      {...props}
    >
      {showIcon && (
        <Box flexShrink={0} display="flex">
          <FiAlertCircle size={20} />
        </Box>
      )}
      <Typography variant="caption">
        <Trans
          i18nKey="For improved user experience, update your Avalanche app on Ledger (<red>{{currentVersion}}</red> → <green>{{recommendedVersion}}</green>)."
          values={outdatedVersions}
          components={{
            red: <Box component="span" color="error.main" />,
            green: <Box component="span" color="success.main" />,
          }}
        />
      </Typography>
    </Stack>
  );
};
