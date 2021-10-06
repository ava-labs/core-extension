import {
  Card,
  HorizontalFlex,
  HorizontalSeparator,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import React from 'react';
import { format } from 'date-fns';
import { truncateAddress } from '@src/utils/truncateAddress';

export function WalletHomeRecentTxs() {
  const { walletHistory } = useWalletContext();

  return (
    <Card>
      <VerticalFlex width={'100%'}>
        <Typography>Recent Transactions</Typography>
        <br />
        <br />
        <VerticalFlex width={'100%'} overflow={'auto'} maxHeight={'350px'}>
          {walletHistory?.items?.map((item) => {
            return (
              <VerticalFlex key={item.id} width={'100%'}>
                <HorizontalFlex width={'100%'} justify={'space-between'}>
                  <Typography>
                    {(item as any).isSender ? 'Sent' : 'Recieved'}
                  </Typography>
                  <Typography>
                    {format(new Date(item.timestamp), 'MMMM do, yyyy H:mma')}
                  </Typography>
                </HorizontalFlex>

                {(item as any)?.from ? (
                  <HorizontalFlex
                    width={'100%'}
                    justify={'space-between'}
                    margin={'8px 0'}
                  >
                    <Typography>from</Typography>
                    <Typography>
                      {truncateAddress((item as any)?.from)}
                    </Typography>
                  </HorizontalFlex>
                ) : (
                  ''
                )}

                {(item as any)?.to ? (
                  <HorizontalFlex width={'100%'} justify={'space-between'}>
                    <Typography>to</Typography>
                    <Typography>
                      {truncateAddress((item as any)?.to)}
                    </Typography>
                  </HorizontalFlex>
                ) : (
                  ''
                )}

                <HorizontalFlex
                  width={'100%'}
                  justify={'space-between'}
                  margin={'8px 0'}
                >
                  <Typography>amount</Typography>
                  <Typography>{(item as any)?.amountClean}</Typography>
                </HorizontalFlex>

                <HorizontalSeparator margin={'8px 0'} />
              </VerticalFlex>
            );
          })}
        </VerticalFlex>
      </VerticalFlex>
    </Card>
  );
}
