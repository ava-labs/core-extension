import {
  Accordion,
  AccordionSummary,
  Stack,
  Typography,
  AccordionDetails,
} from '@avalabs/core-k2-components';
import { CollectibleMedia } from '@src/pages/Collectibles/components/CollectibleMedia';
import type { TransactionTokenCardVariant } from './TransactionTokenCard';
import { TransactionTokenCard } from './TransactionTokenCard';
import type {
  NetworkContractToken,
  NetworkToken,
  TokenDiffItem,
} from '@avalabs/vm-module-types';

interface NftAccordionProps {
  diffItems: TokenDiffItem[];
  token: NetworkContractToken | NetworkToken;
  variant: TransactionTokenCardVariant;
}

export const NftAccordion = ({
  token,
  diffItems,
  variant,
}: NftAccordionProps) => {
  if (!diffItems.length) {
    return null;
  }

  return (
    <Accordion sx={{ border: 'none', p: 0, m: 0, mt: -1 }}>
      <AccordionSummary sx={{ p: 0, m: 0 }}>
        <Stack
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            ml: -1,
          }}
        >
          <CollectibleMedia
            height="32px"
            width="auto"
            maxWidth="32px"
            url={token.logoUri}
            hover={false}
            showPlayIcon={false}
          />
          <Typography
            variant="h6"
            fontWeight="fontWeightSemibold"
            sx={{ ml: 2 }}
          >
            {token.name} {diffItems.length ? `(${diffItems.length})` : ''}
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ border: 'none', p: 0 }}>
        <Stack sx={{ gap: 1.5 }}>
          {diffItems.map((item, index) => (
            <TransactionTokenCard
              key={`token-group-${variant}-${
                'address' in token ? token.address : token.symbol
              }-${index}`}
              token={token}
              diffItem={item}
              variant={variant}
              sx={{ p: 0 }}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
