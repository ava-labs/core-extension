import { colors, createTheme } from '@avalabs/react-components';

export const lightTheme = createTheme<typeof colors>({
  colors: colors,
});
export const darkTheme = createTheme<typeof colors>({ colors: colors });
