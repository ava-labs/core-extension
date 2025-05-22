import {
  Tooltip,
  Typography,
  Stack,
  Switch,
  InfoCircleIcon,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

interface GaslessProps {
  onSwitch: () => void;
  isTurnedOn: boolean;
  disabled: boolean;
}

export default function GaslessFee({
  onSwitch,
  isTurnedOn,
  disabled,
}: GaslessProps) {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        mb: isTurnedOn ? 0 : 2,
      }}
    >
      <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <Typography>{t('Get Free Gas')}</Typography>
        <Tooltip
          placement="bottom"
          title={t(
            'When enabled Core will pay the network fee associated with this transaction.',
          )}
        >
          <InfoCircleIcon sx={{ mx: 0.5, cursor: 'pointer' }} />
        </Tooltip>
      </Stack>
      <Switch
        onChange={onSwitch}
        checked={isTurnedOn}
        disabled={disabled}
        size="small"
      />
    </Stack>
  );
}
