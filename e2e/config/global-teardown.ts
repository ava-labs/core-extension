import { shutdownMockRpcServer } from '../helpers/mockRpcServer';
import { MOCK_RPC_PORT } from '../types/swap';

export default async function globalTeardown() {
  console.log('\n🧹 Running E2E teardown...');

  // Gracefully shut down the mock RPC server via its shutdown endpoint.
  // Playwright runs global-setup and global-teardown in separate processes,
  // so we can't share a server instance variable — instead we send an HTTP
  // request to the known port.
  await shutdownMockRpcServer(MOCK_RPC_PORT);

  console.log('✅ E2E teardown complete!\n');
}
