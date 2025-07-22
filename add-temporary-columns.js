import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function addTemporaryColumns() {
  try {
    console.log('🔧 Adding temporary user columns to database...');
    
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
    
    // Add new columns to users table if they don't exist
    console.log('➕ Adding new columns to users table...');
    
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS session_id TEXT,
      ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE NOT NULL,
      ADD COLUMN IF NOT EXISTS is_temporary BOOLEAN DEFAULT FALSE NOT NULL,
      ADD COLUMN IF NOT EXISTS temp_quiz_data JSONB,
      ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP
    `);
    
    console.log('✅ Columns added successfully!');
    
    // Check current users to see their temporary status
    console.log('\n📊 Checking current users...');
    const users = await db.execute(sql`
      SELECT id, email, is_temporary, is_paid, session_id, expires_at 
      FROM users 
      LIMIT 10
    `);
    
    console.log(`Found ${users.rows.length} users:`);
    users.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Email: ${user.email}`);
      console.log(`     is_temporary: ${user.is_temporary}, is_paid: ${user.is_paid}`);
      console.log(`     session_id: ${user.session_id || 'none'}`);
      console.log(`     expires_at: ${user.expires_at || 'none'}`);
    });
    
    await pool.end();
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

addTemporaryColumns(); 