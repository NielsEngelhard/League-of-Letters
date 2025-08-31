CREATE TYPE "public"."supported_language" AS ENUM('nl', 'en', 'de', 'fr');--> statement-breakpoint
CREATE TYPE "public"."game_mode" AS ENUM('solo', 'online');--> statement-breakpoint
CREATE TYPE "public"."connection_status" AS ENUM('empty', 'connecting', 'connected', 'disconnected', 'error');--> statement-breakpoint
CREATE TYPE "public"."theme_setting" AS ENUM('light', 'dark', 'candy', 'hackerman');--> statement-breakpoint
CREATE TYPE "public"."word_input_setting" AS ENUM('on-screen-keyboard', 'html-input', 'keystroke');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"favouriteWord" text,
	"nGamesPlayed" integer DEFAULT 0 NOT NULL,
	"highestScoreAchieved" integer DEFAULT 0 NOT NULL,
	"colorHex" text NOT NULL,
	"isGuestAccount" boolean DEFAULT false NOT NULL,
	"language" "supported_language" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account_settings" (
	"accountId" uuid PRIMARY KEY NOT NULL,
	"wordInput" "word_input_setting" NOT NULL,
	"theme" "theme_setting" NOT NULL,
	"enableSoundEffects" boolean DEFAULT true NOT NULL,
	"showKeyboardHints" boolean DEFAULT true NOT NULL,
	"showCompleteCorrect" boolean DEFAULT false NOT NULL,
	"enableBackgroundMusic" boolean DEFAULT true NOT NULL,
	"preFillGuess" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "active_game" (
	"id" text PRIMARY KEY NOT NULL,
	"nRounds" integer NOT NULL,
	"nGuessesPerRound" integer DEFAULT 6 NOT NULL,
	"gameMode" "game_mode" NOT NULL,
	"currentRoundIndex" integer DEFAULT 1 NOT NULL,
	"gameIsOver" boolean DEFAULT false NOT NULL,
	"nSecondsPerGuess" integer,
	"hostAccountId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"withStartingLetter" boolean DEFAULT true NOT NULL,
	"language" "supported_language" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"gameId" text NOT NULL,
	"username" text,
	"connectionStatus" "connection_status" DEFAULT 'empty' NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 1 NOT NULL,
	"playerLeft" boolean DEFAULT false NOT NULL,
	"colorHex" text
);
--> statement-breakpoint
CREATE TABLE "game_round" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" text NOT NULL,
	"roundNumber" integer NOT NULL,
	"currentGuessIndex" integer DEFAULT 1 NOT NULL,
	"word" jsonb NOT NULL,
	"guesses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"previously_misplaced_letters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_guess_unix_utc_timestamp_in_seconds" bigint,
	"wordLength" integer NOT NULL,
	CONSTRAINT "game_round_gameId_roundNumber_unique" UNIQUE("gameId","roundNumber")
);
--> statement-breakpoint
CREATE TABLE "online_lobby" (
	"id" text PRIMARY KEY NOT NULL,
	"hostAccountId" uuid NOT NULL,
	"language" "supported_language" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "online_lobby_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accountId" uuid NOT NULL,
	"lobbyId" text,
	"username" text DEFAULT 'anonymous' NOT NULL,
	"connectionStatus" "connection_status" DEFAULT 'empty' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "nl_words" (
	"word" text PRIMARY KEY NOT NULL,
	"length" integer NOT NULL,
	CONSTRAINT "nl_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
ALTER TABLE "account_settings" ADD CONSTRAINT "account_settings_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_game" ADD CONSTRAINT "active_game_hostAccountId_account_id_fk" FOREIGN KEY ("hostAccountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_player" ADD CONSTRAINT "game_player_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_player" ADD CONSTRAINT "game_player_gameId_active_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."active_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_round" ADD CONSTRAINT "game_round_gameId_active_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."active_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "online_lobby" ADD CONSTRAINT "online_lobby_hostAccountId_account_id_fk" FOREIGN KEY ("hostAccountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "online_lobby_player" ADD CONSTRAINT "online_lobby_player_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "online_lobby_player" ADD CONSTRAINT "online_lobby_player_lobbyId_online_lobby_id_fk" FOREIGN KEY ("lobbyId") REFERENCES "public"."online_lobby"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "game_player_gameId_position_unique" ON "game_player" USING btree ("gameId","position");