import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { env } from "$env/dynamic/private";

import * as schema from "./schema";

import type { Handle } from "@sveltejs/kit";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const databaseHandle: Handle = ({ event, resolve }) => {
  const client = postgres(env.DATABASE_URL);
  const db = drizzle(client, { schema });

  event.locals.db = db;

  return resolve(event);
};

declare global {
  namespace App {
    interface Locals {
      db: PostgresJsDatabase<typeof schema>;
    }
  }
}
