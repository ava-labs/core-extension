import { Page } from '@/components/Page';
import { getBridgePath } from '@/config/routes';
import { StackProps } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useNextUnifiedBridgeContext } from '../Bridge/contexts';
import { ActivityItem } from './components';

const contentProps: StackProps = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 1,
  height: 1,
  gap: 1,
};

export const Activity = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    state: { pendingTransfers },
  } = useNextUnifiedBridgeContext();

  return (
    <Page title={t('Activity')} withBackButton contentProps={contentProps}>
      {Object.values(pendingTransfers).map((transfer) => (
        <ActivityItem
          key={transfer.sourceTxHash}
          title={t('Bridging in progress...')}
          subtitle={t('Click for more details')}
          onClick={() => {
            history.push(
              getBridgePath({
                transactionId: transfer.sourceTxHash,
              }),
            );
          }}
        />
      ))}
    </Page>
  );
};
