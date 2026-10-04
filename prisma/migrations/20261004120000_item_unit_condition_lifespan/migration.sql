-- AlterTable
ALTER TABLE "item" ADD COLUMN     "i_unit" VARCHAR(20) NOT NULL DEFAULT 'Per Item',
ADD COLUMN     "i_condition" VARCHAR(20) NOT NULL DEFAULT 'New',
ADD COLUMN     "i_lifespan" INTEGER;

-- The items page used to keep New/Old in `i_status` (1 = New, 0 = Old); carry that over.
UPDATE "item" SET "i_condition" = 'Old' WHERE "i_status" = 0;

-- "0" was never a valid availability code; put those items back to 1 (available).
UPDATE "item" SET "i_status" = 1 WHERE "i_status" = 0;

-- The "School Supplies" category was renamed to "Consumable".
UPDATE "item" SET "i_category" = 'Consumable' WHERE "i_category" = 'School Supplies';
