import {
  ChevronRightIcon,
  Stack,
  StackProps,
  styled,
  Typography,
} from '@avalabs/k2-alpine';

type SearchableSelectTriggerProps<T> = {
  ref: React.RefObject<HTMLDivElement | null>;
  label: string;
  value?: T;
  renderValue: (value?: T) => React.ReactNode;
  onClick: () => void;
};

export function SearchableSelectTrigger<T>({
  ref,
  label,
  value,
  renderValue,
  onClick,
}: SearchableSelectTriggerProps<T>) {
  return (
    <Container ref={ref} onClick={onClick}>
      <LabelAndValueWrapper>
        <Typography variant="subtitle3">{label}</Typography>
        {renderValue(value)}
      </LabelAndValueWrapper>
      <ChevronRightIcon size={16} />
    </Container>
  );
}

const Container = styled((props: StackProps) => (
  <Stack role="button" {...props} />
))(({ theme }) => ({
  flexDirection: 'row',
  paddingInline: theme.spacing(1.5),
  paddingBlock: theme.spacing(1),
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
