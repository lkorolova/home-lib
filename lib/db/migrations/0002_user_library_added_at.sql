ALTER TABLE "UserLibrary"
ADD COLUMN IF NOT EXISTS "added_at" timestamp DEFAULT now();
--> statement-breakpoint
UPDATE "UserLibrary"
SET "added_at" = COALESCE("added_at", "created_at", now())
WHERE "added_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "UserLibrary"
ALTER COLUMN "added_at" SET NOT NULL;