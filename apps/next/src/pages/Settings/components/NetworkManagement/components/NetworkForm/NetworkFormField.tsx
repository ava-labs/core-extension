import { type FC, type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormField } from '@/components/Forms/FormField';
import {
  Dialog,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { UndoIcon } from './assets/undo';

type FlavouredFieldProps = Pick<
  ComponentProps<typeof FormField>,
  'value' | 'onChange' | 'allowCopy'
> & {
  error?: string;
  required?: boolean;
};

export const RpcUrlField: FC<
  FlavouredFieldProps & {
    canResetRpcUrl: boolean;
    resetAction: () => void;
  }
> = ({ value, onChange, error, required, canResetRpcUrl, resetAction }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [showResetDialog, setShowResetDialog] = useState(false);

  return (
    <>
      <FormField
        value={value}
        label={t('Network RPC URL')}
        placeholder={t('Type in or paste RPC URL')}
        prompt={t('Add RPC URL')}
        error={error}
        onChange={onChange}
        required={required}
        endAdornment={
          canResetRpcUrl ? (
            <IconButton onClick={resetAction}>
              <UndoIcon height="21px" color={theme.palette.text.primary} />
            </IconButton>
          ) : null
        }
      />

      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <Stack>
          <Typography variant="h6">{t('Reset RPC URL')}</Typography>
        </Stack>
      </Dialog>
    </>
  );
};

export const ChainIdField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Chain ID')}
      placeholder={t('Type in or paste chain ID')}
      prompt={t('Add chain ID')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const TokenSymbolField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token symbol')}
      placeholder={t('Type in or paste token symbol')}
      prompt={t('Add token symbol')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const TokenNameField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token name')}
      placeholder={t('Type in or paste token name')}
      prompt={t('Add token name')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};
export const ExplorerUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Explorer URL')}
      placeholder={t('Type in or paste explorer URL')}
      prompt={t('Add explorer URL')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};

export const LogoUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Logo URL')}
      placeholder={t('Type in or paste logo URL')}
      prompt={t('Add logo URL')}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
};
