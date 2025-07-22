import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, quizAttempts, payments, aiContent } from './shared/schema.ts';

async function checkDatabase() {
<<<<<<< HEAD
  console.log('🔍 Checking database state...\n');
  
  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
=======
  console.log('� Checking Database State...\n');

>>>>>>> 02c75d7 (Automated commit: apply latest changes)
  try {
    // Check users table
    console.log('📊 USERS TABLE:');
    const allUsers = await db.select().from(users).orderBy(users.id);
    console.log(`Total users: ${allUsers.length}`);
    
    allUsers.forEach(user => {
      console.log(`  User ${user.id}: ${user.email} | Temporary: ${user.isTemporary} | Paid: ${user.isPaid} | First Report: ${user.hasUnlockedFirstReport} | Session: ${user.sessionId?.substring(0, 20)}...`);
    });
    
    // Check quiz attempts table
    console.log('\n📝 QUIZ ATTEMPTS TABLE:');
    const allAttempts = await db.select().from(quizAttempts).orderBy(quizAttempts.id);
    console.log(`Total quiz attempts: ${allAttempts.length}`);
    
    allAttempts.forEach(attempt => {
      console.log(`  Attempt ${attempt.id}: User ${attempt.userId} | Paid: ${attempt.isPaid} | Completed: ${attempt.completedAt?.toISOString().substring(0, 19)}`);
    });
    
    // Check payments table
    console.log('\n💰 PAYMENTS TABLE:');
    const allPayments = await db.select().from(payments).orderBy(payments.id);
    console.log(`Total payments: ${allPayments.length}`);
    
    allPayments.forEach(payment => {
      console.log(`  Payment ${payment.id}: User ${payment.userId} | Type: ${payment.type} | Status: ${payment.status} | Amount: $${payment.amount} | Quiz Attempt: ${payment.quizAttemptId}`);
    });
    
    // Check AI content table
    console.log('\n🤖 AI CONTENT TABLE:');
    const allAIContent = await db.select().from(aiContent).orderBy(aiContent.id);
    console.log(`Total AI content entries: ${allAIContent.length}`);
    
    allAIContent.forEach(content => {
      console.log(`  AI Content ${content.id}: Quiz Attempt ${content.quizAttemptId} | Type: ${content.contentType} | Created: ${content.createdAt?.toISOString().substring(0, 19)}`);
    });
    
    // Check relationships
    console.log('\n🔗 RELATIONSHIP ANALYSIS:');
    
    // Users with quiz attempts
    const usersWithAttempts = allUsers.filter(user => 
      allAttempts.some(attempt => attempt.userId === user.id)
    );
    console.log(`Users with quiz attempts: ${usersWithAttempts.length}/${allUsers.length}`);
    
    // Quiz attempts with payments
    const attemptsWithPayments = allAttempts.filter(attempt => 
      allPayments.some(payment => payment.quizAttemptId === attempt.id)
    );
    console.log(`Quiz attempts with payments: ${attemptsWithPayments.length}/${allAttempts.length}`);
    
    // Paid quiz attempts
    const paidAttempts = allAttempts.filter(attempt => attempt.isPaid);
    console.log(`Paid quiz attempts: ${paidAttempts.length}/${allAttempts.length}`);
    
    // Temporary users
    const temporaryUsers = allUsers.filter(user => user.isTemporary);
    console.log(`Temporary users: ${temporaryUsers.length}/${allUsers.length}`);
    
    // Paid users
    const paidUsers = allUsers.filter(user => user.isPaid);
    console.log(`Paid users: ${paidUsers.length}/${allUsers.length}`);
    
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await sql.end();
  }
<<<<<<< HEAD
=======

  console.log('\n� Database Check Complete');
>>>>>>> 02c75d7 (Automated commit: apply latest changes)
}

checkDatabase(); 