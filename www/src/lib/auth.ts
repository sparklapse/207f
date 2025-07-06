import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte"; 

import type { auth } from "$lib/server/auth";

export const authClient = createAuthClient({
  basePath: "/207f/api/auth",
  plugins: [inferAdditionalFields<typeof auth>()]
})
