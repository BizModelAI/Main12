/*
  Warnings:

  - You are about to drop the column `is_paid` on the `quiz_attempts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quiz_attempts" DROP COLUMN "is_paid",
ADD COLUMN     "is_report_unlocked" BOOLEAN NOT NULL DEFAULT false;
