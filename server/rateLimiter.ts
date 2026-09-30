import { getDb } from "../lib/mongodb.ts";

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const IN_MEMORY_ATTEMPTS = new Map<string, AttemptRecord>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

let lastMongoFailure = 0;
const DB_COOLDOWN_MS = 30 * 1000; // 30s cooldown before retrying DB if it failed

// Clean up expired in-memory entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of IN_MEMORY_ATTEMPTS.entries()) {
    if (now > val.resetAt) {
      IN_MEMORY_ATTEMPTS.delete(key);
    }
  }
}, 5 * 60 * 1000).unref?.();

let indexCreated = false;
async function ensureMongoIndex(): Promise<void> {
  if (indexCreated) return;
  if (Date.now() - lastMongoFailure < DB_COOLDOWN_MS) return;

  try {
    const db = await Promise.race([
      getDb(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 1500)),
    ]);
    const col = db.collection("login_attempts");
    await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 900 });
    await col.createIndex({ key: 1 }, { unique: true });
    indexCreated = true;
  } catch {
    lastMongoFailure = Date.now();
  }
}

/**
 * Checks if the identifier (IP + optional email) is currently rate-limited.
 */
export async function checkRateLimit(
  identifier: string
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const now = Date.now();
  const key = identifier.toLowerCase().trim();

  // 1. Always check in-memory first
  const mem = IN_MEMORY_ATTEMPTS.get(key);
  if (mem && now < mem.resetAt && mem.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((mem.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
  }

  // 2. Check MongoDB collection if DB is available (distributed rate limit across Netlify instances)
  if (Date.now() - lastMongoFailure >= DB_COOLDOWN_MS) {
    try {
      await ensureMongoIndex();
      const db = await Promise.race([
        getDb(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 1500)),
      ]);
      const doc = await db.collection("login_attempts").findOne({ key });
      if (doc && doc.count >= MAX_ATTEMPTS) {
        const expiresAt = doc.createdAt ? new Date(doc.createdAt).getTime() + WINDOW_MS : now + WINDOW_MS;
        if (now < expiresAt) {
          const retryAfter = Math.ceil((expiresAt - now) / 1000);
          return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, retryAfter) };
        }
      }
      const currentCount = doc ? doc.count : (mem?.count || 0);
      return {
        allowed: true,
        remaining: Math.max(0, MAX_ATTEMPTS - currentCount),
        retryAfterSeconds: 0,
      };
    } catch {
      lastMongoFailure = Date.now();
    }
  }

  // Fallback to in-memory tracking
  const count = mem?.count || 0;
  return {
    allowed: count < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - count),
    retryAfterSeconds: mem ? Math.ceil((mem.resetAt - now) / 1000) : 0,
  };
}

/**
 * Records a failed authentication attempt.
 */
export async function recordFailedAttempt(identifier: string): Promise<void> {
  const now = Date.now();
  const key = identifier.toLowerCase().trim();

  // 1. Update in-memory
  const mem = IN_MEMORY_ATTEMPTS.get(key);
  if (!mem || now > mem.resetAt) {
    IN_MEMORY_ATTEMPTS.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    mem.count += 1;
  }

  // 2. Update MongoDB collection if available
  if (Date.now() - lastMongoFailure >= DB_COOLDOWN_MS) {
    try {
      await ensureMongoIndex();
      const db = await Promise.race([
        getDb(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 1500)),
      ]);
      await db.collection("login_attempts").updateOne(
        { key },
        {
          $inc: { count: 1 },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    } catch {
      lastMongoFailure = Date.now();
    }
  }
}

/**
 * Resets authentication attempts after a successful login.
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = identifier.toLowerCase().trim();
  IN_MEMORY_ATTEMPTS.delete(key);

  if (Date.now() - lastMongoFailure >= DB_COOLDOWN_MS) {
    try {
      const db = await Promise.race([
        getDb(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB timeout")), 1500)),
      ]);
      await db.collection("login_attempts").deleteOne({ key });
    } catch {
      lastMongoFailure = Date.now();
    }
  }
}
