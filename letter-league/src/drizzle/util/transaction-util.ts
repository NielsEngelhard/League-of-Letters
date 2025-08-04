import { db } from "@/drizzle/db";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

export type DbOrTransaction = typeof db | PgTransaction<
    NodePgQueryResultHKT,
    typeof import("@/drizzle/schema"),
    ExtractTablesWithRelations<typeof import("@/drizzle/schema")>
>;