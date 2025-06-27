import { styled } from '@avalabs/k2-alpine';
import { BorderlessTextField } from '@/components/BorderlessTextField';

export const ShakyTextField = styled(BorderlessTextField, {
  shouldForwardProp: (prop) => prop !== 'shake',
})<{ shake?: boolean }>`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0);
    }
  }
  @media (prefers-reduced-motion: no-preference) {
    animation: ${({ shake }) => (shake ? 'shake 0.3s ease-in-out' : 'none')};
  }
`;
