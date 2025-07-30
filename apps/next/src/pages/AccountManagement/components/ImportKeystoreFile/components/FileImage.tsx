import { useTheme } from '@avalabs/k2-alpine';
import DarkImage from '../assets/darkFileImage.svg';
import LightImage from '../assets/lightFileImage.svg';

export const FileImage = () => {
  const theme = useTheme();
  const image = theme.palette.mode === 'light' ? LightImage : DarkImage;
  return <img src={image} alt="File Image" width={44} height={51} />;
};
