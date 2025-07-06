import { auth } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user ? {
    id: session.user.id,
    email: session.user.email,
  } : null;

  return {
    user,
  };
};
