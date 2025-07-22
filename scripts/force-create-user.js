// Recreate a script to forcibly create or reset a test user in the database
import "dotenv/config";
import { storage } from "../server/storage.ts";
import bcrypt from "bcrypt";

async function forceCreateUser(email, password) {
  if (!email || !password) {
    console.error("Usage: node scripts/force-create-user.js <email> <password>");
    process.exit(1);
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await storage.getUserByEmail(email);
    if (user) {
      console.log(`User with email ${email} exists. Updating password and resetting state...`);
      await storage.updateUser(user.id, {
        password: hashedPassword,
        isPaid: true,
        isTemporary: false,
        expiresAt: null,
        tempQuizData: null,
      });
      user = await storage.getUserByEmail(email);
    } else {
      console.log(`Creating new user with email ${email}...`);
      user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
      });
    }
    console.log("✅ User ready:", { id: user.id, email: user.email });
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create/reset user:", err);
    process.exit(1);
  }
}

const [,, email, password] = process.argv;
forceCreateUser(email, password); 