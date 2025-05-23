import { Stack, StackProps, styled } from '@avalabs/k2-alpine';
import { FC } from 'react';

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
      {/* TODO: Replace with the actual user avatar once we have one */}
      <img src="/images/__REMOVE_ME_bear.svg" width={88} height={88} />
    </Root>
  );
};
