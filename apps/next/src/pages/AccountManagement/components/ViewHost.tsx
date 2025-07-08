import { Collapse, Stack } from '@avalabs/k2-alpine';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  in: boolean;
  keepMounted?: boolean;
};

export const ViewHost: FC<Props> = ({ children, in: visible, keepMounted }) => {
  return (
    <Collapse
      in={visible}
      unmountOnExit={!keepMounted}
      mountOnEnter={!keepMounted}
    >
      <Stack height="100cqh" gap={2}>
        {children}
      </Stack>
    </Collapse>
  );
};
