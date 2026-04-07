CREATE TABLE IF NOT EXISTS "Book" (
	"id" varchar(13) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"cover_url" varchar(255) NOT NULL,
	"genre" varchar(255),
	"description" text NOT NULL,
	"publication_year" integer NOT NULL,
	"isbn" varchar(13) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Book_isbn_unique" UNIQUE("isbn"),
	CONSTRAINT "book_isbn_digits_only" CHECK ("isbn" ~ '^[0-9]{13}$')
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserLibrary" (
	"user_id" uuid NOT NULL,
	"book_id" varchar(13) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UserLibrary_user_id_book_id_pk" PRIMARY KEY("user_id","book_id")
);
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "UserLibrary" ADD CONSTRAINT "UserLibrary_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "UserLibrary" ADD CONSTRAINT "UserLibrary_book_id_Book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."Book"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;