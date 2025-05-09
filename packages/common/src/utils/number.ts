export function toPrecision(num: string, precision = 4) {
  const [leftSide, rightSide] = num.split('.');

  if (!rightSide) {
    return leftSide;
  }

  return `${leftSide}.${rightSide.substring(0, precision)}`;
}
