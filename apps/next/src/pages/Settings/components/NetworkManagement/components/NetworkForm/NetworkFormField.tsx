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
  readOnly?: boolean;
};

export const RpcUrlField: FC<
  FlavouredFieldProps & {
    canResetRpcUrl: boolean;
    resetAction: () => void;
  }
> = ({
  value,
  onChange,
  error,
  required,
  canResetRpcUrl,
  resetAction,
  readOnly,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [showResetDialog, setShowResetDialog] = useState(false);

  return (
    <>
      <FormField
        value={value}
        label={t('Network RPC URL')}
        placeholder={t('Enter RPC URL')}
        prompt={t('Add RPC URL')}
        error={error}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
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
  readOnly,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      type="number"
      value={value}
      label={t('Chain ID')}
      placeholder={t('Enter chain ID')}
      prompt={t('Add chain ID')}
      error={error}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  );
};

export const TokenSymbolField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
  readOnly,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token symbol')}
      placeholder={t('Enter token symbol')}
      prompt={t('Add token symbol')}
      error={error}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  );
};

export const TokenNameField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
  readOnly,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Token name')}
      placeholder={t('Enter token name')}
      prompt={t('Add token name')}
      error={error}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  );
};
export const ExplorerUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
  readOnly,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Explorer URL')}
      placeholder={t('Enter explorer URL')}
      prompt={t('Add explorer URL')}
      error={error}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  );
};

export const LogoUrlField: FC<FlavouredFieldProps> = ({
  value,
  onChange,
  error,
  required,
  readOnly,
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      value={value}
      label={t('Logo URL')}
      placeholder={t('Enter logo URL')}
      prompt={t('Add logo URL')}
      error={error}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  );
};
