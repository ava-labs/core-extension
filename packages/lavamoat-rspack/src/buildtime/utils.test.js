const { progress } = require('./utils.js');

/**
 * @param {string[]} steps
 */
const setup = (steps) => {
  const PROGRESS = progress({ steps });
  /** @type {Error[]} */
  const errors = [];
  PROGRESS.reportErrorsTo(errors);
  return { PROGRESS, errors };
};

const LINEAR_STEPS = ['start', 'a', 'b', 'c'];

const UNORDERED_STEPS = [
  'start',
  'pathsProcessed',
  'generatorCalled:repeats:unordered',
  'runtimeAdded:repeats:unordered',
  'finish',
];

describe('progress', () => {
  describe('linear sequence', () => {
    it('advances through steps reported in order', () => {
      const { PROGRESS, errors } = setup(LINEAR_STEPS);

      PROGRESS.report('a');
      PROGRESS.report('b');
      PROGRESS.report('c');

      expect(errors).toHaveLength(0);
      expect(PROGRESS.done('a')).toBe(true);
      expect(PROGRESS.done('c')).toBe(true);
    });

    it('errors when a step is reported out of order', () => {
      const { PROGRESS, errors } = setup(LINEAR_STEPS);

      PROGRESS.report('c');

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain(
        "Progress reported 'c' but the next step was expected to be 'a'",
      );
    });
  });

  describe('unordered group', () => {
    it('accepts runtimeAdded before generatorCalled', () => {
      const { PROGRESS, errors } = setup(UNORDERED_STEPS);

      PROGRESS.report('pathsProcessed');
      PROGRESS.report('runtimeAdded');
      PROGRESS.report('generatorCalled');
      PROGRESS.report('finish');

      expect(errors).toHaveLength(0);
      expect(PROGRESS.done('generatorCalled')).toBe(true);
      expect(PROGRESS.done('runtimeAdded')).toBe(true);
      expect(PROGRESS.done('finish')).toBe(true);
    });

    it('accepts generatorCalled before runtimeAdded', () => {
      const { PROGRESS, errors } = setup(UNORDERED_STEPS);

      PROGRESS.report('pathsProcessed');
      PROGRESS.report('generatorCalled');
      PROGRESS.report('runtimeAdded');
      PROGRESS.report('finish');

      expect(errors).toHaveLength(0);
    });

    it('tolerates repeated reports of group members in any order', () => {
      const { PROGRESS, errors } = setup(UNORDERED_STEPS);

      PROGRESS.report('pathsProcessed');
      PROGRESS.report('generatorCalled');
      PROGRESS.report('generatorCalled');
      PROGRESS.report('runtimeAdded');
      PROGRESS.report('generatorCalled');
      PROGRESS.report('finish');

      expect(errors).toHaveLength(0);
    });

    it('does not advance past the group until every member is reported', () => {
      const { PROGRESS, errors } = setup(UNORDERED_STEPS);

      PROGRESS.report('pathsProcessed');
      PROGRESS.report('generatorCalled');
      PROGRESS.report('finish');

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain(
        "Progress reported 'finish' but the next step was expected to be 'runtimeAdded'",
      );
    });

    it('errors when entering the group before its predecessor is done', () => {
      const { PROGRESS, errors } = setup(UNORDERED_STEPS);

      PROGRESS.report('runtimeAdded');

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain(
        "the next step was expected to be 'pathsProcessed'",
      );
    });
  });
});
