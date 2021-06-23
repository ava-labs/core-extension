// import original module declarations
import 'styled-components';
import { colors, Theme } from '@avalabs/react-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends Theme<typeof colors> {}
}
