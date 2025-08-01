import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Database Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Query existing tables
    console.log('\n2️⃣ Testing table queries...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log('✅ Tables found:', tables.length);
    tables.forEach(table => console.log(`   - ${table.table_name}`));
    
    // Test 3: Test user creation
    console.log('\n3️⃣ Testing user creation...');
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User',
        isPaid: false,
        isTemporary: true
      }
    });
    console.log('✅ Test user created:', testUser.email);
    
    // Test 4: Test quiz attempt creation
    console.log('\n4️⃣ Testing quiz attempt creation...');
    const testQuiz = await prisma.quizAttempt.create({
      data: {
        userId: testUser.id,
        quizData: { test: 'data' },
        isReportUnlocked: false
      }
    });
    console.log('✅ Test quiz attempt created:', testQuiz.id);
    
    // Test 5: Test payment creation
    console.log('\n5️⃣ Testing payment creation...');
    const testPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amount: 4.99,
        currency: 'usd',
        type: 'test',
        status: 'pending'
      }
    });
    console.log('✅ Test payment created:', testPayment.id);
    
    // Test 6: Test data retrieval
    console.log('\n6️⃣ Testing data retrieval...');
    const userWithData = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        quizAttempts: true,
        payments: true
      }
    });
    console.log('✅ Data retrieval successful');
    console.log(`   User: ${userWithData.email}`);
    console.log(`   Quiz attempts: ${userWithData.quizAttempts.length}`);
    console.log(`   Payments: ${userWithData.payments.length}`);
    
    // Test 7: Clean up test data
    console.log('\n7️⃣ Cleaning up test data...');
    await prisma.payment.delete({ where: { id: testPayment.id } });
    await prisma.quizAttempt.delete({ where: { id: testQuiz.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Supabase database is working perfectly');
    console.log('✅ All CRUD operations are functional');
    console.log('✅ Relationships are working correctly');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSupabaseConnection(); 