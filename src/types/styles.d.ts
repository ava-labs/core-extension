// import original module declarations
import 'styled-components';
import { Colors, colors, Theme } from '@avalabs/react-components';

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme<Colors> {}
}
