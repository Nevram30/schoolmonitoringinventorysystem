-- CreateTable
CREATE TABLE "borrow_request" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "room_id" INTEGER,
    "br_quantity" INTEGER NOT NULL DEFAULT 1,
    "br_due_date" TIMESTAMP(3) NOT NULL,
    "br_status" INTEGER NOT NULL DEFAULT 1,
    "br_purpose" TEXT,
    "requested_by" INTEGER,
    "reviewed_by" INTEGER,
    "br_reviewed_at" TIMESTAMP(3),
    "br_review_note" TEXT,
    "borrow_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "borrow_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "borrow_request_borrow_id_key" ON "borrow_request"("borrow_id");

-- CreateIndex
CREATE INDEX "borrow_request_br_status_idx" ON "borrow_request"("br_status");

-- CreateIndex
CREATE INDEX "borrow_request_created_at_idx" ON "borrow_request"("created_at");

-- AddForeignKey
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_borrow_id_fkey" FOREIGN KEY ("borrow_id") REFERENCES "borrow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow_request" ADD CONSTRAINT "borrow_request_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
