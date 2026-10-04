import bcrypt from "bcrypt";

import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

/**
 * One-off: replaces the ADMIN-001 password with one that meets the password
 * policy. Run with `npx tsx prisma/reset-admin-password.ts`.
 */
const ID_NUMBER = "ADMIN-001";
const NEW_PASSWORD = "Admin@2026";

async function main() {
  const admin = await db.user.findUnique({ where: { id_number: ID_NUMBER } });

  if (!admin) {
    console.log(`No user with ID number ${ID_NUMBER}.`);
    return;
  }

  await db.user.update({
    where: { id: admin.id },
    data: { password: await bcrypt.hash(NEW_PASSWORD, 10) },
  });

  console.log(`Password for ${ID_NUMBER} (user #${admin.id}) updated.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
