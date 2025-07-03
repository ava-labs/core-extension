import { Button, ButtonProps, styled } from '@avalabs/k2-alpine';

export const NavButton = styled((props: ButtonProps) => (
  <Button variant="contained" {...props} />
))({
  minWidth: 150,
  alignSelf: 'flex-end',
});
