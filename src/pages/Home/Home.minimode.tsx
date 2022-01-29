import { VerticalFlex } from '@avalabs/react-components';
import { FAB } from '@src/components/common/fab/FAB.minimode';
import { PortfolioFlow } from './components/Portfolio/PortfolioFlow';

export function HomeMiniMode() {
  return (
    <VerticalFlex width={'100%'}>
      <VerticalFlex flex={1}>
        <PortfolioFlow />
      </VerticalFlex>
      <FAB />
    </VerticalFlex>
  );
}
