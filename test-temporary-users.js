import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema.js';

async function testTemporaryUsers() {
  try {
    console.log('🔍 Testing temporary users in database...');
    
    // Connect to database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ DATABASE_URL not found in environment');
      return;
    }
    
    const client = postgres(connectionString);
    const db = drizzle(client);
    
    // Get all users and check their temporary status
    const allUsers = await db.select().from(users).limit(20);
    
    console.log(`\n📊 Found ${allUsers.length} users in database:`);
    
    allUsers.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   isTemporary: ${user.isTemporary}`);
      console.log(`   isPaid: ${user.isPaid}`);
      console.log(`   Password length: ${user.password?.length || 0}`);
      console.log(`   Session ID: ${user.sessionId || 'none'}`);
      console.log(`   Expires at: ${user.expiresAt || 'none'}`);
    });
    
    // Check specifically for temporary users
    const temporaryUsers = allUsers.filter(u => u.isTemporary === true);
    console.log(`\n🎯 Found ${temporaryUsers.length} temporary users`);
    
    // Check for users with empty passwords
    const emptyPasswordUsers = allUsers.filter(u => !u.password || u.password === '');
    console.log(`\n🔑 Found ${emptyPasswordUsers.length} users with empty passwords`);
    
    if (emptyPasswordUsers.length > 0) {
      console.log('\n⚠️  Users with empty passwords:');
      emptyPasswordUsers.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id}, isTemporary: ${user.isTemporary})`);
      });
    }
    
    // Test a specific temporary user login scenario
    if (temporaryUsers.length > 0) {
      const testUser = temporaryUsers[0];
      console.log(`\n🧪 Testing login scenario for temporary user: ${testUser.email}`);
      console.log(`   isTemporary: ${testUser.isTemporary}`);
      console.log(`   Password: "${testUser.password}"`);
      
      // Simulate what the login logic would do
      if (testUser.isTemporary === true) {
        console.log('✅ Login should be blocked at temporary user check');
      } else {
        console.log('❌ Login would proceed to password check (this is wrong!)');
      }
    }
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Error testing temporary users:', error);
  }
}

testTemporaryUsers(); 