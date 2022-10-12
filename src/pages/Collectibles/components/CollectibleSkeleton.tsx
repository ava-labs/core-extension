import { Skeleton } from '@avalabs/react-components';
import styled from 'styled-components';
import { CollectibleWrapper } from './CollectibleWrapper';

const StyledSkeleton = styled(Skeleton)`
  width: 164px;
  height: 164px;
  margin: 0 0 16px;
`;

export function CollectibleSkeleton() {
  return (
    <CollectibleWrapper>
      {Array.from({ length: 4 }, (_: unknown, i: number) => (
        <StyledSkeleton key={i} />
      ))}{' '}
    </CollectibleWrapper>
  );
}
