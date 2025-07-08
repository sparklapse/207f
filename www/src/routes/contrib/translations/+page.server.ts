import { z } from "zod";
import { error } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

import { and, eq, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import { translation } from "$lib/server/db/schema";

import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
  const user = await auth.api.getSession({
    headers: request.headers,
  }).then((session) => (session?.user
    ? {
      id: session.user.id,
      email: session.user.email,
    }
    : null));

  const { contrib } = await db
    .select({ contrib: sql<number>`COUNT(DISTINCT ${translation.code})` })
    .from(translation).then((query) => query[0]);

  return {
    user,
    progress: {
      contrib,
      confirmed: 0,
    },
  };
};

const translationType = z.object({
  code: z.number(),
  translation: z.string(),
  difference: z.number(),
});

export const actions: Actions = {
  translate: async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) error(401, "Unauthorized");

    const data = Object.fromEntries((await request.formData()).entries()) as Record<string, string | number>;
    if (typeof data.code === "string") {
      data.code = parseInt(data.code);
    }
    if (typeof data.difference === "string") {
      data.difference = parseFloat(data.difference);
    }

    const parsed = translationType.safeParse(data);
    if (!parsed.success) error(400, "Bad Request");

    const result = {
      userId: session.user.id,
      ...parsed.data,
    };

    const check = await db
      .select()
      .from(translation)
      .where(and(
        eq(translation.userId, result.userId),
        eq(translation.code, result.code),
      ))
      .limit(1)
      .then((query) => query.at(0));

    if (check) {
      await db.update(translation).set({ translation: result.translation, difference: result.difference });
    } else {
      await db.insert(translation).values(result);
    }
  },
};
