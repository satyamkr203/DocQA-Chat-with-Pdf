/*
  Warnings:

  - You are about to drop the column `embeddings` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "embeddings",
ADD COLUMN     "embedding" DOUBLE PRECISION[];
