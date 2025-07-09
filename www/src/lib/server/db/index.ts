import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

import type { Handle } from "@sveltejs/kit";

export const databaseHandle: Handle = ({ event, resolve }) => {
  const client = postgres(event.platform!.env.HYPERDRIVE.connectionString);
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
