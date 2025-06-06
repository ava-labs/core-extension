import { Dialog, getHexAlpha, styled } from '@avalabs/k2-alpine';

export const FullscreenModal = styled(Dialog)`
  .MuiPaper-root {
    padding: 0;
    width: 100%;
    max-width: 600px;
    height: 80vh;
    max-height: 720px;
    border-radius: ${({ theme }) => theme.shape.borderRadius * 3}px;
    background-color: ${({ theme }) => theme.palette.surface.secondary};
    border-style: solid;
    border-width: 1px;
    border-color: ${({ theme }) => getHexAlpha(theme.palette.primary.main, 10)};
    box-shadow: 0px 15px 30px 0px rgba(0, 0, 0, 0.1);
    align-items: center;
    justify-content: center;
  }
`;
