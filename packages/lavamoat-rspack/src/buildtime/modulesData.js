const path = require('node:path');
const diag = require('./diagnostics.js');
const { WebpackError } = require('@rspack/core');

/** @import {Module, NormalModule, ExternalModule} from '@rspack/core' */
/** @import {InspectableModule} from './policyGenerator.js' */

// TODO: move into an enum file along with the other
const JAVASCRIPT_MODULE_TYPE_DYNAMIC = 'javascript/dynamic';

/**
 * @remarks
 * Webpack has a concept of ignored modules. When a module is ignored, a
 * carve-out is necessary in policy enforcement for it because the ID that
 * webpack creates for it is not exactly helpful. example outcome in the bundle:
 * `const nodeCrypto = __webpack_require__(/*! crypto *\/ "?0b7d");` Sadly, even
 * treeshaking doesn't eliminate that module. It's left there and failing to
 * work when reached by runtime policy enforcement. Below is the most reliable
 * way I've found to date to identify ignored modules.
 * @param {Module} m
 * @returns {boolean}
 */
const isIgnoredModule = (m) => {
  return Boolean(
    m.type === JAVASCRIPT_MODULE_TYPE_DYNAMIC &&
      // @ts-expect-error BAD TYPES
      m.identifierStr?.startsWith('ignored'),
  );
};

/**
 * Checks if a module is a context module.
 *
 * @param {any} m - The module to check.
 * @param {string} moduleClass - The class of the module.
 * @returns {boolean} - Returns true if the module is a context module,
 *   otherwise false.
 */
const isContextModule = (_m, moduleClass) => moduleClass === 'ContextModule';

/**
 * Rspack often omits `module.context` on ContextModule; the filesystem directory is
 * still in `identifier()`:
 * - Webpack-style: `./src/dir lazy recursive ^\\.\\/.*$`
 * - Rspack-style: `/abs/path/to/dir|lazy|/^\\.\\/.*$/|groupOptions: {}|...`
 *
 * @param {string} identifier
 * @returns {string | undefined}
 */
const parseContextDirectoryFromIdentifier = (identifier) => {
  if (typeof identifier !== 'string' || !identifier) {
    return undefined;
  }
  if (identifier.includes('|')) {
    const first = identifier.split('|')[0].trim();
    return first || undefined;
  }
  const re =
    /^(.+?)\s+((?:async\s+lazy|async\s+weak|lazy(?:-once)?|eager|sync|weak))\s/;
  const m = identifier.match(re);
  return m ? m[1].trim() : undefined;
};

/**
 * @param {import('@rspack/core').Module} module
 * @param {string} [compilerContext]
 * @returns {string | undefined}
 */
const resolveContextModuleFilesystemContext = (module, compilerContext) => {
  /** @type {string | undefined} */
  let raw = module.context;
  if (!raw && typeof module.nameForCondition === 'function') {
    raw = module.nameForCondition() ?? undefined;
  }
  if (!raw && typeof module.identifier === 'function') {
    raw = parseContextDirectoryFromIdentifier(module.identifier());
  }
  if (!raw) {
    return undefined;
  }
  if (
    compilerContext &&
    !path.isAbsolute(raw) &&
    (raw.startsWith('./') || raw.startsWith('../'))
  ) {
    return path.resolve(compilerContext, raw);
  }
  return raw;
};

/**
 * Identifies an asset that the bundler emits by default without a loader
 * being defined for it explicitly.
 *
 * @param {Module} m
 * @returns {m is NormalModule}
 */
const isAmbientAsset = (m) =>
  m.type === 'asset/resource' &&
  'resource' in m &&
  'loaders' in m &&
  Array.isArray(m.loaders) &&
  m.loaders.length === 0;

/**
 * @typedef {{ constructor: { name: string }; dataUrlCondition: boolean }} AssetParser
 */

/**
 * Recognize an AssetParser by constructor name — parser type is not on the Rspack public API.
 *
 * @param {object} parser
 * @returns {parser is AssetParser}
 */
const isAssetParser = (parser) => parser.constructor.name === 'AssetParser';

/**
 * @param {Module} m
 * @param {string} moduleClass
 * @returns {m is ExternalModule}
 */
const isExternalModule = (m, moduleClass) =>
  ['ExternalModule'].includes(moduleClass) &&
  'externalType' in m &&
  m.externalType !== undefined;
/**
 * @param {Module} m
 * @param {string} moduleClass
 * @returns {m is InspectableModule}
 */
const isInspectableModule = (m, moduleClass) =>
  'userRequest' in m ||
  m.type?.startsWith('javascript') ||
  isExternalModule(m, moduleClass);

/**
 * @typedef {{
 *   module: Module
 *   moduleId: string | number | null
 * }} IdentifiedModule
 */

