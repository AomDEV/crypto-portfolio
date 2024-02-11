-- CreateEnum
CREATE TYPE "EDirection" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "EPositionStatus" AS ENUM ('OPEN', 'CLOSE');

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "verified_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_favorite" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_position" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "leverage" INTEGER NOT NULL,
    "direction" "EDirection" NOT NULL DEFAULT 'LONG',
    "amount" BIGINT NOT NULL,
    "entry_price" MONEY NOT NULL,
    "exit_price" MONEY,
    "profit" BIGINT,
    "status" "EPositionStatus" NOT NULL DEFAULT 'OPEN',
    "open_tx_id" TEXT NOT NULL,
    "close_tx_id" TEXT,
    "exited_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_quote" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "price_usd" DOUBLE PRECISION NOT NULL,
    "volume_usd" DOUBLE PRECISION NOT NULL,
    "price_thb" DOUBLE PRECISION NOT NULL,
    "volume_thb" DOUBLE PRECISION NOT NULL,
    "percent_change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "icon_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency_rate" (
    "id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "rate" MONEY NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currency_rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "in" BIGINT NOT NULL,
    "out" BIGINT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_username_key" ON "account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- CreateIndex
CREATE INDEX "account_username_email_idx" ON "account"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "asset_favorite_asset_id_user_id_key" ON "asset_favorite"("asset_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_position_open_tx_id_key" ON "asset_position"("open_tx_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_position_close_tx_id_key" ON "asset_position"("close_tx_id");

-- CreateIndex
CREATE INDEX "asset_position_asset_id_user_id_idx" ON "asset_position"("asset_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_slug_key" ON "asset"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "currency_symbol_key" ON "currency"("symbol");

-- AddForeignKey
ALTER TABLE "asset_favorite" ADD CONSTRAINT "asset_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_favorite" ADD CONSTRAINT "asset_favorite_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_position" ADD CONSTRAINT "asset_position_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_position" ADD CONSTRAINT "asset_position_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_position" ADD CONSTRAINT "asset_position_open_tx_id_fkey" FOREIGN KEY ("open_tx_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_position" ADD CONSTRAINT "asset_position_close_tx_id_fkey" FOREIGN KEY ("close_tx_id") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_quote" ADD CONSTRAINT "asset_quote_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currency_rate" ADD CONSTRAINT "currency_rate_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
