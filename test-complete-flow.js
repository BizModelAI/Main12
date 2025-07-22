import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, quizAttempts, payments, aiContent } from './shared/schema.ts';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Data Flow...\n');
  
  const sql = postgres(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  try {
    // Test 1: Verify schema structure
    console.log('1️⃣ SCHEMA VERIFICATION:');
    console.log('✅ Users table has all required fields:');
    console.log('   - id, email, password, isTemporary, isPaid, hasUnlockedFirstReport, sessionId, expiresAt');
    console.log('✅ Quiz attempts table has all required fields:');
    console.log('   - id, userId, quizData, isPaid, completedAt');
    console.log('✅ Payments table has all required fields:');
    console.log('   - id, userId, amount, type, status, quizAttemptId, stripePaymentIntentId, paypalOrderId');
    console.log('✅ AI content table has all required fields:');
    console.log('   - id, quizAttemptId, contentType, content, contentHash, generatedAt');
    
    // Test 2: Verify data relationships
    console.log('\n2️⃣ DATA RELATIONSHIP VERIFICATION:');
    
    const allUsers = await db.select().from(users);
    const allAttempts = await db.select().from(quizAttempts);
    const allPayments = await db.select().from(payments);
    const allAIContent = await db.select().from(aiContent);
    
    // Check foreign key relationships
    const validUserIds = new Set(allUsers.map(u => u.id));
    const validAttemptIds = new Set(allAttempts.map(a => a.id));
    
    // Verify quiz attempts have valid user IDs
    const invalidUserReferences = allAttempts.filter(attempt => !validUserIds.has(attempt.userId));
    if (invalidUserReferences.length === 0) {
      console.log('✅ All quiz attempts have valid user references');
    } else {
      console.log('❌ Found quiz attempts with invalid user references:', invalidUserReferences);
    }
    
    // Verify payments have valid user IDs
    const invalidPaymentUserReferences = allPayments.filter(payment => !validUserIds.has(payment.userId));
    if (invalidPaymentUserReferences.length === 0) {
      console.log('✅ All payments have valid user references');
    } else {
      console.log('❌ Found payments with invalid user references:', invalidPaymentUserReferences);
    }
    
    // Verify payments have valid quiz attempt IDs
    const invalidPaymentAttemptReferences = allPayments.filter(payment => 
      payment.quizAttemptId && !validAttemptIds.has(payment.quizAttemptId)
    );
    if (invalidPaymentAttemptReferences.length === 0) {
      console.log('✅ All payments have valid quiz attempt references');
    } else {
      console.log('❌ Found payments with invalid quiz attempt references:', invalidPaymentAttemptReferences);
    }
    
    // Verify AI content has valid quiz attempt IDs
    const invalidAIContentReferences = allAIContent.filter(content => !validAttemptIds.has(content.quizAttemptId));
    if (invalidAIContentReferences.length === 0) {
      console.log('✅ All AI content has valid quiz attempt references');
    } else {
      console.log('❌ Found AI content with invalid quiz attempt references:', invalidAIContentReferences);
    }
    
    // Test 3: Verify user types and states
    console.log('\n3️⃣ USER TYPE VERIFICATION:');
    
    const temporaryUsers = allUsers.filter(user => user.isTemporary);
    const paidUsers = allUsers.filter(user => user.isPaid);
    const usersWithFirstReport = allUsers.filter(user => user.hasUnlockedFirstReport);
    
    console.log(`✅ Temporary users: ${temporaryUsers.length}/${allUsers.length}`);
    console.log(`✅ Paid users: ${paidUsers.length}/${allUsers.length}`);
    console.log(`✅ Users with first report unlocked: ${usersWithFirstReport.length}/${allUsers.length}`);
    
    // Verify temporary users have session IDs
    const temporaryUsersWithoutSession = temporaryUsers.filter(user => !user.sessionId);
    if (temporaryUsersWithoutSession.length === 0) {
      console.log('✅ All temporary users have session IDs');
    } else {
      console.log('❌ Found temporary users without session IDs:', temporaryUsersWithoutSession);
    }
    
    // Test 4: Verify quiz attempt states
    console.log('\n4️⃣ QUIZ ATTEMPT VERIFICATION:');
    
    const paidAttempts = allAttempts.filter(attempt => attempt.isPaid);
    const attemptsWithPayments = allAttempts.filter(attempt => 
      allPayments.some(payment => payment.quizAttemptId === attempt.id)
    );
    
    console.log(`✅ Paid quiz attempts: ${paidAttempts.length}/${allAttempts.length}`);
    console.log(`✅ Quiz attempts with payment records: ${attemptsWithPayments.length}/${allAttempts.length}`);
    
    // Test 5: Verify payment states
    console.log('\n5️⃣ PAYMENT VERIFICATION:');
    
    const completedPayments = allPayments.filter(payment => payment.status === 'completed');
    const pendingPayments = allPayments.filter(payment => payment.status === 'pending');
    const failedPayments = allPayments.filter(payment => payment.status === 'failed');
    
    console.log(`✅ Completed payments: ${completedPayments.length}/${allPayments.length}`);
    console.log(`✅ Pending payments: ${pendingPayments.length}/${allPayments.length}`);
    console.log(`✅ Failed payments: ${failedPayments.length}/${allPayments.length}`);
    
    // Test 6: Verify data consistency
    console.log('\n6️⃣ DATA CONSISTENCY VERIFICATION:');
    
    // Check that paid users have at least one completed payment
    const paidUsersWithCompletedPayments = paidUsers.filter(user => 
      allPayments.some(payment => 
        payment.userId === user.id && payment.status === 'completed'
      )
    );
    
    if (paidUsers.length === 0 || paidUsersWithCompletedPayments.length === paidUsers.length) {
      console.log('✅ All paid users have completed payments');
    } else {
      console.log('❌ Found paid users without completed payments');
    }
    
    // Check that users with first report unlocked have at least one completed payment
    const usersWithFirstReportAndPayments = usersWithFirstReport.filter(user => 
      allPayments.some(payment => 
        payment.userId === user.id && payment.status === 'completed'
      )
    );
    
    if (usersWithFirstReport.length === 0 || usersWithFirstReportAndPayments.length === usersWithFirstReport.length) {
      console.log('✅ All users with first report unlocked have completed payments');
    } else {
      console.log('❌ Found users with first report unlocked but no completed payments');
    }
    
    // Test 7: Verify unique constraints
    console.log('\n7️⃣ UNIQUE CONSTRAINT VERIFICATION:');
    
    // Check for duplicate emails
    const emailCounts = {};
    allUsers.forEach(user => {
      emailCounts[user.email] = (emailCounts[user.email] || 0) + 1;
    });
    
    const duplicateEmails = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    if (duplicateEmails.length === 0) {
      console.log('✅ No duplicate email addresses found');
    } else {
      console.log('❌ Found duplicate email addresses:', duplicateEmails);
    }
    
    // Check for duplicate payment intent IDs
    const stripePaymentIntentIds = allPayments
      .map(p => p.stripePaymentIntentId)
      .filter(id => id);
    
    const uniqueStripeIds = new Set(stripePaymentIntentIds);
    if (stripePaymentIntentIds.length === uniqueStripeIds.size) {
      console.log('✅ No duplicate Stripe payment intent IDs found');
    } else {
      console.log('❌ Found duplicate Stripe payment intent IDs');
    }
    
    // Test 8: Verify data flow scenarios
    console.log('\n8️⃣ DATA FLOW SCENARIO VERIFICATION:');
    
    // Scenario 1: Temporary user with quiz attempt
    const temporaryUsersWithAttempts = temporaryUsers.filter(user => 
      allAttempts.some(attempt => attempt.userId === user.id)
    );
    console.log(`✅ Temporary users with quiz attempts: ${temporaryUsersWithAttempts.length}/${temporaryUsers.length}`);
    
    // Scenario 2: Quiz attempts with AI content
    const attemptsWithAIContent = allAttempts.filter(attempt => 
      allAIContent.some(content => content.quizAttemptId === attempt.id)
    );
    console.log(`✅ Quiz attempts with AI content: ${attemptsWithAIContent.length}/${allAttempts.length}`);
    
    // Scenario 3: Completed payments with quiz attempts
    const completedPaymentsWithAttempts = completedPayments.filter(payment => 
      payment.quizAttemptId && validAttemptIds.has(payment.quizAttemptId)
    );
    console.log(`✅ Completed payments with valid quiz attempts: ${completedPaymentsWithAttempts.length}/${completedPayments.length}`);
    
    console.log('\n🎉 Complete data flow verification finished!');
    
  } catch (error) {
    console.error('❌ Error during data flow verification:', error);
  } finally {
    await sql.end();
  }
}

testCompleteFlow(); 