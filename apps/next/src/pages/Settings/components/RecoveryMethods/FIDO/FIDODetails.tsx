import { getIconForMethod } from '../RecoveryMethodCard';
import { MethodCard } from '../components/MethodCard';

export enum FIDOState {
  Initial = 'initial',
  Initiated = 'initiated',
  ConfirmRemoval = 'confirm-removal',
  Failure = 'failure',
}

export const FIDODetails = ({ method }) => {
  return (
    <MethodCard
      icon={getIconForMethod(method)}
      title={method.name}
      key={method.toString()}
      showChevron={false}
    />
  );
};
