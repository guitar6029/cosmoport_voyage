import type { H3Event } from "h3";
import type { ClerkAuth } from "@clerk/nuxt/server";

export function getClerkAuth(event: H3Event): ClerkAuth {
    return (event.context as {
        auth: () => ClerkAuth;
    }).auth();
}
