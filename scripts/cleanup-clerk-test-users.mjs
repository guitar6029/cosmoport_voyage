import { assertRecordedClerkTestUsersDeleted, cleanupClerkTestUsers } from "./clerk-test-users.mjs";

process.env.CLERK_PUBLISHABLE_KEY = process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
process.env.CLERK_SECRET_KEY = process.env.NUXT_CLERK_SECRET_KEY;
await cleanupClerkTestUsers();
await assertRecordedClerkTestUsersDeleted();
