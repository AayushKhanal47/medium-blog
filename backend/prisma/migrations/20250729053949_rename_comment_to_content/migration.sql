/*
  Warnings:

  - You are about to drop the column `comment` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT;
