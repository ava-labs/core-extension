import {
  HorizontalFlex,
  PlaceholderCard,
  PlaceholderTextLine,
} from '@avalabs/react-components';

export const ReviewLoading = () => {
  return (
    <>
      <PlaceholderTextLine height="20px" margin="16px 0 5px 0" width="40px" />
      <PlaceholderCard height="70px" />
      <PlaceholderTextLine height="20px" margin="24px 0 5px 0" width="20px" />
      <PlaceholderCard height="0px" />
      <PlaceholderTextLine width="100%" margin="24px 0" height="2px" />
      <HorizontalFlex margin="24px 0" justify="space-between" align="center">
        <PlaceholderTextLine width="20%" />
        <PlaceholderTextLine width="50%" />
      </HorizontalFlex>
      <HorizontalFlex margin="24px 0" justify="space-between" align="center">
        <PlaceholderTextLine width="50%" />
        <PlaceholderTextLine width="10%" />
      </HorizontalFlex>
      <HorizontalFlex margin="24px 0" justify="space-between" align="center">
        <PlaceholderTextLine width="30%" />
        <PlaceholderTextLine width="25%" />
      </HorizontalFlex>
      <HorizontalFlex margin="24px 0" justify="space-between" align="center">
        <PlaceholderTextLine width="40%" />
        <PlaceholderTextLine width="30%" />
      </HorizontalFlex>
    </>
  );
};