/**
 * Creates an analyzer for bundle modules that tracks various module types and
 * their properties
 *
 * @param {Object} opts
 * @param {Error[]} opts.mainCompilationWarnings - Array to store compilation
 *   warnings
 * @param {IdentifiedModule[]} opts.allIdentifiedModules
 * @param {string} [opts.compilerContext] - Compiler `context` for resolving
 *   relative context paths parsed from ContextModule identifiers (Rspack).
 * @returns {{
 *   inspectable: InspectableModule[]
 *   contextModules: { moduleId: string | number; context: string }[]
 *   knownPaths: { path: string; moduleId: string | number }[]
 *   unenforceableModuleIds: (string | number)[]
 *   externals: Record<string | number, string>
 * }}
 */
exports.analyzeModules = ({
  mainCompilationWarnings,
  allIdentifiedModules,
  compilerContext,
}) => {
  /**
   * Array of objects representing the paths and module ids found in the
   * generation process.
   *
   * @type {{ path: string; moduleId: string | number }[]}
   */
  const knownPaths = [];
  /**
   * Array of module ids that are unenforceable by policy.
   *
   * @type {(string | number)[]}
   */
  const unenforceableModuleIds = [];
  /**
   * Array of module ids that are context modules and need to be double-wrapped.
   *
   * @type {{ moduleId: string | number; context: string }[]}
   */
  const contextModules = [];

  /**
   * An array of modules deemed fit for inspecting for policy
   *
   * @type {InspectableModule[]}
   */
  const inspectable = [];

  /**
   * A record of module ids that are externals and need to be enforced as
   * builtins.
   *
   * @type {Record<string | number, string>}
   */
  const externals = {};

  /**
   * @param {IdentifiedModule} arg
   * @returns
   */
  const processModule = ({ module, moduleId }) => {
    const moduleClass = Object.getPrototypeOf(module).constructor.name;

    if (moduleId === null) {
      diag.rawDebug(
        2,
        `LavaMoatPlugin: module ${module.identifier()} has no moduleId, cannot cover it with policy.`,
      );
      diag.rawDebug(4, { module });
      return;
    }

    // ==================================================
    // Fixing bad modules

    // Fixes the issue with assets being emitted to dist without the user knowing
    // TODO: refactor to move random hardening of the build somewhere it's easier to track.
    if (
      isAmbientAsset(module) &&
      (module?.resourceResolveData?.context &&
      'issuer' in module.resourceResolveData.context
        ? // @ts-expect-error - webpack shipped a type for context that's just `object` which is useless
          module.resourceResolveData.context.issuer.includes('node_modules') // resourceResolveData.context.issuer is the module that requested the asset to be present (eg. contained a `new URL(asset)`)
        : typeof module.resource === 'string' &&
          module.resource.includes('node_modules'))
      // FIXME: would be better to use canonicalName lookup and match with root
    ) {
      // TODO: design a capability that would represent a permission to emit an asset from a dependency when custom capabilities in policy.json arrive.

      if (
        module.parser &&
        isAssetParser(module.parser) &&
        module.parser.dataUrlCondition === true
      ) {
        // skip work for items configured to be inlined as data URLs
        return;
      }

      mainCompilationWarnings.push(
        new WebpackError(
          `LavaMoatPlugin: the following resource was being silently emitted to the dist directory and LavaMoat has prevented it: '${module.resource}'.`,
        ),
      );

      // We can't use `chunkGraph.disconnectChunkAndModule` here
      // because the require statement remains in the generated bundle code
      // and errors out

      if (module.generatorOptions) {
        // generatorOptions was not present in testing, but types indicate it might be there
        module.generatorOptions.emit = false;
      }
      if (module.generator) {
        module.generator = Object.create(module.generator, {
          emit: {
            value: false,
            enumerable: true,
          },
        });
      }
    }

    // ==================================================
    // Collecting data

    // Note: module.context on an empty context module when no context information was guessable from code is going to point to the module that loads it.
    if (isContextModule(module, moduleClass)) {
      diag.rawDebug(3, {
        contextModule: {
          moduleId,
          context: module.context,
          // @ts-expect-error we want to see it if available
          request: module?.options?.request,
          // @ts-expect-error we want to see it if available
          _identifier: module?._identifier,
        },
      });
      const resolvedContext = resolveContextModuleFilesystemContext(
        module,
        compilerContext,
      );
      if (!resolvedContext) {
        mainCompilationWarnings.push(
          new WebpackError(
            `LavaMoatPlugin: context module ${moduleId} has no context information. It cannot be allowed to work if it's reached at runtime.`,
          ),
        );
      } else {
        contextModules.push({ moduleId, context: resolvedContext });
      }
    }
    if (isIgnoredModule(module)) {
      unenforceableModuleIds.push(moduleId);
    } else {
      if (isExternalModule(module, moduleClass)) {
        externals[moduleId] = module.userRequest;
      }
      if (isInspectableModule(module, moduleClass)) {
        inspectable.push(module);
      }

      // typescript is complaining about the use of `resource` here, but it's actually there.
      knownPaths.push({
        path: /** @type {any} */ (module).resource, // TODO: use actual type so that we enforce the right string being compared everywhere
        moduleId,
      });
    }
  };

  for (const { module, moduleId } of allIdentifiedModules) {
    processModule({ module, moduleId });
  }

  return {
    inspectable,
    contextModules,
    knownPaths,
    unenforceableModuleIds,
    externals,
  };
};
