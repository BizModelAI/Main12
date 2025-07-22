import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

async function fixPasswordConstraint() {
  try {
    console.log('🔧 Fixing password constraint for temporary users...');
    
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
    
    // First, update existing temporary users to have empty string passwords instead of null
    console.log('🔄 Updating existing temporary users...');
    await db.execute(sql`
      UPDATE users 
      SET password = '' 
      WHERE is_temporary = true AND (password IS NULL OR password = '')
    `);
    
    // Now modify the password column to allow null values
    console.log('➕ Modifying password column constraint...');
    await db.execute(sql`
      ALTER TABLE users 
      ALTER COLUMN password DROP NOT NULL
    `);
    
    console.log('✅ Password constraint fixed successfully!');
    
    // Verify the change
    console.log('\n📊 Checking password column constraint...');
    const constraintCheck = await db.execute(sql`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'password'
    `);
    
    console.log('Password column details:');
    constraintCheck.rows.forEach(row => {
      console.log(`  Column: ${row.column_name}`);
      console.log(`  Nullable: ${row.is_nullable}`);
      console.log(`  Default: ${row.column_default || 'none'}`);
    });
    
    await pool.end();
    console.log('\n✅ Password constraint fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixPasswordConstraint(); 