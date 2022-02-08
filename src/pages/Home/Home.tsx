import { VerticalFlex } from '@avalabs/react-components';
import { FAB } from '@src/components/common/fab/FAB';
import { Portfolio } from './components/Portfolio/Portfolio';

export function Home() {
  return (
    <VerticalFlex width={'100%'}>
      <VerticalFlex flex={1}>
        <Portfolio />
      </VerticalFlex>
      <FAB />
    </VerticalFlex>
  );
}
