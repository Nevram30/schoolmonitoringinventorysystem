import bcrypt from "bcrypt";

import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

/**
 * Ports `server/db/seeders/20250718001753-demo-user.js` and
 * `server/db/seeders/20250814001800-rooms-seed.js` from the Sequelize app.
 */

const ROOMS = [
  { r_name: "Library", r_description: "2nd Floor - Main library facility", r_status: 1 },
  { r_name: "Speech Laboratory", r_description: "2nd Floor - Speech and communication lab", r_status: 1 },
  { r_name: "Clinic", r_description: "2nd Floor - School health clinic", r_status: 1 },
  { r_name: "Fundamental Laboratory", r_description: "2nd Floor - Basic laboratory facility", r_status: 1 },
  { r_name: "LRC", r_description: "2nd Floor - Learning Resource Center", r_status: 1 },
  { r_name: "Nursing Faculty", r_description: "2nd Floor - Nursing department faculty office", r_status: 1 },
  { r_name: "Guidance Office", r_description: "2nd Floor - Student guidance and counseling", r_status: 1 },
  { r_name: "Presidents Office", r_description: "2nd Floor - School president office", r_status: 1 },
  { r_name: "D21", r_description: "2nd Floor - Room D21", r_status: 1 },
  { r_name: "D22", r_description: "2nd Floor - Room D22", r_status: 1 },
  { r_name: "D23", r_description: "2nd Floor - Room D23", r_status: 1 },
  { r_name: "A31", r_description: "3rd Floor - Room A31", r_status: 1 },
  { r_name: "SHS Faculty", r_description: "3rd Floor - Senior High School faculty office", r_status: 1 },
  { r_name: "A35", r_description: "3rd Floor - Room A35", r_status: 1 },
  { r_name: "A36", r_description: "3rd Floor - Room A36", r_status: 1 },
  { r_name: "B31", r_description: "3rd Floor - Room B31", r_status: 1 },
  { r_name: "B32", r_description: "3rd Floor - Room B32", r_status: 1 },
  { r_name: "C31", r_description: "3rd Floor - Room C31", r_status: 1 },
  { r_name: "C32", r_description: "3rd Floor - Room C32", r_status: 1 },
  { r_name: "C33", r_description: "3rd Floor - Room C33", r_status: 1 },
  { r_name: "C34", r_description: "3rd Floor - Room C34", r_status: 1 },
  { r_name: "C35", r_description: "3rd Floor - Room C35", r_status: 1 },
  { r_name: "C36", r_description: "3rd Floor - Room C36", r_status: 1 },
  { r_name: "D31", r_description: "3rd Floor - Room D31", r_status: 1 },
  { r_name: "D32", r_description: "3rd Floor - Room D32", r_status: 1 },
  { r_name: "D33", r_description: "3rd Floor - Room D33", r_status: 1 },
  { r_name: "AVR", r_description: "4th Floor - Audio Visual Room", r_status: 1 },
  { r_name: "CSS LAB", r_description: "4th Floor - Computer Science and Software laboratory", r_status: 1 },
  { r_name: "CISCO LAB", r_description: "4th Floor - CISCO networking laboratory", r_status: 1 },
  { r_name: "Computer Lab 1", r_description: "4th Floor - Computer laboratory 1", r_status: 1 },
  { r_name: "Internet Lab", r_description: "4th Floor - Internet laboratory", r_status: 1 },
  { r_name: "Computer Lab 2", r_description: "4th Floor - Computer laboratory 2", r_status: 1 },
  { r_name: "B41", r_description: "4th Floor - Room B41", r_status: 1 },
  { r_name: "B42", r_description: "4th Floor - Room B42", r_status: 1 },
  { r_name: "B43", r_description: "4th Floor - Room B43", r_status: 1 },
  { r_name: "B44", r_description: "4th Floor - Room B44", r_status: 1 },
  { r_name: "C41", r_description: "4th Floor - Room C41", r_status: 1 },
  { r_name: "D41", r_description: "4th Floor - Room D41", r_status: 1 },
  { r_name: "D42", r_description: "4th Floor - Room D42", r_status: 1 },
  { r_name: "D43", r_description: "4th Floor - Room D43", r_status: 1 },
  { r_name: "HRM Laboratory", r_description: "4th Floor - Hotel and Restaurant Management laboratory", r_status: 1 },
  { r_name: "A51", r_description: "5th Floor - Room A51", r_status: 1 },
  { r_name: "A52", r_description: "5th Floor - Room A52", r_status: 1 },
  { r_name: "A53", r_description: "5th Floor - Room A53", r_status: 1 },
  { r_name: "A54", r_description: "5th Floor - Room A54", r_status: 1 },
  { r_name: "A55", r_description: "5th Floor - Room A55", r_status: 1 },
  { r_name: "A56", r_description: "5th Floor - Room A56", r_status: 1 },
  { r_name: "B51", r_description: "5th Floor - Room B51", r_status: 1 },
  { r_name: "B52", r_description: "5th Floor - Room B52", r_status: 1 },
  { r_name: "B53", r_description: "5th Floor - Room B53", r_status: 1 },
  { r_name: "B54", r_description: "5th Floor - Room B54", r_status: 1 },
  { r_name: "C51", r_description: "5th Floor - Room C51", r_status: 1 },
  { r_name: "C52", r_description: "5th Floor - Room C52", r_status: 1 },
  { r_name: "C53", r_description: "5th Floor - Room C53", r_status: 1 },
  { r_name: "C54", r_description: "5th Floor - Room C54", r_status: 1 },
  { r_name: "C55", r_description: "5th Floor - Room C55", r_status: 1 },
  { r_name: "C56", r_description: "5th Floor - Room C56", r_status: 1 },
  { r_name: "C51", r_description: "5th Floor - Room C51 (duplicate entry for reference)", r_status: 1 },
  { r_name: "D52", r_description: "5th Floor - Room D52", r_status: 1 },
  { r_name: "D53", r_description: "5th Floor - Room D53", r_status: 1 },
  { r_name: "PE Room", r_description: "6th Floor - Physical Education room", r_status: 1 },
  { r_name: "B61", r_description: "6th Floor - Room B61", r_status: 1 },
  { r_name: "B62", r_description: "6th Floor - Room B62", r_status: 1 },
  { r_name: "B63", r_description: "6th Floor - Room B63", r_status: 1 },
  { r_name: "B64", r_description: "6th Floor - Room B64", r_status: 1 },
  { r_name: "Digital Lab", r_description: "6th Floor - Digital laboratory", r_status: 1 },
  { r_name: "Energy Conversion Lab", r_description: "6th Floor - Energy conversion laboratory", r_status: 1 },
  { r_name: "Physics Lab", r_description: "6th Floor - Physics laboratory", r_status: 1 },
  { r_name: "Drawing Room 1", r_description: "6th Floor - Technical drawing room 1", r_status: 1 },
  { r_name: "Drawing Room 2", r_description: "6th Floor - Technical drawing room 2", r_status: 1 },
  { r_name: "Stock Room", r_description: "6th Floor - Stock/Storage room", r_status: 1 },
  { r_name: "Criminology Lab", r_description: "6th Floor - Criminology laboratory", r_status: 1 },
  { r_name: "D61", r_description: "6th Floor - Room D61", r_status: 1 },
  { r_name: "D62", r_description: "6th Floor - Room D62", r_status: 1 },
  { r_name: "D63", r_description: "6th Floor - Room D63", r_status: 1 },
  { r_name: "B71", r_description: "7th Floor - Room B71", r_status: 1 },
  { r_name: "B72", r_description: "7th Floor - Room B72", r_status: 1 },
  { r_name: "B73", r_description: "7th Floor - Room B73", r_status: 1 },
  { r_name: "B74", r_description: "7th Floor - Room B74", r_status: 1 },
  { r_name: "Anatomy Lab", r_description: "7th Floor - Anatomy laboratory", r_status: 1 },
  { r_name: "Microbiology Lab", r_description: "7th Floor - Microbiology laboratory", r_status: 1 },
  { r_name: "Chem Lab", r_description: "7th Floor - Chemistry laboratory", r_status: 1 },
  { r_name: "Biochem Lab", r_description: "7th Floor - Biochemistry laboratory", r_status: 1 },
  { r_name: "D71", r_description: "7th Floor - Room D71", r_status: 1 },
  { r_name: "D72", r_description: "7th Floor - Room D72", r_status: 1 },
  { r_name: "D73", r_description: "7th Floor - Room D73", r_status: 1 },
];

