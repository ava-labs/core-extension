import { measureDuration } from './measureDuration';

describe('utils/measureDuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('measures duration with random ID and cleans up', () => {
    const measurement = measureDuration();

    expect(performance.mark).toHaveBeenCalledTimes(0);

    measurement.start();
    expect(performance.mark).toHaveBeenCalledTimes(1);
    expect(performance.mark).toHaveBeenCalledWith(
      `00000000-0000-0000-0000-000000000000-start`
    );

    const result = measurement.end();

    expect(result).toBe(100);
    expect(performance.measure).toHaveBeenCalledTimes(1);
    expect(performance.measure).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000-measurement',
      '00000000-0000-0000-0000-000000000000-start'
    );
    expect(performance.clearMarks).toHaveBeenCalledTimes(1);
    expect(performance.clearMarks).toHaveBeenCalledWith(
      `00000000-0000-0000-0000-000000000000-start`
    );
    expect(performance.clearMeasures).toHaveBeenCalledTimes(1);
    expect(performance.clearMeasures).toHaveBeenCalledWith(
      `00000000-0000-0000-0000-000000000000-measurement`
    );
  });

  it('uses measurement ID if provided', () => {
    const measurement = measureDuration('measurementID');

    expect(performance.mark).toHaveBeenCalledTimes(0);

    measurement.start();
    expect(performance.mark).toHaveBeenCalledTimes(1);
    expect(performance.mark).toHaveBeenCalledWith(`measurementID-start`);

    const result = measurement.end();

    expect(result).toBe(100);
    expect(performance.measure).toHaveBeenCalledTimes(1);
    expect(performance.measure).toHaveBeenCalledWith(
      'measurementID-measurement',
      'measurementID-start'
    );
    expect(performance.clearMarks).toHaveBeenCalledTimes(1);
    expect(performance.clearMarks).toHaveBeenCalledWith(`measurementID-start`);
    expect(performance.clearMeasures).toHaveBeenCalledTimes(1);
    expect(performance.clearMeasures).toHaveBeenCalledWith(
      `measurementID-measurement`
    );
  });
});
