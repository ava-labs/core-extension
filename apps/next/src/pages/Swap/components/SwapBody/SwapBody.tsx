import { useSwapState } from '../../contexts/SwapStateContext';

export const SwapBody = () => {
  const { provider } = useSwapState();

  return <div>TODO: Use {provider}</div>;
};
