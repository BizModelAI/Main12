import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function addQuizAttemptPaymentStatus() {
  try {
    console.log('🔧 Adding payment status to quiz attempts...');
    
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
    
    // Add is_paid column to quiz_attempts table
    console.log('➕ Adding is_paid column to quiz_attempts table...');
    await db.execute(sql`
      ALTER TABLE quiz_attempts 
      ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE NOT NULL
    `);
    
    console.log('✅ Payment status column added successfully!');
    
    // Check current quiz attempts
    console.log('\n📊 Checking current quiz attempts...');
    const attempts = await db.execute(sql`
      SELECT id, user_id, is_paid, completed_at 
      FROM quiz_attempts 
      LIMIT 10
    `);
    
    console.log(`Found ${attempts.rows.length} quiz attempts:`);
    attempts.rows.forEach((attempt, index) => {
      console.log(`  ${index + 1}. ID: ${attempt.id}, UserID: ${attempt.user_id}, isPaid: ${attempt.is_paid}, Completed: ${attempt.completed_at}`);
    });
    
    await pool.end();
    console.log('\n✅ Quiz attempt payment status migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

addQuizAttemptPaymentStatus(); 