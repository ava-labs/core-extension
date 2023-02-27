import { AVAX_TOKEN } from '@avalabs/chains-sdk';
import { Stack, Typography, useTheme } from '@avalabs/k2-components';
import { AvaxTokenIcon } from '@avalabs/react-components';
import { isNFT } from '@src/background/services/balances/nft/utils/isNFT';
import { TransactionType } from '@src/background/services/history/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useTranslation } from 'react-i18next';
import { ActivityCardProp } from './ActivityCard';

export function ActivityCardDetails({ historyItem }: ActivityCardProp) {
  const theme = useTheme();
  const { t } = useTranslation();

  if (historyItem.type === TransactionType.SWAP) {
    return (
      <Stack sx={{ mt: 1, rowGap: 1 }}>
        {historyItem.tokens.map((token, i) => {
          return (
            <Stack
              key={i}
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                rowGap: 1,
              }}
            >
              <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
                {token.symbol === AVAX_TOKEN.symbol ? (
                  <AvaxTokenIcon height={theme.spacing(2)} />
                ) : (
                  <TokenIcon
                    width={theme.spacing(2)}
                    height={theme.spacing(2)}
                    src={token.imageUri}
                    name={token.name}
                  />
                )}
                <Typography variant="body3">{token.symbol}</Typography>
              </Stack>
              <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
                <Typography variant="body3"> {token.amount}</Typography>
                <Typography variant="body3">{token.symbol}</Typography>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    );
  } else if (
    (historyItem.type === TransactionType.TRANSFER &&
      historyItem.tokens[0]?.type &&
      isNFT(historyItem.tokens[0].type)) ||
    historyItem.type === TransactionType.NFT_BUY
  ) {
    return (
      <Stack
        sx={{ flexDirection: 'row', mt: 1, justifyContent: 'space-between' }}
      >
        <Typography>{t('Collection')}</Typography>
        <Typography>{historyItem.tokens?.[0]?.name}</Typography>
      </Stack>
    );
  } else {
    return <></>;
  }
}
