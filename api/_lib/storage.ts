import { PrismaClient } from '@prisma/client';

// Singleton database connection for serverless environments
let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    try {
      prismaInstance = new PrismaClient({
        errorFormat: 'minimal',
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      });

      // Configure connection pool for serverless
      prismaInstance.$on('beforeExit', async () => {
        await prismaInstance?.$disconnect();
      });

      // Auto-disconnect after inactivity in serverless environment
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        setTimeout(() => {
          prismaInstance?.$disconnect().catch(console.error);
        }, 60000); // Disconnect after 1 minute of inactivity
      }
    } catch (error) {
      console.error('Failed to initialize Prisma client:', error);
      throw new Error('Database connection failed');
    }
  }
  return prismaInstance;
}

class Storage {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  async getUser(id: number) {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error('Database error in getUser:', error);
      throw new Error('Failed to fetch user');
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.error('Database error in getUserByEmail:', error);
      throw new Error('Failed to fetch user by email');
    }
  }

  async createUser(data: any) {
    try {
      // Check if user already exists with this email
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      return await this.prisma.user.create({ data });
    } catch (error) {
      console.error('Database error in createUser:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        throw error; // Re-throw our custom error message
      }
      throw new Error('Failed to create user');
    }
  }

  async createTemporaryUser(data: { email: string; sessionId: string; quizAttemptId: string }) {
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: 'temp', // Temporary password
          firstName: 'Guest',
          lastName: 'User',
          isTemporary: true,
          sessionId: data.sessionId,
          quizAttemptId: data.quizAttemptId,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        }
      });
    } catch (error) {
      console.error('Database error in createTemporaryUser:', error);
      throw new Error('Failed to create temporary user');
    }
  }

  async updateUser(id: number, data: any) {
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      console.error('Database error in updateUser:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error('Database error in deleteUser:', error);
      throw new Error('Failed to delete user');
    }
  }

  async recordQuizAttempt(data: any) {
    // Set expiration based on user type if not already provided
    if (!data.expiresAt) {
      if (data.userId) {
        // Check if user is paid or temporary
        const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
        if (user) {
          if (user.isPaid) {
            // Paid users: no expiration (permanent storage)
            data.expiresAt = null;
          } else if (user.isTemporary) {
            // Temporary users: 90 days
            data.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
          } else {
            // Regular users (shouldn't happen but default to 90 days)
            data.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
          }
        }
      } else {
        // Anonymous users (no userId): 24 hours
        data.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
    }
    return await this.prisma.quizAttempt.create({ data });
  }

  async getQuizAttemptsCount(userId: number) {
    return await this.prisma.quizAttempt.count({ where: { userId } });
  }

  async getQuizAttempts(userId: number) {
    return await this.prisma.quizAttempt.findMany({ where: { userId }, orderBy: { completedAt: 'desc' } });
  }

  async getQuizAttemptsByUserId(userId: number) {
    return this.getQuizAttempts(userId);
  }

  async getQuizAttempt(id: number) {
    return await this.prisma.quizAttempt.findUnique({ where: { id } });
  }

  async getQuizAttemptByUUID(quizAttemptId: string) {
    try {
      return await this.prisma.quizAttempt.findFirst({
        where: { quizAttemptId: quizAttemptId }
      });
    } catch (error) {
      console.error('Database error in getQuizAttemptByUUID:', error);
      throw new Error('Failed to fetch quiz attempt by UUID');
    }
  }

  async updateQuizAttempt(id: number, data: any) {
    return await this.prisma.quizAttempt.update({ where: { id }, data });
  }

  async saveAIContent(quizAttemptId: number, contentType: string, content: any) {
    return await this.prisma.aiContent.create({
      data: {
        quizAttemptId,
        contentType,
        content,
        generatedAt: new Date(),
        createdAt: new Date(),
      },
    });
  }

  async getAllAIContentForQuizAttempt(quizAttemptId: number): Promise<any[]> {
    return await this.prisma.aiContent.findMany({
      where: { quizAttemptId },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async deleteAIContent(
    quizAttemptId: number,
    contentType: string,
  ): Promise<void> {
    await this.prisma.aiContent.deleteMany({
      where: { quizAttemptId, contentType },
    });
  }

  async saveAIContentToQuizAttempt(quizAttemptId: number, contentType: string, content: any) {
    return await this.saveAIContent(quizAttemptId, contentType, content);
  }

  async getAIContent(quizAttemptId: number, contentType: string) {
    return await this.prisma.aiContent.findFirst({
      where: { quizAttemptId, contentType },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async createPayment(data: any) {
    const created = await this.prisma.payment.create({ data });
    // Always fetch the full payment record by ID to ensure all fields are present
    return await this.prisma.payment.findUnique({ where: { id: created.id } });
  }

  async completePayment(paymentId: number) {
    return await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'completed', completedAt: new Date() },
    });
  }

  async linkPaymentToQuizAttempt(paymentId: number, quizAttemptId: number) {
    return await this.prisma.payment.update({ where: { id: paymentId }, data: { quizAttemptId } });
  }

  async getPaymentsByUser(userId: number) {
    return await this.prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async getPaymentsByStripeId(stripePaymentIntentId: string) {
    return await this.prisma.payment.findMany({ where: { stripePaymentIntentId } });
  }

  async getPaymentById(paymentId: number) {
    return await this.prisma.payment.findUnique({ where: { id: paymentId } });
  }

  async getAllPayments(limit = 100) {
    return await this.prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  }

  async getPaymentsWithUsers(options: any = {}) {
    const { limit = 100, offset = 0, status } = options;
    return await this.prisma.payment.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: { user: true },
    });
  }

  async createRefund(data: any) {
    return await this.prisma.refund.create({ data });
  }

  async updateRefundStatus(refundId: number, status: string, processedAt?: Date, stripeRefundId?: string, paypalRefundId?: string) {
    return await this.prisma.refund.update({
      where: { id: refundId },
      data: { status, processedAt, stripeRefundId, paypalRefundId },
    });
  }

  async getRefundsByPayment(paymentId: number) {
    return await this.prisma.refund.findMany({ where: { paymentId }, orderBy: { createdAt: 'desc' } });
  }

  async getRefundById(refundId: number) {
    return await this.prisma.refund.findUnique({ where: { id: refundId } });
  }

  async getAllRefunds(limit = 100) {
    return await this.prisma.refund.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  }

  async storeTemporaryUser(sessionId: string, email: string, data: any) {
    // Always attempt to create the user, handle race condition with try/catch
    try {
      return await this.prisma.user.create({
        data: {
          email,
          password: data.password || '',
          isTemporary: true,
          sessionId,
          tempQuizData: data.quizData || null,
          expiresAt: data.expiresAt || null,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
        },
      });
    } catch (err: any) {
      // Handle unique constraint error (race condition)
      if (err.code === 'P2002') {
        console.info(`[INFO] storeTemporaryUser: User with email ${email} already exists, reusing existing user (non-fatal)`);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) return user;
      }
      throw err;
    }
  }

  async getTemporaryUser(sessionId: string) {
    return await this.prisma.user.findFirst({
      where: { sessionId, isTemporary: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTemporaryUserByEmail(email: string) {
    return await this.prisma.user.findFirst({ where: { email, isTemporary: true }, orderBy: { createdAt: 'desc' } });
  }

  async cleanupExpiredTemporaryUsers() {
    const now = new Date();
    await this.prisma.user.deleteMany({ where: { isTemporary: true, expiresAt: { lt: now } } });
  }

  async cleanupExpiredQuizAttempts() {
    const now = new Date();
    const deletedAttempts = await this.prisma.quizAttempt.deleteMany({
      where: { expiresAt: { lt: now } }
    });
    console.log(`Cleaned up ${deletedAttempts.count} expired quiz attempts`);
    return deletedAttempts.count;
  }

  async convertTemporaryUserToPaid(sessionId: string) {
    // First get the user to find their ID
    const user = await this.prisma.user.findFirst({
      where: { sessionId, isTemporary: true }
    });

    if (user) {
      // Remove expiration from all quiz attempts for this user (now permanent)
      await this.prisma.quizAttempt.updateMany({
        where: { userId: user.id },
        data: { expiresAt: null }
      });
    }

    return await this.prisma.user.updateMany({
      where: { sessionId, isTemporary: true },
      data: { isPaid: true, isTemporary: false, sessionId: undefined, tempQuizData: undefined, expiresAt: undefined, updatedAt: new Date() },
    });
  }

  async makeUserPaidAndRemoveQuizExpiration(userId: number) {
    // Update user to paid status
    await this.prisma.user.update({
      where: { id: userId },
      data: { isPaid: true, isTemporary: false, expiresAt: null }
    });

    // Remove expiration from all quiz attempts for this user (now permanent)
    await this.prisma.quizAttempt.updateMany({
      where: { userId: userId },
      data: { expiresAt: null }
    });
  }

  async isPaidUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return !!(user && user.isPaid);
  }

  async createPasswordResetToken(userId: number, token: string, expiresAt: Date) {
    return await this.prisma.passwordResetToken.create({ data: { userId, token, expiresAt } });
  }

  async getPasswordResetToken(token: string) {
    return await this.prisma.passwordResetToken.findUnique({ where: { token } });
  }

  async deletePasswordResetToken(token: string) {
    return await this.prisma.passwordResetToken.delete({ where: { token } });
  }

  async updateUserPassword(userId: number, hashedPassword: string) {
    return await this.prisma.user.update({ where: { id: userId }, data: { password: hashedPassword, updatedAt: new Date() } });
  }
}

export const storage = new Storage();
