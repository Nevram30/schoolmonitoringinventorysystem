-- AlterEnum
-- Postgres only allows a new enum value to be *used* after the transaction that
-- added it commits, so nothing else in this migration may reference 'student'.
ALTER TYPE "user_role" ADD VALUE 'student';
