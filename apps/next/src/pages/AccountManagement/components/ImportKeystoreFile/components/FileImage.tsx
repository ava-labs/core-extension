import { useTheme } from '@avalabs/k2-alpine';
import DarkImage from '../assets/darkFileImage.svg';
import LightImage from '../assets/lightFileImage.svg';

const Light = () => {
  return <img src={LightImage} alt="File Image" width={44} height={51} />;
};

const Dark = () => {
  return <img src={DarkImage} alt="File Image" width={44} height={51} />;
};

export const FileImage = () => {
  const theme = useTheme();

  const image = theme.palette.mode === 'light' ? <Light /> : <Dark />;

  return image;
};
