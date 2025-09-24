import { CardMenuItem } from '@/pages/Onboarding/components/CardMenu';
import { getIconForMethod } from '../RecoveryMethodCard';

export enum FIDOState {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmRemoval = 'confirm-removal',
  Failure = 'failure',
}

export const FIDODetails = ({ method }) => {
  return (
    <CardMenuItem
      icon={getIconForMethod(method)}
      text={method.name}
      key={method.toString()}
    />
  );
};
