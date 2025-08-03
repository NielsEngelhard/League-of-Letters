CREATE TYPE "public"."game_mode" AS ENUM('solo', 'online');--> statement-breakpoint
CREATE TABLE "auth_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"secretKey" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "active_game" (
	"id" text PRIMARY KEY NOT NULL,
	"nRounds" integer NOT NULL,
	"nGuessesPerRound" integer DEFAULT 6 NOT NULL,
	"gameMode" "game_mode" NOT NULL,
	"wordLength" integer NOT NULL,
	"currentRoundIndex" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "active_game_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"gameId" text NOT NULL,
	"username" text,
	"score" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "active_game_round" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" text NOT NULL,
	"roundNumber" integer NOT NULL,
	"currentGuessIndex" integer DEFAULT 1 NOT NULL,
	"word" jsonb NOT NULL,
	"guesses" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evaluated_letters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "active_game_round_gameId_roundNumber_unique" UNIQUE("gameId","roundNumber")
);
--> statement-breakpoint
ALTER TABLE "active_game_player" ADD CONSTRAINT "active_game_player_userId_auth_session_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."auth_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_game_player" ADD CONSTRAINT "active_game_player_gameId_active_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."active_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "active_game_round" ADD CONSTRAINT "active_game_round_gameId_active_game_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."active_game"("id") ON DELETE cascade ON UPDATE no action;