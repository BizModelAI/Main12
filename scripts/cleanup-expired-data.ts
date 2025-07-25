#!/usr/bin/env tsx

/**
 * Cleanup Script for Expired Quiz Data
 * 
 * This script removes expired data according to retention policies:
 * - Guest users (anonymous): 24 hours
 * - Temporary users (email provided): 90 days  
 * - Paid users: Forever (no expiration)
 */

import { storage } from '../server/storage.js';

async function main() {
  console.log('🧹 Starting cleanup of expired quiz data...');
  const startTime = Date.now();

  try {
    // Cleanup expired temporary users
    console.log('🔄 Cleaning up expired temporary users...');
    await storage.cleanupExpiredTemporaryUsers();
    console.log('✅ Expired temporary users cleaned up');

    // Cleanup expired quiz attempts
    console.log('🔄 Cleaning up expired quiz attempts...');
    const deletedCount = await storage.cleanupExpiredQuizAttempts();
    console.log(`✅ Cleaned up ${deletedCount} expired quiz attempts`);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`🎉 Cleanup completed successfully in ${duration}s`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

main();
