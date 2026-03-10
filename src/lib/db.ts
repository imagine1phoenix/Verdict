import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
    if (!_db) {
        const url = process.env.DATABASE_URL;
        if (!url) throw new Error("DATABASE_URL is not set");
        _db = drizzle(neon(url), { schema });
    }
    return _db;
}

// Keep the named export for backward compatibility
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_target, prop) {
        return (getDb() as any)[prop];
    },
});

export default db;
