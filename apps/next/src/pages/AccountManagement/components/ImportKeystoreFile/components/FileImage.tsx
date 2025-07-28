import { useTheme } from '@avalabs/k2-alpine';
import FileImageLight from '../assets/lightFileImage.png';
import FileImageDark from '../assets/darkFileImage.png';

const Light = () => {
  return <img src={FileImageLight} alt="File Image" width={44} height={51} />;
};

const Dark = () => {
  return <img src={FileImageDark} alt="File Image" width={44} height={51} />;
};

export const FileImage = () => {
  const theme = useTheme();

  const image = theme.palette.mode === 'light' ? <Light /> : <Dark />;

  return image;
};
