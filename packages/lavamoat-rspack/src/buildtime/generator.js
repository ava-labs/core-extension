/** @import {NormalModule} from '@rspack/core' */
/** @import {ProgressAPI} from './utils.js' */
/** @typedef {import('@rspack/core').sources.Source} Source */

const {
  sources: { ConcatSource },
} = require('@rspack/core');
const { wrapper } = require('./wrapper.js');
const diag = require('./diagnostics.js');

const RUNTIME_GLOBALS = require('../../RuntimeGlobals.js');
const { RUNTIME_KEY } = require('../ENUM.json');

const { isExcluded } = require('./exclude');

// TODO: extend runtimeFlags as needed for additional RuntimeGlobals (see Rspack runtime).
/**
 * @param {Set<string>} requirements
 * @param {NormalModule} module
 * @returns
 */
function processRequirements(requirements, module) {
  const runtimeKit = new Set();
  const runtimeFlags = {};

  for (const requirement of requirements) {
    // Nested requirement paths are truncated to the top-level RuntimeGlobals key.
    const requirementReferenceName = requirement.split('.')[0];
    if (requirementReferenceName === RUNTIME_GLOBALS.thisAsExports) {
      runtimeFlags.thisAsExports = true;
      continue;
    }
    if (requirementReferenceName === RUNTIME_GLOBALS.returnExportsFromRuntime) {
      // TODO: should be doable to introduce support in wrapper.js by conditionally adding a return statement. feels too niche to support
      continue;
    }
    if (requirementReferenceName === '__webpack_exports__') {
      runtimeKit.add(module.exportsArgument ?? '__webpack_exports__');
    } else if (requirementReferenceName === 'module') {
      runtimeKit.add(module.moduleArgument ?? 'module');
    } else {
      runtimeKit.add(requirementReferenceName);
    }
  }
  diag.run(2, () => {
    runtimeKit.add(`/* ${Array.from(requirements).join()} */`);
  });

  return { runtimeKit, runtimeFlags };
}

/**
 * Rspack does not run JS NMF generator hooks during Rust codegen; we approximate
 * webpack's runtimeRequirements for wrapping after codegen (e.g. Rsdoctor moduleSources).
 *
 * @param {NormalModule} module
 * @returns {Set<string>}
 */
function inferRuntimeRequirements(module) {
  const req = new Set(['__webpack_require__']);
  const t = module.type || '';
  if (t === 'javascript/esm') {
    req.add('__webpack_exports__');
  } else {
    req.add('exports');
    req.add('module');
  }
  return req;
}

/**
 * @param {NormalModule} module
 */
function applyBuildInfoStrictHack(module) {
  if (
    module.buildInfo &&
    (module.buildInfo.strict === true || module.buildInfo.strict === undefined)
  ) {
    Object.defineProperty(module.buildInfo, 'strict', {
      get: () => false,
      set: () => {
        console.trace(
          'Attempted to set strict mode on module',
          module.rawRequest,
        );
      },
    });
  }
}

/**
 * @param {object} opts
 * @param {NormalModule} opts.module
 * @param {string} opts.source
 * @param {(path: string) => string | undefined} opts.getIdentifierForPath
 * @param {string[]} opts.excludes
 * @param {ProgressAPI} opts.PROGRESS
 * @returns {string}
 */
exports.wrapModuleCodegenSource = ({
  module,
  source,
  getIdentifierForPath,
  excludes,
  PROGRESS,
}) => {
  if (!source) {
    return source;
  }
  if (isExcluded(module)) {
    excludes.push(module.userRequest);
    diag.rawDebug(3, `skipped wrapping ${module.rawRequest}`);
    return source;
  }
  if (!PROGRESS.done('pathsProcessed')) {
    throw Error(
      'LavaMoatPlugin: attempting to wrap generated module before all paths from bundle were known.',
    );
  }
  const resource =
    typeof module.resource === 'string' ? module.resource : undefined;
  if (!resource) {
    return source;
  }

  applyBuildInfoStrictHack(module);

  const packageId = getIdentifierForPath(resource);
  if (packageId === undefined) {
    throw Error(`Failed to find a packageId for ${resource}`);
  }

  const runtimeRequirements = inferRuntimeRequirements(module);
  const { runtimeKit, runtimeFlags } = processRequirements(
    runtimeRequirements,
    module,
  );

  const {
    before,
    after,
    source: transformed,
    sourceChanged,
  } = wrapper({
    source,
    id: packageId,
    runtimeKit,
    // Rsdoctor moduleSources can surface ESM syntax; webpack generator output is CJS and passes Function() checks.
    runChecks: false,
    evalKitFunctionName: `__webpack_require__.${RUNTIME_KEY}`,
    runtimeFlags,
  });

  diag.rawDebug(4, {
    packageId,
    requirements: runtimeRequirements,
    sourceChanged,
  });

  PROGRESS.report('generatorCalled');

  const inner = sourceChanged ? transformed : source;
  return `${before}${inner}${after}`;
};

