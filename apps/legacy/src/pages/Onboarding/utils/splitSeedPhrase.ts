export default function splitSeedPhrase(seedPhrase: string): string[] {
  return seedPhrase.trim().split(/\s+/g);
}
