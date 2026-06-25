import { DetailSection } from '@avalabs/vm-module-types';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { NetworkWithCaipId } from '@core/types';

import { DetailsSection } from '../../generic/DetailsSection';
import { DetailsItem } from '../../generic/DetailsItem';

type TypedDataDetailsProps = {
  section: DetailSection;
  network: NetworkWithCaipId;
};

/**
 * Renders a focused, human-readable summary of a recognized EIP-712 request
 * (Permit / Permit2 / Seaport). Each field is rendered through the shared
 * detail-item renderer so addresses, dates and amounts line up with the rest
 * of the approval screen.
 */
export const TypedDataDetails = ({
  section,
  network,
}: TypedDataDetailsProps) => (
  <Stack gap={0.5}>
    {section.title && (
      <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
        {section.title}
      </Typography>
    )}
    <DetailsSection>
      {section.items.map((item, index) => (
        <DetailsItem key={index} item={item} network={network} />
      ))}
    </DetailsSection>
  </Stack>
);
