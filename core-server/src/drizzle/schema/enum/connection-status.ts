import { pgEnum } from "drizzle-orm/pg-core";
import { connectionStatusses } from "@/features/realtime/realtime-models";

export const connectionStatusEnum = pgEnum('connection_status', connectionStatusses);

