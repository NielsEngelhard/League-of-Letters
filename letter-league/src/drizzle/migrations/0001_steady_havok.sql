ALTER TABLE "account_settings" ADD COLUMN "showKeyboardHints" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "account_settings" ADD COLUMN "showLettersOnTopOfScreen" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "account_settings" ADD COLUMN "showGuessedLettersBar" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "account_settings" ADD COLUMN "preFillGuess" boolean DEFAULT false NOT NULL;