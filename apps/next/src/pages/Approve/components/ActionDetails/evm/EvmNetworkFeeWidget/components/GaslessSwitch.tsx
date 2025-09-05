import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import {
  Stack,
  Switch,
  SwitchProps,
  Tooltip,
  Typography,
} from '@avalabs/k2-alpine';

type GaslessSwitchRowProps = Pick<
  SwitchProps,
  'checked' | 'onChange' | 'disabled'
> & {
  tooltip: string;
};

export const GaslessSwitchRow: FC<GaslessSwitchRowProps> = ({
  checked,
  onChange,
  disabled,
  tooltip,
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      px={2}
    >
      <Stack>
        <Typography variant="body3" color="text.primary">
          {t('Get free gas')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('Gas fees paid by Core')}
        </Typography>
      </Stack>
      <Tooltip title={tooltip}>
        {/* Gotta wrap in div because the "disabled" prop is preventing a tooltip from popping up*/}
        <div>
          <Switch
            size="small"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      </Tooltip>
    </Stack>
  );
};
