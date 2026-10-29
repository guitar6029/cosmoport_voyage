import { cleanupClerkTestUsers } from "../scripts/clerk-test-users.mjs";

export default async function cleanupClerkPassportUsers() {
  await cleanupClerkTestUsers();
}
