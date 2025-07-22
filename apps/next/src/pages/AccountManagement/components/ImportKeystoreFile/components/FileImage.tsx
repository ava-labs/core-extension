import { FileImageLight } from '../assets/FileImageLight';
import { FileImageDark } from '../assets/FileImageDark';
import { useTheme } from '@avalabs/k2-alpine';

export const FileImage = () => {
  const theme = useTheme();
  const image =
    theme.palette.mode === 'light' ? <FileImageLight /> : <FileImageDark />;

  return image;
};
