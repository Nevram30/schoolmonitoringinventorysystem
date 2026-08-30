-- AlterTable
-- Nullable so the accounts that already exist stay valid; the Add User form
-- requires both for anything created from now on.
ALTER TABLE "user" ADD COLUMN     "email" VARCHAR(100),
ADD COLUMN     "id_number" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_number_key" ON "user"("id_number");
