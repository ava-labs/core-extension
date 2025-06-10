import { ContextContainer } from '@core/types';
import { useAppDimensions } from './useAppDimensions';

type AppDimensions = ReturnType<typeof useAppDimensions>;

describe('useAppDimensions', () => {
  it.each<[ContextContainer, AppDimensions]>([
    [ContextContainer.POPUP, { width: '320px', height: '600px' }],
    [ContextContainer.CONFIRM, { width: '320px', height: '900px' }],
    [ContextContainer.FULLSCREEN, { width: '100%', height: '100%' }],
  ])('should return %s dimensions', (context, expected) => {
    // Arrange
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      pathname: `https://example.com${context}`,
    } as Location);

    // Act
    const result = useAppDimensions();

    // Assert
    expect(result).toEqual(expected);
  });
});
