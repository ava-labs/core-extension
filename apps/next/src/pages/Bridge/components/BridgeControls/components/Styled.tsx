import { Select as NextSelect } from '@/components/Select';
import { selectClasses, styled } from '@avalabs/k2-alpine';

export const Select = styled(NextSelect)({
  [`&.${selectClasses.root}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${selectClasses.select}`]: {
    width: 'auto',
    marginInlineStart: 'auto',
  },
});
