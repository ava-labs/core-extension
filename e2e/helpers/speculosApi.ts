export const SPECULOS_DEFAULT_PORT = 5050;

export class SpeculosApi {
  readonly url: string;

  constructor(
    port = Number(process.env.SPECULOS_PORT) || SPECULOS_DEFAULT_PORT,
  ) {
    this.url = `http://localhost:${port}`;
  }

  async isRunning(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.url}/events?currentscreenonly=true`,
        {
          signal: AbortSignal.timeout(5_000),
        },
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