/**
 * The default administrator. Sign-in is by ID number, so this is the only
 * account that ships with one — faculty, staff and student accounts are given
 * their real school ID by the admin on /admin/users.
 */
const ADMIN = {
  name: "System Administrator",
  username: "admin",
  id_number: "ADMIN-001",
  email: "admin@school.com",
  password: "admin",
};

async function seedAdmin() {
  const existing = await db.user.findUnique({
    where: { username: ADMIN.username },
  });

  if (existing) {
    if (existing.id_number) {
      console.log(
        `Admin already exists with ID number ${existing.id_number}, skipping.`
      );
      return;
    }

    // A database seeded before login moved to ID numbers has an admin with no
    // ID, which would leave nobody able to sign in — backfill the default.
    const taken = await db.user.findUnique({
      where: { id_number: ADMIN.id_number },
    });

    if (taken) {
      console.log(
        `Admin has no ID number but ${ADMIN.id_number} is taken by user #${taken.id}; set one manually.`
      );
      return;
    }

    await db.user.update({
      where: { id: existing.id },
      data: { id_number: ADMIN.id_number },
    });

    console.log(`Backfilled admin ID number ${ADMIN.id_number}.`);
    return;
  }

  const clash = await db.user.findFirst({
    where: {
      OR: [{ id_number: ADMIN.id_number }, { email: ADMIN.email }],
    },
  });

  if (clash) {
    console.log(
      `Cannot seed the admin: ID number ${ADMIN.id_number} or e-mail ${ADMIN.email} is already used by user #${clash.id}.`
    );
    return;
  }

  await db.user.create({
    data: {
      name: ADMIN.name,
      username: ADMIN.username,
      email: ADMIN.email,
      id_number: ADMIN.id_number,
      password: await bcrypt.hash(ADMIN.password, 10),
      role: "admin",
      status: 1,
    },
  });

  console.log(
    `Seeded the default admin — ID number "${ADMIN.id_number}", password "${ADMIN.password}".`
  );
}

async function seedRooms() {
  const count = await db.room.count();

  if (count > 0) {
    console.log(`Rooms already exist (${count}), skipping.`);
    return;
  }

  await db.room.createMany({ data: ROOMS });

  console.log(`Seeded ${ROOMS.length} rooms.`);
}

async function main() {
  await seedAdmin();
  await seedRooms();
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
