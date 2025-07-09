import { sequence } from "@sveltejs/kit/hooks";
import { databaseHandle } from "$lib/server/db";
import { authHandle } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = sequence(databaseHandle, authHandle);
