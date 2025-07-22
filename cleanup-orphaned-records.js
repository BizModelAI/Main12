import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, quizAttempts, payments, aiContent } from './shared/schema.ts';
import { eq, inArray } from 'drizzle-orm';

async function cleanupOrphanedRecords() {
  console.log('🧹 Cleaning up orphaned records...\n');
  
  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  try {
    // Get all valid user IDs
    const allUsers = await db.select().from(users);
    const validUserIds = new Set(allUsers.map(u => u.id));
    
    // Get all valid quiz attempt IDs
    const allAttempts = await db.select().from(quizAttempts);
    const validAttemptIds = new Set(allAttempts.map(a => a.id));
    
    // Find orphaned quiz attempts (no valid user)
    const orphanedAttempts = allAttempts.filter(attempt => !validUserIds.has(attempt.userId));
    const orphanedAttemptIds = orphanedAttempts.map(a => a.id);
    
    // Find orphaned payments (no valid user)
    const allPayments = await db.select().from(payments);
    const orphanedPayments = allPayments.filter(payment => !validUserIds.has(payment.userId));
    const orphanedPaymentIds = orphanedPayments.map(p => p.id);
    
    console.log(`Found ${orphanedAttempts.length} orphaned quiz attempts`);
    console.log(`Found ${orphanedPayments.length} orphaned payments`);
    
    if (orphanedAttemptIds.length > 0) {
      console.log('Deleting orphaned quiz attempts...');
      await db.delete(quizAttempts).where(inArray(quizAttempts.id, orphanedAttemptIds));
      console.log(`✅ Deleted ${orphanedAttemptIds.length} orphaned quiz attempts`);
    }
    
    if (orphanedPaymentIds.length > 0) {
      console.log('Deleting orphaned payments...');
      await db.delete(payments).where(inArray(payments.id, orphanedPaymentIds));
      console.log(`✅ Deleted ${orphanedPaymentIds.length} orphaned payments`);
    }
    
    console.log('\n✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await sql.end();
  }
}

cleanupOrphanedRecords(); 