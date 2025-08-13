CREATE TABLE "nl_words" (
	"word" text PRIMARY KEY NOT NULL,
	"length" integer NOT NULL,
	CONSTRAINT "nl_words_word_unique" UNIQUE("word")
);
