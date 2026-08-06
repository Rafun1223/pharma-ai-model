import dotenv from "dotenv";
import prisma from "./config/db.js";

dotenv.config();

const cleanup = async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const result = await prisma.appointment.deleteMany({
    where: { appointmentDate: { lt: cutoff } },
  });

  console.log(`Deleted ${result.count} appointments older than 30 days.`);
  await prisma.$disconnect();
};

cleanup();
