export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

export function isProductionBuild() {
  return process.env.RELEASE === 'production';
}
