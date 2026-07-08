import { Stack } from '@avalabs/k2-alpine';
import { NetworkWithCaipId } from '@core/types';
import { FC, ReactElement, useState } from 'react';
import { useUrlState } from '../../hooks/useUrlState';
import { GeneralTokenDetails } from '../GeneralTokenDetails';
import { TabName, XPChainsTabs } from './Tabs';

type Props = {
  networkId: number;
  network: NetworkWithCaipId;
  Assets: ReactElement;
};

export const XPChainDetails: FC<Props> = ({ networkId, network, Assets }) => {
  const urlState = useUrlState();
  const initialTab = urlState.xpChainTab ?? 'assets';
  const [activeTab, setActiveTab] = useState<TabName>(initialTab);

  const activeTabOnSelect = (newTab: TabName) => {
    urlState.update(urlState.filter, networkId, 'AVAX', newTab);
    setActiveTab(newTab);
  };

  return (
    <>
      <Stack flex="1 1 auto">
        <Stack gap={1} display={activeTab === 'assets' ? 'flex' : 'none'}>
          {Assets}
        </Stack>
        <Stack
          gap={1}
          display={activeTab === 'activity' ? 'flex' : 'none'}
          flexGrow={1}
          flexShrink={1}
          flexBasis="auto"
        >
          <GeneralTokenDetails
            networkId={networkId}
            tokenAddress={'AVAX'}
            network={network}
          />
        </Stack>
      </Stack>
      <XPChainsTabs activeTab={activeTab} setActiveTab={activeTabOnSelect} />
    </>
  );
};
