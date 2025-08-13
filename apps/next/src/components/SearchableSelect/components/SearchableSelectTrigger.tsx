import {
  Box,
  ChevronRightIcon,
  Stack,
  StackProps,
  styled,
  Typography,
} from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { SearchableSelectTriggerProps } from '../types';

export function SearchableSelectTrigger<T>({
  ref,
  label,
  value,
  renderValue,
  onClick,
}: SearchableSelectTriggerProps<T>) {
  return (
    <Card>
      <Container ref={ref} onClick={onClick}>
        <LabelAndValueWrapper>
          <Typography variant="subtitle3">{label}</Typography>
          {renderValue(value)}
        </LabelAndValueWrapper>
        <Box flexShrink={0}>
          <ChevronRightIcon size={16} />
        </Box>
      </Container>
    </Card>
  );
}

const Container = styled((props: StackProps) => (
  <Stack role="button" {...props} />
))(({ theme }) => ({
  flexDirection: 'row',
  paddingInline: theme.spacing(1.5),
  paddingBlock: theme.spacing(0.5),
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
}));

const LabelAndValueWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
