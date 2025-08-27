import { Stack, Typography } from '@avalabs/k2-alpine';
import { TextItem } from '@avalabs/vm-module-types';

import { TxDetailsRow } from './DetailRow';
import { NoScrollStack } from '../../../../Styled';

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
    <NoScrollStack mt={0}>
      <Typography variant="mono2" color="text.primary" component="pre">
        {item.value}
      </Typography>
    </NoScrollStack>
  </Stack>
);
