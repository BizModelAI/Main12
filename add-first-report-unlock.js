import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function addFirstReportUnlock() {
  try {
    console.log('🔧 Adding first report unlock tracking...');
    
    // Connect to database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ DATABASE_URL not found in environment');
      return;
    }
    
    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    
    const db = drizzle(pool);
    
    // Add has_unlocked_first_report column to users table
    console.log('➕ Adding has_unlocked_first_report column to users table...');
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS has_unlocked_first_report BOOLEAN DEFAULT FALSE NOT NULL
    `);
    
    console.log('✅ First report unlock column added successfully!');
    
    // Check current users
    console.log('\n📊 Checking current users...');
    const users = await db.execute(sql`
      SELECT id, email, is_paid, is_temporary, has_unlocked_first_report 
      FROM users 
      LIMIT 10
    `);
    
    console.log(`Found ${users.rows.length} users:`);
    users.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Email: ${user.email}`);
      console.log(`     isPaid: ${user.is_paid}, isTemporary: ${user.is_temporary}, hasUnlockedFirstReport: ${user.has_unlocked_first_report}`);
    });
    
    await pool.end();
    console.log('\n✅ First report unlock migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

addFirstReportUnlock(); 