/*
  Warnings:

  - Changed the type of `price_usd` on the `asset_quote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `volume_usd` on the `asset_quote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price_thb` on the `asset_quote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `volume_thb` on the `asset_quote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "asset_position" ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(100,0),
ALTER COLUMN "profit" SET DATA TYPE DECIMAL(100,0);

-- AlterTable
ALTER TABLE "asset_quote" DROP COLUMN "price_usd",
ADD COLUMN     "price_usd" MONEY NOT NULL,
DROP COLUMN "volume_usd",
ADD COLUMN     "volume_usd" MONEY NOT NULL,
DROP COLUMN "price_thb",
ADD COLUMN     "price_thb" MONEY NOT NULL,
DROP COLUMN "volume_thb",
ADD COLUMN     "volume_thb" MONEY NOT NULL;

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "in" SET DATA TYPE DECIMAL(100,0),
ALTER COLUMN "out" SET DATA TYPE DECIMAL(100,0);
