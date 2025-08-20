import {
  Checkbox,
  Typography,
  Paper,
  Stack,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { Trans } from 'react-i18next';

type TermsAgreementSectionProps = {
  isTermsAccepted: boolean;
  onChange: (newValue: boolean) => void;
};

export const TermsAgreementSection: FC<TermsAgreementSectionProps> = ({
  isTermsAccepted,
  onChange,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: theme.shape.mediumBorderRadius,
        p: 1.75,
      }}
    >
      <Stack direction="row" columnGap={1}>
        <Checkbox
          checked={isTermsAccepted}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
        <Typography variant="body2" minHeight={24}>
          <Trans i18nKey="I understand losing this phrase will result in lost funds.<br/>I have stored it in a secure place." />
        </Typography>
      </Stack>
    </Paper>
  );
};
