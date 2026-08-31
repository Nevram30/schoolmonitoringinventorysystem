-- CreateTable
CREATE TABLE "item_receipt" (
    "id" SERIAL NOT NULL,
    "borrow_id" INTEGER NOT NULL,
    "rc_receiver_name" VARCHAR(150) NOT NULL,
    "rc_receiver_id" VARCHAR(50),
    "rc_contact" VARCHAR(20),
    "rc_relationship" VARCHAR(50) NOT NULL DEFAULT 'self',
    "rc_id_presented" VARCHAR(50),
    "rc_receiver_photo" VARCHAR(255),
    "rc_quantity" INTEGER NOT NULL DEFAULT 1,
    "rc_condition" VARCHAR(50) NOT NULL DEFAULT 'Good',
    "rc_notes" TEXT,
    "rc_received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_receipt_borrow_id_key" ON "item_receipt"("borrow_id");

-- CreateIndex
CREATE INDEX "item_receipt_rc_received_at_idx" ON "item_receipt"("rc_received_at");

-- AddForeignKey
ALTER TABLE "item_receipt" ADD CONSTRAINT "item_receipt_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "borrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_receipt" ADD CONSTRAINT "item_receipt_released_by_fkey" FOREIGN KEY ("released_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
