ALTER TABLE "account_settings" ADD COLUMN "showCompleteCorrect" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "account_settings" DROP COLUMN "showLettersOnTopOfScreen";--> statement-breakpoint
ALTER TABLE "account_settings" DROP COLUMN "showGuessedLettersBar";