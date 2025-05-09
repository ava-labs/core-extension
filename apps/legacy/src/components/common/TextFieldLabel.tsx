import {
  InfoCircleIcon,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

interface TextFieldLabelProps {
  label: string;
  tooltip?: string;
}

export const TextFieldLabel = ({ label, tooltip }: TextFieldLabelProps) => (
  <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
      {label}
    </Typography>
    {tooltip && (
      <Tooltip title={tooltip}>
        <InfoCircleIcon size={16} />
      </Tooltip>
    )}
  </Stack>
);
