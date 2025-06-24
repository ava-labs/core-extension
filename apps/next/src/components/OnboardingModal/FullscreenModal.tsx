import { Dialog, getHexAlpha, styled } from '@avalabs/k2-alpine';

export const FullscreenModal = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    padding: 0,
    width: '100%',
    maxWidth: '600px',
    height: '80vh',
    maxHeight: '720px',
    borderRadius: theme.shape.largeBorderRadius,
    backgroundColor: theme.palette.surface.secondary,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: getHexAlpha(theme.palette.primary.main, 10),
    boxShadow: '0px 15px 30px 0px rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
