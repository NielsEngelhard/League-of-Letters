CREATE TABLE "guest_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"secretKey" timestamp with time zone DEFAULT now() NOT NULL
);
