import { BorderlessTextField } from '@/components/BorderlessTextField';
import animations from '@/lib/animations';
import { styled } from '@avalabs/k2-alpine';

export const ShakyTextField = styled(BorderlessTextField, {
  shouldForwardProp: (prop) => prop !== 'shake',
})<{ shake?: boolean }>`
  ${({ shake }) => (shake ? animations.shake : '')};
`;
