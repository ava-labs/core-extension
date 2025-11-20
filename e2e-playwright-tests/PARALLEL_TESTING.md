# Parallel Testing Configuration

This document explains the parallel testing setup for Core Extension E2E tests.

## Overview

The test suite is configured to run tests in parallel using two mechanisms:

1. **Sharding**: Distributes test files across multiple CI runners
2. **Workers**: Runs multiple tests in parallel within each shard

## Configuration

### Local Development

**Default Behavior:**

- Uses all available CPU cores (Playwright default: 50% of cores)
- Full parallelization enabled (tests within files run in parallel)
- No retries on failure
- HTML reporter for results

**Running Tests Locally:**

```bash
# Run all tests in parallel (uses default workers)
npm test

# Run with specific number of workers
npx playwright test --workers=4

# Run tests sequentially (no parallelization)
npx playwright test --workers=1

# Run with debug (always sequential)
npx playwright test --debug
```

### CI Environment

**Configuration:**

- **Shards**: 4 parallel shards (distributes test files)
- **Workers**: 4 workers per shard (parallel test execution)
- **Total parallelism**: Up to 16 tests running simultaneously (4 shards × 4 workers)
- **Retries**: 2 retries per test on failure
- **Runner**: ubuntu-latest-16-cores-core-extension (16 vCPUs)
- **Resources per shard**: 4 CPUs, 4GB RAM, 2GB shared memory

**How It Works:**

1. Test files are divided into 4 equal shards
2. Each shard runs on a separate CI runner
3. Within each shard, 4 workers run tests in parallel
4. Results are combined and uploaded to TestRail

## Performance Comparison

### Before (Sequential)

- **Setup**: 1 shard, 1 worker
- **Parallelism**: None
- **Estimated time**: ~15-20 minutes for smoke tests

### After (Parallel)

- **Setup**: 4 shards, 4 workers per shard
- **Parallelism**: 16x potential speedup
- **Estimated time**: ~4-6 minutes for smoke tests
- **Speedup**: ~70-75% reduction in execution time

## Adjusting Parallelism

### Increase Parallelism (More Speed)

**Option 1: More Shards**

```yaml
# .github/workflows/smoke_tests.yaml
matrix:
  shardIndex: [1, 2, 3, 4, 5, 6, 7, 8] # 8 shards
  shardTotal: [8]
```

**Option 2: More Workers**

```yaml
# .github/workflows/smoke_tests.yaml
env:
  WORKERS: '8' # 8 workers per shard
```

**Note**: Be mindful of:

- CI runner capacity (16 cores total)
- Resource constraints per container
- GitHub Actions concurrent job limits

### Decrease Parallelism (More Stability)

**For flaky tests or resource-constrained environments:**

```yaml
# .github/workflows/smoke_tests.yaml
matrix:
  shardIndex: [1, 2] # 2 shards
  shardTotal: [2]

env:
  WORKERS: '2' # 2 workers per shard
```

## Environment Variables

| Variable           | Default                       | Description                                      |
| ------------------ | ----------------------------- | ------------------------------------------------ |
| `WORKERS`          | `4` (CI), `undefined` (local) | Number of parallel workers                       |
| `CI`               | N/A                           | Auto-detected, enables CI-specific configuration |
| `PLAYWRIGHT_SHARD` | N/A                           | Set by workflow, identifies current shard        |

## Troubleshooting

### Tests are flaky in parallel mode

**Symptoms**: Tests pass sequentially but fail in parallel

**Solutions**:

1. Reduce workers: `WORKERS=2`
2. Reduce shards to 2 or 1
3. Check for shared state between tests
4. Ensure tests are properly isolated

### Out of memory errors

**Symptoms**: Container crashes or "Out of memory" errors

**Solutions**:

1. Reduce workers: `WORKERS=2`
2. Increase memory: `--memory=8g`
3. Increase shared memory: `--shm-size=4gb`

### Tests timing out

**Symptoms**: Tests timeout more often in parallel mode

**Solutions**:

1. Increase test timeout in config
2. Reduce parallelism to decrease resource contention
3. Check for resource-heavy operations

## Best Practices

### Writing Parallel-Safe Tests

1. **Isolate State**: Each test should be independent

   ```typescript
   test.beforeEach(async ({ context }) => {
     // Fresh context for each test
   });
   ```

2. **Avoid Shared Resources**: Don't write to same files/databases

   ```typescript
   // Bad: shared file
   const dataFile = 'test-data.json';

   // Good: unique per test
   const dataFile = `test-data-${Date.now()}-${Math.random()}.json`;
   ```

3. **Use Test Fixtures**: Playwright fixtures handle isolation automatically

   ```typescript
   test('my test', async ({ extensionPage }) => {
     // Fresh extension page per test
   });
   ```

4. **Mark Serial Tests**: For tests that must run sequentially
   ```typescript
   test.describe.serial('sequential tests', () => {
     // These tests run one after another
   });
   ```

### Monitoring Performance

Check the CI logs for parallel execution stats:

```
Running 50 tests using 4 workers
  Shard 1 of 4: 13 tests
  Shard 2 of 4: 12 tests
  Shard 3 of 4: 12 tests
  Shard 4 of 4: 13 tests
```

## Costs vs Benefits

### Benefits

✅ 70-75% faster test execution
✅ Quicker feedback on PRs
✅ More tests can run in same time
✅ Better CI resource utilization

### Costs

⚠️ Slightly higher resource usage (4 runners instead of 1)
⚠️ More complex debugging (4 parallel logs)
⚠️ Potential for flaky tests if not isolated properly
⚠️ Increased GitHub Actions minutes usage

## FAQ

**Q: Why 4 shards and 4 workers?**
A: Optimized for the 16-core CI runner. 4 shards × 4 workers = 16 parallel tests maximum.

**Q: Can I run with more than 16 parallel tests?**
A: Yes, but you'll hit resource constraints. Monitor memory and CPU usage.

**Q: Do I need to change my tests?**
A: No, if tests are already isolated. Most tests should work as-is.

**Q: What if a test is flaky in parallel mode?**
A: Mark it with `test.describe.serial()` or use `test.slow()` to give it more time.

**Q: How do I test parallel configuration locally?**
A: Run `npx playwright test --shard=1/4 --workers=4` to simulate one shard.

## References

- [Playwright Parallelization](https://playwright.dev/docs/test-parallel)
- [Playwright Sharding](https://playwright.dev/docs/test-sharding)
- [GitHub Actions Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
