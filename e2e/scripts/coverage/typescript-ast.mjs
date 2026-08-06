import { createRequire } from 'node:module';
import { GENERIC_FEATURE_TOKENS } from './constants.mjs';
const require = createRequire(import.meta.url);
export const ts = require('typescript');
/** Wildcard `*` matches any substring (empty allowed). */
export function globToRegExp(glob) {
  const parts = glob
    .split('*')
    .map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${parts.join('.*')}$`);
}

/**
 * @param {import('typescript').Expression | undefined} expr
 * @param {import('typescript').TypeChecker | null} checker
 */
export function collectStringsFromExpr(expr, checker) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  if (!expr) {
    return out;
  }

  const visit = (e) => {
    if (!e) {
      return;
    }
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) {
      out.statics.add(e.text);
      return;
    }
    if (ts.isTemplateExpression(e)) {
      let glob = '';
      glob += e.head.text;
      for (const span of e.templateSpans) {
        glob += '*';
        glob += span.literal.text;
      }
      if (glob.includes('*')) {
        out.globs.add(glob);
      } else {
        out.statics.add(glob);
      }
      return;
    }
    if (
      ts.isBinaryExpression(e) &&
      e.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
    ) {
      visit(e.left);
      visit(e.right);
      return;
    }
    if (
      ts.isBinaryExpression(e) &&
      e.operatorToken.kind === ts.SyntaxKind.BarBarToken
    ) {
      visit(e.left);
      visit(e.right);
      return;
    }
    if (ts.isParenthesizedExpression(e)) {
      visit(e.expression);
      return;
    }
    if (ts.isConditionalExpression(e)) {
      visit(e.whenTrue);
      visit(e.whenFalse);
      return;
    }
    if (checker && ts.isIdentifier(e)) {
      const t = checker.getTypeAtLocation(e);
      if (t.isStringLiteral()) {
        out.statics.add(t.value);
      }
    }
  };

  visit(expr);
  return out;
}

/**
 * @param {string} filePath
 * @param {string} sourceText
 * @param {boolean} isTsx
 */
export function createAst(filePath, sourceText, isTsx) {
  return ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

/**
 * @param {import('typescript').SourceFile} sf
 * @param {import('typescript').TypeChecker | null} checker
 */
export function extractAppTestIds(sf, checker) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  const merge = (a) => {
    for (const s of a.statics) {
      out.statics.add(s);
    }
    for (const g of a.globs) {
      out.globs.add(g);
    }
  };

  const visit = (node) => {
    const jsxAttrName = ts.isJsxAttribute(node) ? node.name.getText(sf) : '';
    const isTestIdAttr =
      jsxAttrName === 'data-testid' || jsxAttrName === 'dataTestId';
    if (ts.isJsxAttribute(node) && isTestIdAttr && node.initializer) {
      const init = node.initializer;
      if (
        ts.isStringLiteral(init) ||
        ts.isNoSubstitutionTemplateLiteral(init)
      ) {
        out.statics.add(init.text);
      } else if (ts.isJsxExpression(init)) {
        merge(collectStringsFromExpr(init.expression, checker));
      }
    }
    if (ts.isPropertyAssignment(node)) {
      const name = node.name;
      const key =
        ts.isIdentifier(name) && name.text === 'dataTestId'
          ? 'dataTestId'
          : ts.isStringLiteral(name) && name.text === 'data-testid'
            ? 'data-testid'
            : ts.isIdentifier(name) && name.text === 'data_testid'
              ? 'data_testid'
              : null;
      if (key !== null) {
        merge(collectStringsFromExpr(node.initializer, checker));
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sf);
  return out;
}

/**
 * @param {import('typescript').Node} callee
 * @param {import('typescript').SourceFile} sf
 */
export function isGetByTestIdCallee(callee, sf) {
  const t = callee.getText(sf);
  return (
    t.endsWith('.getByTestId') ||
    t.endsWith('getByTestId') ||
    t === 'getByTestId'
  );
}

/**
 * @param {import('typescript').SourceFile} sf
 * @param {import('typescript').TypeChecker | null} checker
 */
export function extractE2eTestIdRefs(sf, checker) {
  /** @type {{ statics: Set<string>, globs: Set<string> }} */
  const out = { statics: new Set(), globs: new Set() };
  const merge = (a) => {
    for (const s of a.statics) {
      out.statics.add(s);
    }
    for (const g of a.globs) {
      out.globs.add(g);
    }
  };

  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      isGetByTestIdCallee(node.expression, sf) &&
      node.arguments[0]
    ) {
      merge(collectStringsFromExpr(node.arguments[0], checker));
    }
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression)
    ) {
      const prop = node.expression.name.text;
      if (
        prop === 'locator' &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const m = node.arguments[0].text.match(
          /\[data-testid=["']([^"']+)["']\]/,
        );
        if (m) {
          out.statics.add(m[1]);
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sf);
  return out;
}

/** @param {import('typescript').SourceFile} sf */
export function extractFeatureName(sf) {
  let feature = null;
  const visit = (node) => {
    if (feature) {
      return;
    }
    if (!ts.isCallExpression(node)) {
      ts.forEachChild(node, visit);
      return;
    }
    const callee = node.expression;
    const calleeText = callee.getText(sf);
    const isDescribe =
      calleeText === 'test.describe' ||
      calleeText.endsWith('.describe') ||
      calleeText === 'test.describe.parallel' ||
      calleeText.endsWith('.describe.parallel') ||
      calleeText.endsWith('.describe.serial') ||
      calleeText.endsWith('.describe.only') ||
      calleeText.endsWith('.describe.skip');
    if (isDescribe && node.arguments[0]) {
      const a0 = node.arguments[0];
      if (ts.isStringLiteral(a0) || ts.isNoSubstitutionTemplateLiteral(a0)) {
        feature = a0.text;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return feature;
}

/** @param {import('typescript').SourceFile} sf */
export function countParametrizedRows(sf) {
  let rows = 1;
  const visit = (node) => {
    if (!ts.isCallExpression(node)) {
      ts.forEachChild(node, visit);
      return;
    }
    const callee = node.expression.getText(sf);
    const isEach =
      callee === 'test.each' ||
      callee.endsWith('.each') ||
      callee === 'test.describe.each' ||
      callee.endsWith('.describe.each');
    if (isEach && node.arguments[0]) {
      const a0 = node.arguments[0];
      if (ts.isArrayLiteralExpression(a0)) {
        rows = Math.max(rows, a0.elements.length);
      } else if (ts.isNoSubstitutionTemplateLiteral(a0)) {
        const lineCount = a0.text
          .split('\n')
          .filter((l) => l.trim().length > 0).length;
        rows = Math.max(rows, Math.max(1, lineCount - 1));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return rows;
}

/** @param {import('typescript').SourceFile} sf */
export function fileContainsJsx(sf) {
  let found = false;
  const visit = (node) => {
    if (found) {
      return;
    }
    if (
      ts.isJsxElement(node) ||
      ts.isJsxSelfClosingElement(node) ||
      ts.isJsxFragment(node) ||
      ts.isJsxExpression(node)
    ) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

/**
 * Tokens used to match spec titles to a pages/* top-level folder name (e.g. SwapPage → swap, swappage).
 * @param {string} dirName
 */
export function featureDirMatchTokens(dirName) {
  const normalized = dirName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  const words = normalized.split(/[\s-_]+/).filter((w) => w.length > 0);
  const tokens = new Set([dirName.toLowerCase(), ...words]);
  if (words.length > 1) {
    tokens.add(words.join(''));
  }
  return [...tokens].filter(
    (t) => t.length >= 3 && !GENERIC_FEATURE_TOKENS.has(t),
  );
}

/**
 * String titles from test / noExtTest / extensionTest and .describe / .skip / .only (first arg when it is a string).
 * @param {import('typescript').SourceFile} sf
 */
export function collectPlaywrightTestAndDescribeTitles(sf) {
  /** @type {string[]} */
  const titles = [];
  const testLikeIds = new Set(['test', 'it', 'noExtTest', 'extensionTest']);

  const visit = (node) => {
    if (!ts.isCallExpression(node) || !node.arguments[0]) {
      ts.forEachChild(node, visit);
      return;
    }
    const a0 = node.arguments[0];
    if (!ts.isStringLiteral(a0) && !ts.isNoSubstitutionTemplateLiteral(a0)) {
      ts.forEachChild(node, visit);
      return;
    }
    const title = a0.text;
    const callee = node.expression;
    let take = false;
    if (ts.isIdentifier(callee) && testLikeIds.has(callee.text)) {
      take = true;
    } else if (ts.isPropertyAccessExpression(callee)) {
      const obj = callee.expression;
      const prop = callee.name.text;
      const objText = ts.isIdentifier(obj) ? obj.text : '';
      if (prop === 'describe' && testLikeIds.has(objText)) {
        take = true;
      } else if (
        testLikeIds.has(objText) &&
        ['skip', 'only', 'fixme'].includes(prop)
      ) {
        take = true;
      }
    }
    if (take) {
      titles.push(title);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return titles;
}
