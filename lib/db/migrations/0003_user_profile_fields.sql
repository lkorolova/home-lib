ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "name" varchar(64);
--> statement-breakpoint
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "surname" varchar(64);