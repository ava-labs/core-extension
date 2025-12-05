/**
 * @blockaid/client runs environment checks on import.
 * This results in errors being thrown if it gets incluced anywhere in the dependency tree.
 * fetch is not available with the `jest-environment-jsdom` environment.
 * To avoid errors, make sure we mock this library everywhere.
 */

export default class {
  constructor() {
    return {
      site: {
        scan: jest.fn().mockResolvedValue({
          status: 'miss',
        }),
      },
    };
  }
}
