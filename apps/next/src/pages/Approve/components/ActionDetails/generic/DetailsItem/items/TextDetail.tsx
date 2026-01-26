import { Stack, Typography } from '@avalabs/k2-alpine';
import { TextItem } from '@avalabs/vm-module-types';

import { NoScrollStack } from '@/components/NoScrollStack';

import { TxDetailsRow } from './DetailRow';

type TextItemProps = {
  item: TextItem;
};

export const TextDetail = ({ item }: TextItemProps) =>
  item.alignment === 'horizontal' ? (
    <TextDetailHorizontal item={item} />
  ) : (
    <TextDetailVertical item={item} />
  );

const TextDetailHorizontal = ({ item }: TextItemProps) => (
  <TxDetailsRow label={item.label} direction="row" alignItems="center">
    <Typography variant="body3" color="text.secondary">
      {item.value}
    </Typography>
  </TxDetailsRow>
);

const TextDetailVertical = ({ item }: TextItemProps) => (
  <Stack direction="column" gap={0.5} px={2} overflow="auto">
    <Typography variant="body3" color="text.secondary">
      {item.label}
    </Typography>
    <NoScrollStack stackProps={{ mt: 0 }} autoHeight>
      <Typography
        variant="mono2"
        color="text.primary"
        sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        {item.value}
      </Typography>
    </NoScrollStack>
  </Stack>
);
