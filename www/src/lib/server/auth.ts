import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { svelteKitHandler } from "better-auth/svelte-kit";

import { BETTER_AUTH_SECRET, AUTH_GOOGLE_CLIENT, AUTH_GOOGLE_SECRET } from "$env/static/private";

import type { Handle } from "@sveltejs/kit";

export const authHandle: Handle = ({ event, resolve }) => {
  const db = event.locals.db;

  const auth = betterAuth({
    secret: BETTER_AUTH_SECRET,
    basePath: "/207f/api/auth",
    emailAndPassword: {
      enabled: false,
    },
    database: drizzleAdapter(db, { provider: "pg" }),
    socialProviders: {
      google: {
        clientId: AUTH_GOOGLE_CLIENT,
        clientSecret: AUTH_GOOGLE_SECRET,
      },
    },
  });

  event.locals.auth = auth;

  return svelteKitHandler({ event, resolve, auth });
};

declare global {
  namespace App {
    interface Locals {
      auth: ReturnType<typeof betterAuth>;
    }
  }
}
