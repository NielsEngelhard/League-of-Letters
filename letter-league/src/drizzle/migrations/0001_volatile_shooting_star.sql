CREATE TABLE "de_words" (
	"word" text PRIMARY KEY NOT NULL,
	"length" integer NOT NULL,
	CONSTRAINT "de_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE "en_words" (
	"word" text PRIMARY KEY NOT NULL,
	"length" integer NOT NULL,
	CONSTRAINT "en_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE "fr_words" (
	"word" text PRIMARY KEY NOT NULL,
	"length" integer NOT NULL,
	CONSTRAINT "fr_words_word_unique" UNIQUE("word")
);
