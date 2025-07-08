CREATE SCHEMA "contrib";
--> statement-breakpoint
CREATE TABLE "contrib"."translation" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contrib"."translation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"code" integer NOT NULL,
	"translation" text NOT NULL,
	"difference" real NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contrib"."translation" ADD CONSTRAINT "translation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "translation_user_id_idx" ON "contrib"."translation" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "translation_created_idx" ON "contrib"."translation" USING btree ("created");--> statement-breakpoint
CREATE INDEX "translation_code_idx" ON "contrib"."translation" USING btree ("code");--> statement-breakpoint
CREATE INDEX "translation_difference_idx" ON "contrib"."translation" USING btree ("difference");