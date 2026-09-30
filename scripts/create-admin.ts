import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "VrishabhanviVentures@gmail.com";
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
    console.log(" Connected to MongoDB Atlas successfully.");

    const db = client.db(DB_NAME);
    const adminsCol = db.collection("admins");

    // Ensure index on email
    await adminsCol.createIndex({ email: 1 }, { unique: true });

    // Normalize email for case-insensitive lookup
    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

    // Check if admin already exists
    const existingAdmin = await adminsCol.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (existingAdmin) {
      console.log(`ℹ️ Admin user with email "${existingAdmin.email}" already exists. (ID: ${existingAdmin._id})`);
      console.log("No duplicate admin created.");
    } else {
      console.log(`Creating initial admin account for: ${ADMIN_EMAIL}...`);

      // Hash password using bcryptjs
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

      const adminDoc = {
        email: ADMIN_EMAIL.trim(),
        passwordHash,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await adminsCol.insertOne(adminDoc);
      console.log(` Admin user created successfully with ID: ${result.insertedId}`);
      console.log("Password has been securely hashed with bcrypt.");
    }

    // Ensure collections exist with indexes
    const collections = await db.listCollections().toArray();
    const colNames = collections.map((c) => c.name);

    for (const col of ["products", "categories", "orders", "customers"]) {
      if (!colNames.includes(col)) {
        await db.createCollection(col);
        console.log(` Created collection: ${col}`);
      }
    }

    console.log("\n Database initialization complete!");
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
