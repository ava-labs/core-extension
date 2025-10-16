import { TFunction } from 'react-i18next';
import { DetailItemType, DetailSection } from '@avalabs/vm-module-types';

import { BtcNetwork } from '@core/types';

type MapFunction = (
  network: BtcNetwork,
  t: TFunction,
) => (section: DetailSection, index: number) => DetailSection;

// The funds recipients section for NextGen looks different than from the legacy one.
// To keep things backwards-compatible, we map the recipients items here instead of
// updating the Bitcoin Module.
// FIXME: This should be changed (in sync with Core Mobile) once we fully migrate
// to the new NextGen UI.
const mapRecipientsSection: MapFunction =
  (_, t) =>
  (section: DetailSection): DetailSection => {
    // Even if this `title` changes, all we're gonna miss are
    // the "Recipient" and "Amount" labels at the top of the section.
    if (section.title !== 'Recipients') {
      return section;
    }

    return {
      ...section,
      items: [
        {
          type: DetailItemType.TEXT,
          label: t('Recipient'),
          value: t('Amount'),
          alignment: 'horizontal',
        },
        ...section.items,
      ],
    };
  };

// FIXME: Turns out there is a discrepancy between EvmModule and BtcModule,
// where the former has a network detail item by default in the {displayData.details}
// field, while the latter does not.
const mapFirstSection: MapFunction =
  (network, t) =>
  (section: DetailSection, index: number): DetailSection => {
    if (index !== 0) return section;

    return {
      ...section,
      items: [
        {
          type: DetailItemType.NETWORK,
          label: t('Network'),
          value: {
            name: network.chainName,
            logoUri: network.logoUri,
          },
        },
        ...section.items,
      ],
    };
  };

const mapFunctions: MapFunction[] = [mapRecipientsSection, mapFirstSection];

export const mapBitcoinDetails =
  ({ network, t }: { network: BtcNetwork; t: TFunction }) =>
  (sections: DetailSection[]): DetailSection[] => {
    return mapFunctions.reduce(
      (acc, mapFunction) => acc.map(mapFunction(network, t)),
      sections,
    );
  };
