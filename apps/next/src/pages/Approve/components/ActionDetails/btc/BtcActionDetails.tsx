import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { BtcNetwork } from '@core/types';

import { ActionDetailsProps } from '../../../types';
import { DetailsItem } from '../generic/DetailsItem';
import { DetailsSection } from '../generic/DetailsSection';

import { BtcNetworkFeeWidget } from './components';
import { mapBitcoinDetails } from './lib';

type BtcActionDetailsProps = Omit<ActionDetailsProps, 'network'> & {
  network: BtcNetwork;
};

export const BtcActionDetails = ({
  action,
  network,
}: BtcActionDetailsProps) => {
  const { t } = useTranslation();

  const details = mapBitcoinDetails({ network, t })(action.displayData.details);

  return (
    <Stack gap={1}>
      {details.map((section) => (
        <DetailsSection key={section.title}>
          {section.items.map((item, itemIndex) => (
            <DetailsItem key={itemIndex} item={item} network={network} />
          ))}
        </DetailsSection>
      ))}
      {action.displayData.networkFeeSelector && (
        <BtcNetworkFeeWidget action={action} network={network} />
      )}
    </Stack>
  );
};
