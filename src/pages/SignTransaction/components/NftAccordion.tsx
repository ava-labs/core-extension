import {
  Accordion,
  AccordionSummary,
  Stack,
  Typography,
  AccordionDetails,
} from '@avalabs/core-k2-components';
import { TransactionNft } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { CollectibleMedia } from '@src/pages/Collectibles/components/CollectibleMedia';
import {
  TransactionTokenCard,
  TransactionTokenCardVariant,
} from './TransactionTokenCard';

interface NftAccordionProps {
  nftList: TransactionNft[] | undefined;
}

export const NftAccordion = ({ nftList }: NftAccordionProps) => {
  if (!nftList) {
    return null;
  }

  const firstNft = nftList[0];
  return (
    <Accordion sx={{ border: 'none', p: 0, m: 0 }}>
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
            url={firstNft?.logoUri}
            hover={false}
            showPlayIcon={false}
          />
          <Typography
            variant="h6"
            fontWeight="fontWeightSemibold"
            sx={{ ml: 2 }}
          >
            {firstNft?.name} {firstNft?.size && `(${firstNft?.size})`}
          </Typography>
        </Stack>
      </AccordionSummary>

      {nftList.map((nft, index) => {
        return (
          <AccordionDetails
            key={`r-nft-${nft.address}-${index}`}
            sx={{ border: 'none', p: 0 }}
          >
            <TransactionTokenCard
              token={nft}
              variant={TransactionTokenCardVariant.RECEIVE}
              sx={{ p: 0 }}
            >
              <CollectibleMedia
                height="32px"
                width="auto"
                maxWidth="32px"
                url={nft?.logoUri}
                hover={false}
                margin="8px 0"
                showPlayIcon={false}
              />
            </TransactionTokenCard>
          </AccordionDetails>
        );
      })}
    </Accordion>
  );
};
