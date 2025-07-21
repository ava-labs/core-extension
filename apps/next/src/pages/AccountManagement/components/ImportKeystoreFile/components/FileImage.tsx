import { FileImageLight } from '../assets/FileImageLight';
import { FileImageDark } from '../assets/FileImageDark';
import { useTheme } from '@avalabs/k2-alpine';

type FileImageProps = {
  width?: number;
  height?: number;
};

export const FileImage = ({ width = 32, height = 39 }: FileImageProps) => {
  const theme = useTheme();

  const image =
    theme.palette.mode === 'light' ? (
      <FileImageLight width={width} height={height} />
    ) : (
      <FileImageDark width={width} height={height} />
    );

  return image;
};
