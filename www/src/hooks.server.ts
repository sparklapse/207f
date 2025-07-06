import { sequence } from "@sveltejs/kit/hooks";
import { authHandle } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = sequence(authHandle);
