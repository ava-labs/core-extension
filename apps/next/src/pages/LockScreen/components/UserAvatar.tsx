import { PersonalAvatar } from '@/components/PersonalAvatar';
import { Skeleton, Stack, StackProps, styled } from '@avalabs/k2-alpine';
import { FC, Suspense } from 'react';

type Props = Omit<StackProps, 'alignItems'> & OwnProps;

type OwnProps = {
  faded?: boolean;
  suppressMargin?: boolean;
};

type NoForwardProp = keyof OwnProps;
const noForwardProps = ['faded', 'suppressMargin'] satisfies NoForwardProp[];

const Root = styled(Stack, {
  shouldForwardProp: (prop) => !noForwardProps.includes(prop as NoForwardProp),
})<Props>(({ theme, faded, suppressMargin }) => ({
  alignItems: 'center',
  opacity: faded ? 0.3 : 1,
  marginBlockEnd: suppressMargin ? 0 : '20cqh',
  transition: theme.transitions.create(['opacity', 'margin-block-end']),
}));

export const UserAvatar: FC<Props> = (props) => {
  return (
    <Root {...props} alignItems="center">
      <Suspense
        fallback={
          <Skeleton
            variant="circular"
            animation="wave"
            width={80}
            height={80}
          />
        }
      >
        <PersonalAvatar cached size="medium" />
      </Suspense>
    </Root>
  );
};
