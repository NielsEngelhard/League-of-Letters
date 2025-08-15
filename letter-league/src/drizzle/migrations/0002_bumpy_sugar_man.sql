CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"favouriteWord" text,
	"nGamesPlayed" integer DEFAULT 0 NOT NULL,
	"highestScoreAchieved" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account_settings" (
	"accountId" text PRIMARY KEY NOT NULL,
	"wordInput" "word_input_setting" NOT NULL,
	"theme" "theme_setting" NOT NULL,
	"enableSoundEffects" boolean DEFAULT true NOT NULL,
	"enableBackgroundMusic" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_session" ADD COLUMN "isGuestSession" boolean;--> statement-breakpoint
ALTER TABLE "auth_session" ADD COLUMN "accountId" text;--> statement-breakpoint
ALTER TABLE "account_settings" ADD CONSTRAINT "account_settings_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_accountId_account_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;