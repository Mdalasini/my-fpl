import { createClient } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  throw new Error("DATABASE_URI environment variable is not set");
} else if (!TURSO_AUTH_TOKEN) {
  throw new Error("AUTH_TOKEN environment variable is not set");
}

declare global {
  var _libsql: {
    conn: ReturnType<typeof createClient> | null;
  };
}

let cached = global._libsql;

if (!cached) {
  cached = global._libsql = { conn: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.conn = createClient({
    url: TURSO_DATABASE_URL as string,
    authToken: TURSO_AUTH_TOKEN as string,
  });

  return cached.conn;
}

export default dbConnect;