// Use a weakset to mark generator as wrapped,
// this is to avoid wrapping the same instance twice
const wrappedGeneratorInstances = new WeakSet();

/**
 * @param {object} options
 * @param {string[]} options.excludes
 * @param {boolean | undefined} options.runChecks
 * @param {ProgressAPI} options.PROGRESS
 */
exports.wrapGenerator = ({ excludes, runChecks, PROGRESS }) => {
  /** @type {string[]} */
  const tooEarly = [];

  /** @type {(path: string) => string | undefined} */
  let identifierResolver = () => {
    throw Error(
      'LavaMoatPlugin: generator wrapping tried to resolve a path to an identifier before all paths from bundle were known.',
    );
  };

  let wrappingEnabled = false;

  return {
    /**
     * @param {object} options
     * @param {(path: string) => string | undefined} options.getIdentifierForPath
     */
    enableGeneratorWrapping({ getIdentifierForPath }) {
      wrappingEnabled = true;
      identifierResolver = getIdentifierForPath;

      return { tooEarly };
    },
    /**
     * @param {Generator} generator
     * @returns {Generator}
     */
    generatorHookHandler: (generator) => {
      // Monkey-patching JavascriptGenerator. Yes, this could be nicer.
      // Using features of the generator itself we might be able to achieve the same
      // but more susceptible to bundler internals changing.
      // And there aren't any official or private hooks that would give us access to runtime requirements that I could find.

      if (wrappedGeneratorInstances.has(generator)) {
        return generator;
      }
      const originalGenerate = generator.generate;
      /**
       * @param {NormalModule} module
       * @param {any} options - generator hook options (runtimeRequirements, etc.)
       * @returns {ReturnType<Generator['generate']>}
       */
      generator.generate = function (module, options) {
        diag.rawDebug(5, {
          wrappingEnabled,
          module,
          options,
        });

        // used to be .apply(this, arguments) but typescript complained. I feel it's worse that way
        const originalGeneratedSource = originalGenerate.call(
          this,
          module,
          options,
        );

        if (!originalGeneratedSource) {
          // If the original generated source is not available, we can't wrap it
          return originalGeneratedSource;
        }

        // skip doing anything if marked as excluded by the excludeLoader
        // this may clean up the `tooEarly` list too
        if (isExcluded(module)) {
          excludes.push(module.userRequest);
          diag.rawDebug(3, `skipped wrapping ${module.rawRequest}`);
          return originalGeneratedSource;
        }

        if (!wrappingEnabled) {
          tooEarly.push(module.request || module.rawRequest);
          return originalGeneratedSource;
        } else if (!PROGRESS.done('pathsProcessed')) {
          throw Error(
            'LavaMoatPlugin: attempting to wrap generated module before all paths from bundle were known.',
          );
        }

        // originalGenerate adds requirements to options.runtimeRequirements. runtimeKit needs to be derived from those.
        // We also depend on __webpack_require__ being there, so let's add it
        options.runtimeRequirements.add('__webpack_require__');

        // Turn off "use strict" being added in front of modules on final wrapping.
        // If anything attempts to reverse it, we want to ignore it
        if (
          module.buildInfo && // never found an actual case in which buildInfo wasn't there, but types suggest it's possible
          (module.buildInfo.strict === true ||
            module.buildInfo.strict === undefined) // seems like it's possible for generation to run more than once for the same module
        ) {
          Object.defineProperty(module.buildInfo, 'strict', {
            get: () => false,
            set: () => {
              // TODO: make the error more informative - explaining why the attempt to strict mode had to be skipped here but is applied anyway
              console.trace(
                'Attempted to set strict mode on module',
                module.rawRequest,
              );
            },
          });
        }

        const packageId = identifierResolver(module.resource);
        if (packageId === undefined) {
          throw Error(`Failed to find a packageId for ${module.resource}`);
        }

        const { runtimeKit, runtimeFlags } = processRequirements(
          options.runtimeRequirements,
          module,
        );

        const { before, after, source, sourceChanged } = wrapper({
          // Bundler stores sources on nested objects in generators
          // of strings. Turning it into a string here might mean we're loosing some caching.
          // Wrapper checks if transforms changed the source and indicates it, so that we can
          // decide if we want to keep the original object representing it.
          source: originalGeneratedSource.source().toString(),
          id: packageId,
          runtimeKit,
          runChecks,
          evalKitFunctionName: `__webpack_require__.${RUNTIME_KEY}`,
          runtimeFlags,
        });

        diag.rawDebug(4, {
          packageId,
          requirements: options.runtimeRequirements,
          sourceChanged,
        });

        PROGRESS.report('generatorCalled');

        // Using `unknown` avoids brittle config typing here.
        if (sourceChanged) {
          return new ConcatSource(before, source, after);
        } else {
          return new ConcatSource(before, originalGeneratedSource, after);
        }
      };
      wrappedGeneratorInstances.add(generator);
      return generator;
    },
  };
};
