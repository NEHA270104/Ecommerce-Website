import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

// Load environment variables if not already loaded
dotenv.config({ path: ".env.local" });
dotenv.config();

const DB_NAME = "vrishabhanvi_ventures";

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: GlobalMongo & typeof globalThis;

let cachedPromise: Promise<MongoClient> | null = null;

function connectClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(
      new Error("MONGODB_URI environment variable is missing. Please set it in .env.local")
    );
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  return client.connect().catch((err) => {
    // Reset cache so subsequent calls can retry
    if (global._mongoClientPromise) delete global._mongoClientPromise;
    cachedPromise = null;
    throw err;
  });
}

// Track which URI was used for the cached promise so that if the env var
// changes (e.g. after editing .env.local and restarting), the cache is
// properly invalidated rather than re-using the old failed connection.
let cachedUri: string | undefined;

export function getMongoClient(): Promise<MongoClient> {
  const currentUri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    // Invalidate cache if URI has changed since last connection
    if (global._mongoClientPromise && cachedUri !== currentUri) {
      delete global._mongoClientPromise;
    }
    if (!global._mongoClientPromise) {
      cachedUri = currentUri;
      global._mongoClientPromise = connectClient();
    }
    return global._mongoClientPromise;
  }

  // Production: invalidate if URI changed
  if (cachedPromise && cachedUri !== currentUri) {
    cachedPromise = null;
  }
  if (!cachedPromise) {
    cachedUri = currentUri;
    cachedPromise = connectClient();
  }
  return cachedPromise;
}

export async function getDb(name: string = DB_NAME): Promise<Db> {
  const client = await getMongoClient();
  return client.db(name);
}

export async function checkMongoConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = await getMongoClient();
    await client.db("admin").command({ ping: 1 });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown connection error";
    return { ok: false, error: msg };
  }
}
