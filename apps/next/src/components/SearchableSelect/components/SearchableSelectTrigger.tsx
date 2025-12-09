import {
  Box,
  Stack,
  StackProps,
  styled,
  Typography,
  ArrowRightIcon,
  useTheme,
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
  const theme = useTheme();
  return (
    <Card>
      <Container ref={ref} onClick={onClick}>
        <LabelAndValueWrapper>
          <Typography variant="subtitle3">{label}</Typography>
          {renderValue(value)}
        </LabelAndValueWrapper>
        <Box display="flex" flexShrink={0} lineHeight={1}>
          <ArrowRightIcon size={20} color={theme.palette.text.secondary} />
        </Box>
      </Container>
    </Card>
  );
}

const Container = styled((props: StackProps) => (
  <Stack role="button" {...props} />
))(({ onClick, theme }) => ({
  flexDirection: 'row',
  paddingInline: theme.spacing(1.5),
  paddingBlock: theme.spacing(0.5),
  alignItems: 'center',
  gap: theme.spacing(0.5),
  cursor: onClick ? 'pointer' : 'default',
}));

const LabelAndValueWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
