-- AlterTable
ALTER TABLE "item" ADD COLUMN     "i_date_acquired" DATE;

-- CreateTable
CREATE TABLE "inventory_scan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "s_count" INTEGER NOT NULL DEFAULT 1,
    "first_scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_scan_log" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_scan_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_scan_user_id_last_scanned_at_idx" ON "inventory_scan"("user_id", "last_scanned_at");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_scan_user_id_item_id_key" ON "inventory_scan"("user_id", "item_id");

-- CreateIndex
CREATE INDEX "inventory_scan_log_user_id_scanned_at_idx" ON "inventory_scan_log"("user_id", "scanned_at");

-- CreateIndex
CREATE INDEX "borrow_member_id_idx" ON "borrow"("member_id");

-- CreateIndex
CREATE INDEX "borrow_request_member_id_idx" ON "borrow_request"("member_id");

-- CreateIndex
CREATE INDEX "borrow_request_requested_by_idx" ON "borrow_request"("requested_by");

-- AddForeignKey
ALTER TABLE "inventory_scan" ADD CONSTRAINT "inventory_scan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_scan" ADD CONSTRAINT "inventory_scan_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_scan_log" ADD CONSTRAINT "inventory_scan_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_scan_log" ADD CONSTRAINT "inventory_scan_log_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
