import { Select as NextSelect } from '@/components/Select';
import {
  Divider as K2Divider,
  selectClasses,
  styled,
} from '@avalabs/k2-alpine';

export const Select = styled(NextSelect)({
  [`&.${selectClasses.root}`]: {
    backgroundColor: 'transparent',
  },
  [`& .${selectClasses.select}`]: {
    width: 'auto',
    marginInlineStart: 'auto',
  },
});

export const Divider = styled(K2Divider)(({ theme }) => ({
  marginInline: theme.spacing(1.5),
}));
