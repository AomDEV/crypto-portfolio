/*
  Warnings:

  - You are about to alter the column `profit` on the `asset_position` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "asset" ADD COLUMN     "icon_id" TEXT;

-- AlterTable
ALTER TABLE "asset_position" ALTER COLUMN "profit" SET DATA TYPE BIGINT;
