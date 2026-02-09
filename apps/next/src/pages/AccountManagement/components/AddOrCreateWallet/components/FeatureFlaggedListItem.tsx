import { Divider } from '@avalabs/k2-alpine';
import { useFeatureFlagContext } from '@core/ui';
import { FeatureGates } from '@core/types';
import { ComponentType, FC } from 'react';
import { AccountListItem } from './AccountListItem';

type Props = {
  featureFlag: FeatureGates;
  Icon: ComponentType<{ size?: number | string }>;
  primary: string;
  secondary: string;
  onClick: () => void;
};

export const FeatureFlaggedListItem: FC<Props> = ({
  featureFlag,
  Icon,
  primary,
  secondary,
  onClick,
}) => {
  const { isFlagEnabled } = useFeatureFlagContext();

  if (!isFlagEnabled(featureFlag)) {
    return null;
  }

  return (
    <>
      <Divider />
      <AccountListItem
        Icon={Icon}
        primary={primary}
        secondary={secondary}
        onClick={onClick}
      />
    </>
  );
};
