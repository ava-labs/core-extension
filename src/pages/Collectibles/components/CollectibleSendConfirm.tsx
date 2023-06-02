import type { Contact } from '@avalabs/types';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useHistory } from 'react-router-dom';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { CollectibleMedia } from './CollectibleMedia';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { SendState } from '@src/background/services/send/models';
import { NftTokenWithBalance } from '@src/background/services/balances/models';
import { useTranslation } from 'react-i18next';
import {
  styled,
  Card,
  Stack,
  Typography,
  Divider,
  Button,
  Tooltip,
} from '@avalabs/k2-components';
import { TokenEllipsis } from '@src/components/common/TokenEllipsis';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

const StyledCollectibleMedia = styled(CollectibleMedia)`
  position: absolute;
  top: -36px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: fit-content;
  border: 8px solid ${({ theme }) => theme.palette.common.black};
  border-radius: 8px;
`;

type CollectibleSendConfirmProps = {
  sendState: SendState<NftTokenWithBalance>;
  contact: Contact;
  nft: NftTokenWithBalance;
  onSubmit(): void;
};

export const CollectibleSendConfirm = ({
  sendState,
  contact,
  nft,
  onSubmit,
}: CollectibleSendConfirmProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { capture } = useAnalyticsContext();

  useLedgerDisconnectedDialog(history.goBack);

  if (!activeAccount) {
    history.push('/home');
    return null;
  }

  return (
    <>
      <Stack sx={{ width: '100%', height: '100%' }}>
        <PageTitle variant={PageTitleVariant.PRIMARY}>
          {t('Confirm Transaction')}
        </PageTitle>
        <Stack
          sx={{
            flexGrow: 1,
            alignItems: 'center',
            width: '100%',
            px: 2,
            pb: 3,
          }}
        >
          <Card
            sx={{
              position: 'relative',
              mt: 5,
              pt: 5,
              px: 2,
              pb: 2,
              width: '100%',
              overflow: 'visible',
            }}
          >
            <StyledCollectibleMedia
              width="auto"
              height="56px"
              url={nft?.logoSmall || nft?.logoUri}
            />
            <Stack sx={{ alignItems: 'center', width: '100%' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('Collectible')}
              </Typography>
              <Typography
                size={18}
                height="22px"
                weight={700}
                margin="4px 0"
              >{`#${nft.tokenId}`}</Typography>
              <Typography variant="body1">{nft?.name}</Typography>
              <Stack
                sx={{
                  flexDirection: 'row',
                  mt: 2,
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('From')}
                </Typography>
                <Stack sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">
                    <TokenEllipsis text={activeAccount.name} maxLength={34} />
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    <TokenEllipsis
                      text={activeAccount.addressC || ''}
                      maxLength={14}
                    />
                  </Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1, width: '100%' }} />
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('To')}
                </Typography>
                <Stack sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">
                    <TokenEllipsis text={contact?.name} maxLength={34} />
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    <TokenEllipsis
                      text={contact?.address || ''}
                      maxLength={14}
                    />
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Card>

          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              flexGrow: 1,
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Button
                color="secondary"
                data-testid="send-cancel-button"
                fullWidth
                onClick={() => {
                  capture('NFTSendCancel');
                  history.goBack();
                }}
                size="large"
              >
                {t('Cancel')}
              </Button>
              <Tooltip
                sx={{ width: '100%' }}
                title={sendState?.error?.error ? sendState?.error?.message : ''}
              >
                <Button
                  color="primary"
                  data-testid="send-now-button"
                  fullWidth
                  onClick={onSubmit}
                  disabled={!sendState?.canSubmit}
                  size="large"
                >
                  {t('Send Now')}
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
