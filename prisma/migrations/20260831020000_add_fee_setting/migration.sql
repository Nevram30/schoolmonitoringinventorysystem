-- CreateTable
CREATE TABLE "fee_setting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "f_overdue_fee_per_day" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "f_overdue_grace_days" INTEGER NOT NULL DEFAULT 0,
    "f_overdue_max_fee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "f_damage_fee_fair" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "f_damage_fee_damaged" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "f_damage_fee_lost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "f_lost_charge_item_price" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fee_setting_pkey" PRIMARY KEY ("id")
);

-- Seed the single policy row so the settings page always has something to edit.
INSERT INTO "fee_setting" ("id") VALUES (1) ON CONFLICT ("id") DO NOTHING;
