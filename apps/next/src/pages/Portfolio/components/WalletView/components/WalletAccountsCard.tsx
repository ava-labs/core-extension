import { Card } from '@/components/Card';
import { PersonalAvatarName } from '@/components/PersonalAvatar';
import { Typography } from '@avalabs/k2-alpine';
import { Account, NetworkWithCaipId } from '@core/types';
import { WalletAccount } from './WalletAccount';
import { useTranslation } from 'react-i18next';

type Props = {
  accountCount: number;
  networkCount: number;
  accountsInWallet: Account[];
  accountAvatars: Map<string, PersonalAvatarName>;
  networksWithBalance: Record<string, NetworkWithCaipId[]>;
};
export const WalletAccountsCard = ({
  accountCount,
  networkCount,
  accountsInWallet,
  accountAvatars,
  networksWithBalance,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        padding: 2,
        marginTop: 1.5,
        overflow: 'visible',
      }}
    >
      <Typography variant="h3">{t('Accounts')}</Typography>
      <Typography variant="subtitle4" mb={2}>
        {t(
          'This wallet has {{accountCount}} {{accountUnit}} over {{networkCount}} {{networkUnit}}',
          {
            accountCount,
            networkCount,
            accountUnit: accountCount > 1 ? t('accounts') : t('account'),
            networkUnit: networkCount > 1 ? t('networks') : t('network'),
          },
        )}
      </Typography>

      {accountsInWallet.map((account, index) => (
        <WalletAccount
          key={account.id}
          account={account}
          isFirst={index === 0}
          avatarName={accountAvatars.get(account.id) ?? 'abstract-1.svg'}
          networksWithBalance={networksWithBalance[account.id] ?? []}
        />
      ))}
    </Card>
  );
};
