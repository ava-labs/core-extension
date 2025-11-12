import { FC, Fragment } from 'react';
import { Box, List } from '@avalabs/k2-alpine';

import { DefiProtocol } from '@core/types';

import { DeFiProtocolListItem } from './DeFiProtocolListItem';

type DeFiProtocolListProps = {
  protocols: DefiProtocol[];
};

export const DeFiProtocolList: FC<DeFiProtocolListProps> = ({ protocols }) => {
  return (
    <Box mt={1.5}>
      <List disablePadding>
        {protocols.map((protocol) => {
          const key = `defi-protocol-${protocol.id}`;
          return (
            <Fragment key={key}>
              <DeFiProtocolListItem protocol={protocol} />
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
};
