import { createClient } from "@libsql/client";

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error("DATABASE_URI environment variable is not set");
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
    url: DATABASE_URI as string,
  });

  return cached.conn;
}

export default dbConnect;
