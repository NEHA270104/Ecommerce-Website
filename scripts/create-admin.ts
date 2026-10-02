import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DB_NAME = "vrishabhanvi_ventures";

async function main() {
  console.log("==========================================");
  console.log(" Vrishabhanvi Ventures - Admin Seed Script");
  console.log("==========================================");

  if (!MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI is not defined in .env.local");
    console.error("Please add your MongoDB Atlas connection string to .env.local");
    process.exit(1);
  }

  if (!ADMIN_EMAIL) {
    console.error("❌ Error: ADMIN_EMAIL is not defined in environment or .env.local");
    process.exit(1);
  }

  if (!ADMIN_PASSWORD) {
    console.error("❌ Error: ADMIN_PASSWORD is not defined in environment or .env.local");
    console.error("Please set a secure ADMIN_PASSWORD before seeding the admin account.");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`);

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas successfully.");

    const db = client.db(DB_NAME);
    const adminsCol = db.collection("admins");

    // Ensure unique index on email
    await adminsCol.createIndex({ email: 1 }, { unique: true });

    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

    // Hash the password with bcrypt (10 salt rounds)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // Check how many admin documents exist
    const existingCount = await adminsCol.countDocuments();

    if (existingCount === 0) {
      // No admin exists — create fresh
      console.log(`Creating initial admin account for: ${normalizedEmail} ...`);
      const adminDoc = {
        email: normalizedEmail,
        passwordHash,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await adminsCol.insertOne(adminDoc);
      console.log(`✅ Admin user created with ID: ${result.insertedId}`);
    } else {
      // Admin(s) exist — upsert: update first admin record with new email + password
      console.log(`ℹ️  Existing admin record(s) found (${existingCount}). Updating credentials...`);
      const existing = await adminsCol.findOne({});
      const updateResult = await adminsCol.updateOne(
        { _id: existing!._id },
        {
          $set: {
            email: normalizedEmail,
            passwordHash,
            role: "admin",
            updatedAt: new Date(),
          },
        }
      );
      if (updateResult.modifiedCount > 0) {
        console.log(`✅ Admin credentials updated successfully (ID: ${existing!._id})`);
      } else {
        console.log("ℹ️  No changes were made (credentials may already match).");
      }
      // Remove any duplicate admin accounts beyond the first one
      if (existingCount > 1) {
        const allAdmins = await adminsCol.find({}).toArray();
        const idsToRemove = allAdmins.slice(1).map((a) => a._id);
        await adminsCol.deleteMany({ _id: { $in: idsToRemove } });
        console.log(`🧹 Removed ${idsToRemove.length} duplicate admin account(s).`);
      }
    }

    console.log("✅ Password hashed securely with bcrypt (10 rounds).");

    // Ensure base collections exist
    const collections = await db.listCollections().toArray();
    const colNames = collections.map((c) => c.name);
    for (const col of ["products", "categories", "orders", "customers"]) {
      if (!colNames.includes(col)) {
        await db.createCollection(col);
        console.log(`✅ Created collection: ${col}`);
      }
    }

    console.log("\n✅ Database initialization complete!");
    console.log("==========================================");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("\n❌ Failed to seed admin user:", message);
    console.error("\nTip: Ensure your MongoDB Atlas cluster allows connections from your current IP address (Network Access -> 0.0.0.0/0).");
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("Database connection closed.");
    }
  }
}

main();
