const {
  createModuleInspector,
  LavamoatModuleRecord,
  loadPoliciesSync,
  jsonStringifySortedPolicy,
} = require('lavamoat-core');
const {
  getPackageNameForModulePathMonorepo,
} = require('./canonicalPackageName.js');
const { writeFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const { isExcludedUnsafe } = require('./exclude');
const diag = require('./diagnostics');

/**
 * @typedef {(specifier: string) => boolean} IsBuiltinFn
 */

/**
 * @typedef {import('@rspack/core').NormalModule | import('@rspack/core').ExternalModule} InspectableModule
 */

/** @import {LavaMoatPolicy, ResourceMetadata} from '@lavamoat/types' */
/** @import {CanonicalNameMap} from '@lavamoat/aa' */
/** @import {NormalModule, Module} from '@rspack/core' */

module.exports = {
  stringifyPolicyReliably: jsonStringifySortedPolicy,
  /**
   * @param {Object} opts
   * @param {LavaMoatPolicy | undefined} opts.policyFromOptions
   * @param {string} opts.location
   * @returns {LavaMoatPolicy}
   */
  loadPolicy({ policyFromOptions, location }) {
    const { policy, applyOverride } = loadPoliciesSync({
      policyPath: path.join(location, 'policy.json'),
      policyOverridePath: path.join(location, 'policy-override.json'),
      debugMode: false,
    });

    /** @type {LavaMoatPolicy} */
    let final = { resources: {} };
    if (policyFromOptions) {
      // TODO: avoid loading the policy file if policyFromOptions is present
      final = policyFromOptions;
    } else if (policy) {
      final = applyOverride(policy);
    }
    return final;
  },
  /**
   * @param {Object} opts
   * @param {CanonicalNameMap} opts.canonicalNameMap - Generated from aa
   * @param {string} opts.location - Where to read/write the policy files
   * @param {IsBuiltinFn} opts.isBuiltin - A function that determines if the
   *   specifier is a builtin of the runtime platform e.g. node:fs
   * @returns
   */
  /**
   * @typedef {{
   *   module: InspectableModule
   *   connections: Iterable<import('@rspack/core').ModuleGraphConnection>
   * }} ModuleWithConnections
   *
   *
   * @typedef {ResourceMetadata & Record<string, string[]>} ReexportMetaRecord
   */

  /**
   * @param {Object} opts
   * @param {CanonicalNameMap} opts.canonicalNameMap
   * @param {string} opts.location
   * @param {IsBuiltinFn} opts.isBuiltin
   * @param {ModuleWithConnections[]} opts.modulesToInspect
   * @param {string[]} [opts.knownIncompatiblePackages]
   * @returns {LavaMoatPolicy}
   */
  generatePolicy({
    canonicalNameMap,
    location,
    isBuiltin,
    modulesToInspect,
    knownIncompatiblePackages,
  }) {
    const { applyOverride } = loadPoliciesSync({
      policyPath: path.join(location, 'policy.json'),
      policyOverridePath: path.join(location, 'policy-override.json'),
      debugMode: false,
    });

    /** @type {Record<string, ReexportMetaRecord>} } */
    const meta = {};
    const REEXPORT_WARNING_KEY = 'graph-optimization';
    /**
     * @param {string} packageName
     * @param {Module | NormalModule} wasModule
     * @param {Module | NormalModule} isModule
     */
    const reportGraphOptimization = (packageName, wasModule, isModule) => {
      // eliminate most cases of inner-package reexports early
      if (wasModule.context === isModule.context) return;
      /**
       * @param {Module} m
       * @returns {string}
       */
      const getModuleSpecifierRepresentation = (m) =>
        'userRequest' in m
          ? /** @type {NormalModule} */ (m).userRequest
          : m.context || '<unknown>';

      const a = getPackageNameForModulePathMonorepo(
        canonicalNameMap,
        getModuleSpecifierRepresentation(wasModule),
      );
      const b = getPackageNameForModulePathMonorepo(
        canonicalNameMap,
        getModuleSpecifierRepresentation(isModule),
      );
      if (a !== b && packageName !== a && packageName !== b) {
        if (!meta[packageName]) {
          meta[packageName] = { [REEXPORT_WARNING_KEY]: [] };
        }
        const warning = `Dependency '${a}' reexports from '${b}' and the bundler collapsed that to a direct import.`;
        if (!meta[packageName][REEXPORT_WARNING_KEY].includes(warning)) {
          meta[packageName][REEXPORT_WARNING_KEY].push(warning);
        }
      }
    };

    const moduleInspector = createModuleInspector({
      isBuiltin,
      includeDebugInfo: false,
      // If the specifier is requested as a dependency in importMap but was never passed to inspectModule, its package name will be looked up here.
      // Workaround: module graph sometimes aliases paths (e.g. index.mjs vs index.js); package resolution still comes from canonicalNameMap.
      moduleToPackageFallback: (specifier) =>
        getPackageNameForModulePathMonorepo(canonicalNameMap, specifier),
    });

    const allowedIncompat = new Set(knownIncompatiblePackages ?? []);
    /** @type {string[]} */
    const unexpectedIncompat = [];

    moduleInspector.on(
      'compat-warning',
      /** @param {{ moduleRecord: import('lavamoat-core').LavamoatModuleRecord }} event */
      ({ moduleRecord }) => {
        if (allowedIncompat.has(moduleRecord.packageName)) {
          diag.rawDebug(
            1,
            `LavaMoatPlugin: Suppressed known compat warning for "${moduleRecord.packageName}"`,
          );
          return;
        }
        unexpectedIncompat.push(
          `  - "${moduleRecord.packageName}" (${moduleRecord.file})`,
        );
      },
    );

    // Process modules in a deterministic order so that any state lavamoat-core
    // accumulates across `inspectModule` calls (and any iteration-order leakage
    // into the generated policy) doesn't depend on the order rspack's module
    // graph happens to hand us. Modules without `userRequest` are filtered first
    // and surfaced via diag, mirroring the original loop.
    const sortedModulesToInspect = Array.from(modulesToInspect)
      .filter(({ module }) => {
        if (isExcludedUnsafe(module)) return false;
        if (module.userRequest === undefined) {
          diag.rawDebug(
            1,
            `LavaMoatPlugin: Module ${module.identifier()} has no userRequest`,
          );
          diag.rawDebug(2, { skippingInspectingModule: module });
          return false;
        }
        return true;
      })
      // Plain codepoint comparison (instead of localeCompare) so the sort is
      // identical regardless of the host machine's locale.
      .sort((a, b) => {
        const ar = /** @type {string} */ (a.module.userRequest);
        const br = /** @type {string} */ (b.module.userRequest);
        if (ar === br) return 0;
        return ar < br ? -1 : 1;
      });

    for (const { module, connections } of sortedModulesToInspect) {
      const packageName = getPackageNameForModulePathMonorepo(
        canonicalNameMap,
        module.userRequest,
      );
      const moduleRecord = new LavamoatModuleRecord({
        // Knowing the actual specifier is not relevant here, they're used as unique identifiers that match between here and dependencies
        specifier: module.userRequest,
        file: module.userRequest,
        type: isBuiltin(module.userRequest) ? 'builtin' : 'js',
        packageName,
        content: module.originalSource()?.source()?.toString(),
        importMap: {
          // connections are a much better source of information than module.dependencies which contain
          // all imported references separately along with exports and fluff.
          // Sort connections by their target's userRequest so the importMap
          // (and any side effects in `reportGraphOptimization`) is built in
          // deterministic order regardless of rspack's traversal.
          ...Array.from(connections)
            .sort((a, b) => {
              const ar =
                /** @type {any} */ (a.module)?.userRequest ??
                a.module?.identifier() ??
                '';
              const br =
                /** @type {any} */ (b.module)?.userRequest ??
                b.module?.identifier() ??
                '';
              if (ar === br) return 0;
              return ar < br ? -1 : 1;
            })
            .reduce((acc, connection) => {
              // connection.resolvedModule is pointing to the original module instance, before optimizations. connection.module is the module instance after. If they differ, a reexport might have been collapsed into a direct import from reexported module.
              if (connection.module !== connection.resolvedModule) {
                reportGraphOptimization(
                  packageName,
                  connection.resolvedModule,
                  connection.module,
                );
              }
              // @ts-expect-error - bad types?
              const depSpecifier = connection.module?.userRequest;
              // Skip connections without a usable specifier (would otherwise add an
              // 'undefined' string key) and self-references that would inflate the
              // module's own importMap with an entry pointing to itself.
              if (
                typeof depSpecifier !== 'string' ||
                depSpecifier.length === 0 ||
                depSpecifier === module.userRequest
              ) {
                return acc;
              }
              acc[depSpecifier] = depSpecifier;
              return acc;
            }, /** @type {Record<string, string>} */ ({})),
        },
      });

      try {
        moduleInspector.inspectModule(moduleRecord);
      } catch (/** @type any */ e) {
        throw new Error(
          `LavaMoatPlugin: Failed to inspect module ${module.userRequest} for policy generation:\n ${e.message}\n If the file is not intended to be valid JavaScript, consider excluding it using LavaMoat.exclude loader.`,
          { cause: e },
        );
      }
    }

    if (unexpectedIncompat.length > 0) {
      // Sort so the error output is identical between builds for the same input.
      unexpectedIncompat.sort();
      throw new Error(
        `LavaMoatPlugin: SES-incompatible code found in ${unexpectedIncompat.length} unexpected package(s):\n${unexpectedIncompat.join('\n')}\n\nIf these packages are safe to allow, add them to the "knownIncompatiblePackages" option.`,
      );
    }

    const policy = moduleInspector.generatePolicy({});
    // Sort meta package names + the per-package warning arrays so the emitted
    // policy.json is byte-stable across runs. `jsonStringifySortedPolicy` only
    // sorts object keys; arrays keep their insertion order.
    Object.keys(meta)
      .sort()
      .forEach((packageName) => {
        if (!policy.resources[packageName]) {
          return;
        }
        const packageMeta = meta[packageName];
        Object.values(packageMeta).forEach((entries) => {
          if (Array.isArray(entries)) {
            entries.sort();
          }
        });
        policy.resources[packageName].meta = packageMeta;
      });
    mkdirSync(location, { recursive: true });
    writeFileSync(
      path.join(location, 'policy.json'),
      // Trailing newline so the file plays nicely with POSIX tooling
      // (cat, diff, editors that warn about missing final newline, etc.).
      `${jsonStringifySortedPolicy(policy)}\n`,
      'utf8',
    );
    return applyOverride(policy);
  },
};
