import { PrismaClient } from '@prisma/client';

class Storage {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: any) {
    return await this.prisma.user.create({ data });
  }

  async updateUser(id: number, data: any) {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async recordQuizAttempt(data: any) {
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

  async convertTemporaryUserToPaid(sessionId: string) {
    return await this.prisma.user.updateMany({
      where: { sessionId, isTemporary: true },
      data: { isPaid: true, isTemporary: false, sessionId: undefined, tempQuizData: undefined, expiresAt: undefined, updatedAt: new Date() },
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
