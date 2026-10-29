# Passport Office Clerk integration tests

The normal `npm run test` and `npm run test:e2e` commands never contact Clerk. The real-instance suite is deliberately opt-in:

```sh
npm run test:e2e:clerk
```

It runs through Doppler's `cosmoport-universe` `dev` configuration, maps the server-only Nuxt Clerk variables into the standard Clerk test-helper names, and refuses to start unless both keys are ASCII development keys (`pk_test_` and `sk_test_`). Do not put either key in an `.env` file or CI configuration without an approved secure secret store.

The suite uses Clerk Testing Tokens and a unique `+clerk_test` address for every browser-created user. It drives the real Passport Office UI, verifies the corrected first name, last name, email, and active browser session, then records the exact Clerk user ID in `test-results/clerk-passport-created-users.json`. That ignored manifest is intentionally local evidence for cleanup only.

Cleanup runs after the suite even when a test fails, and the wrapper makes a second cleanup attempt. An `afterEach` hook records each created user's exact Clerk ID before teardown. Cleanup will only delete by that recorded ID after confirming its exact manifest email has the `+clerk_test@` marker; an email alone is never used to discover a deletion target. The wrapper then queries every recorded ID and fails if any still exists. The cleanup code refuses production keys and will stop rather than delete an unrelated user. There is no application endpoint for test-user deletion.

If a run is interrupted, rerun cleanup from the same checkout before discarding `test-results/`:

```sh
npm run test:e2e:clerk:cleanup
```

If the local manifest was lost, or an interrupted run ended before its ID was recorded, do not use a broad deletion query. Use the Clerk development dashboard to locate the unique address printed by the failed test run, confirm it has the `+clerk_test` marker, record its exact Clerk ID, and remove that exact user manually.

Clerk's development test OTP is `424242` for the `+clerk_test` addresses. Testing Tokens intentionally bypass bot protections for automation only; normal Passport Office users still receive Clerk's Challenge suspicious sign-ups and Device Trust protections.
